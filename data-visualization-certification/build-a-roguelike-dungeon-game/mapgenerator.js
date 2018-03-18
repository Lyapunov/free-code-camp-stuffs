function carveRoom(map,y,x,yrad,xrad) {
   console.log("Check0");
   if ( yrad >= y || xrad >= x || x + xrad >= map[0].length - 1 || y + yrad >= map.length - 1 ) {
      return 0;
   }

   console.log("Check1",x,xrad);
   for ( var py = y - yrad - 1; py <= y + yrad + 1; ++py ) {
      for ( var px = x - xrad - 1; px <= x + xrad + 1; ++px ) {
         if ( map[py][px] != 0 ) {
            return 0;
         }
      }
   }

   var area = 0;
   for ( var py = y - yrad; py <= y + yrad; ++py ) {
      for ( var px = x - xrad; px <= x + xrad; ++px ) {
         map[py][px] = 1;
         ++area;
      }
   }

   return area;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isInsideRoom(py,px,map,y,x,yrad,xrad) {
   return px >= x-xrad && px <= x+xrad && py >= y-yrad && py <= y+yrad;
}

function startingRoomNumber(rooms) {
   var ptr = 0;
   for ( var i = 1; i < rooms.length; ++i ) {
      if ( rooms[i][1] < rooms[ptr][1] || rooms[i][1] == rooms[ptr][1] && rooms[i][0] < rooms[ptr][0] ) {
         ptr = i;
      }
   }
   return ptr;
}

function generateMap(size) {
   var retval = [];
   for ( var y = 0; y < size; ++y ) {
      var row = [];
      for ( var x = 0; x < size; ++x ) {
         row.push(0);
      }
      retval.push(row);
   }
   var sarea = 0;
   var rooms = [];
   for ( var i = 0; i < 100; ++i ) {
      var room = [getRandomInt(30),getRandomInt(30),getRandomInt(5)+1,getRandomInt(5)+1];
      var aarea = carveRoom(retval,...room);
      if ( aarea ) {
         sarea += aarea;
         rooms.push(room);
      }
   }
   var mrn = startingRoomNumber(rooms);
   var tmp = rooms[mrn];
   rooms[mrn] = rooms[0];
   rooms[0] = tmp;
   mrn = 0;

   var tset = [0];
   var tdic = {0:1};
   var oset = [];
   for ( var i = 1; i < rooms.length; ++i ) {
      oset.push(i);
   }
   console.log(tset);
   console.log(oset);
   while ( oset.length > 0 ) {
      var source = tset[getRandomInt(tset.length)];
      var target = oset[getRandomInt(oset.length)];
      console.log('--->',tset,oset,source,target);
      for ( var ty = Math.min(rooms[source][0],rooms[target][0]); ty <= Math.max(rooms[source][0],rooms[target][0]); ++ty ) {
         var py = ty;
         var px = rooms[source][1];
         retval[py][px] = 1;
         for ( var i = 0; i < rooms.length; ++i ) {
            if ( isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
               oset = oset.filter(x=>x!=i);
               tset.push(i);
               tdic[i] = 1;
            }
         }
      }
      console.log('===>');
      for ( var tx = Math.min(rooms[source][1],rooms[target][1]); tx <= Math.max(rooms[source][1],rooms[target][1]); ++tx ) {
         var py = rooms[target][0];
         var px = tx;
         retval[py][px] = 1;
         for ( var i = 0; i < rooms.length; ++i ) {
            if ( isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
               oset = oset.filter(x=>x!=i);
               tset.push(i);
               tdic[i] = 1;
            }
         }
      }
      console.log('===> x');
   }

   console.log(sarea);
/*   console.log(rooms);
   console.log(mrn);*/
   return retval;
}

console.log(generateMap(30));
