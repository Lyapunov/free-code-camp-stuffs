function carveRoom(map,world,y,x,yrad,xrad) {
   if ( yrad >= y || xrad >= x || x + xrad >= map[0].length - 1 || y + yrad >= map.length - 1 ) {
      return 0;
   }

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
         map[py][px] = world;
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
      if ( rooms[i][0] < rooms[ptr][0] || rooms[i][0] == rooms[ptr][0] && rooms[i][1] < rooms[ptr][1] ) {
         ptr = i;
      }
   }
   return ptr;
}

function throneRoomNumber(rooms) {
   var ptr = 0;
   for ( var i = 1; i < rooms.length; ++i ) {
      if ( rooms[i][0] > rooms[ptr][0] || rooms[i][0] == rooms[ptr][0] && rooms[i][1] > rooms[ptr][1] ) {
         ptr = i;
      }
   }
   return ptr;
}

function generateBasicRoomStructure(sizeY,sizeX,world) {
   var retval = [];
   for ( var y = 0; y < sizeY; ++y ) {
      var row = [];
      for ( var x = 0; x < sizeX; ++x ) {
         row.push(0);
      }
      retval.push(row);
   }
   var rooms = [];
   rooms.push([2,2,1,1]);
   var sarea = carveRoom(retval,world,...rooms[0]);
   for ( var i = 0; i < 200; ++i ) {
      var room = [getRandomInt(sizeY),getRandomInt(sizeX),getRandomInt(5)+1,getRandomInt(5)+1];
      var aarea = carveRoom(retval,world,...room);
      if ( aarea ) {
         sarea += aarea;
         rooms.push(room);
      }
   }
   return [retval,rooms,sarea];
}

function generateMap(sizeY,sizeX,world) {
   var retval = [];
   var rooms = [];
   var sarea = 0;

   for ( var i = 0; i < 10; ++i ) {
      var [nretval, nrooms, nsarea] = generateBasicRoomStructure(sizeY,sizeX,world);
      if ( nsarea > sarea ) {
         retval = nretval;
         rooms = nrooms;
         sarea = nsarea;
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
   while ( oset.length > 0 ) {
      var source = tset[getRandomInt(tset.length)];
      var target = oset[getRandomInt(oset.length)];
      var type = getRandomInt(2);
      for ( var ty = Math.min(rooms[source][0],rooms[target][0]); ty <= Math.max(rooms[source][0],rooms[target][0]); ++ty ) {
         var py = ty;
         var px = rooms[type?source:target][1];
         retval[py][px] = world;
         for ( var i = 0; i < rooms.length; ++i ) {
            if ( isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
               oset = oset.filter(x=>x!=i);
               tset.push(i);
               tdic[i] = world;
            }
         }
      }
      for ( var tx = Math.min(rooms[source][1],rooms[target][1]); tx <= Math.max(rooms[source][1],rooms[target][1]); ++tx ) {
         var py = rooms[type?target:source][0];
         var px = tx;
         retval[py][px] = world;
         for ( var i = 0; i < rooms.length; ++i ) {
            if ( isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
               oset = oset.filter(x=>x!=i);
               tset.push(i);
               tdic[i] = world;
            }
         }
      }
   }
   // decorating rooms
   {
      if ( world == 1 ) {
         retval[rooms[0][0]][rooms[0][1]-rooms[0][3]] = 6;
      }

      var throneRoom = throneRoomNumber(rooms);
      for ( var i = 1; i < rooms.length; ++i ) {
         if ( i == throneRoom ) {
            continue;
         }
         if ( i % 2 ) {
            if ( rooms[i][2] == 1 && rooms[i][3] == 1 ) {
               retval[rooms[i][0]][rooms[i][1]] = 6 + world;
            } else if ( rooms[i][2] == 1 && rooms[i][3] >= 2 )  {
               retval[rooms[i][0]][rooms[i][1]-1] = 6 + world;
               retval[rooms[i][0]][rooms[i][1]] = 6 + world;
               retval[rooms[i][0]][rooms[i][1]+1] = 6 + world;
            } else if ( rooms[i][2] >= 2 && rooms[i][3] == 1 )  {
               retval[rooms[i][0]-1][rooms[i][1]] = 6 + world;
               retval[rooms[i][0]][rooms[i][1]] = 6 + world;
               retval[rooms[i][0]+1][rooms[i][1]] = 6 + world;
            } else if ( rooms[i][2] == 2 && rooms[i][3] >= 2 || rooms[i][2] >= 2 && rooms[i][3] == 2 ) {
               var type = getRandomInt(2);
               retval[rooms[i][0]-1][rooms[i][1]-1] = 12 + world;
               retval[rooms[i][0]+1][rooms[i][1]-1] = 12 + world;
               if ( type ) {
                  retval[rooms[i][0]][rooms[i][1]-1] = 6 + world;
                  retval[rooms[i][0]][rooms[i][1]] = 6 + world;
                  retval[rooms[i][0]][rooms[i][1]+1] = 6 + world;
               } else {
                  retval[rooms[i][0]-1][rooms[i][1]] = 6 + world;
                  retval[rooms[i][0]][rooms[i][1]] = 6 + world;
                  retval[rooms[i][0]+1][rooms[i][1]] = 6 + world;
               }
            } else {
               var type = getRandomInt(2);
               if ( type ) {
                  for ( var px = -1; px <= 1; ++px ) {
                     for ( var py = -1; py <= 1; ++py ) {
                        if ( !px && !py ) {
                           continue;
                        }
                        retval[rooms[i][0]+py][rooms[i][1]+px] = 6 + world;
                     }
                  }
                  retval[rooms[i][0]-1][rooms[i][1]-2] = 12 + world;
                  retval[rooms[i][0]][rooms[i][1]-2] = 12 + world;
                  retval[rooms[i][0]+1][rooms[i][1]-2] = 12 + world;
               } else {
                  retval[rooms[i][0]-1][rooms[i][1]-1] = 6 + world;
                  retval[rooms[i][0]-1][rooms[i][1]-2] = 12 + world;
                  retval[rooms[i][0]-1][rooms[i][1]+1] = 6 + world;
                  retval[rooms[i][0]-1][rooms[i][1]] = 12 + world;
                  retval[rooms[i][0]+1][rooms[i][1]-1] = 6 + world;
                  retval[rooms[i][0]+1][rooms[i][1]-2] = 12 + world;
                  retval[rooms[i][0]+1][rooms[i][1]+1] = 6 + world;
                  retval[rooms[i][0]+1][rooms[i][1]] = 12 + world;
               }
            }
         }
      }

      retval[rooms[throneRoom][0]][rooms[throneRoom][1]] = 17;
      for ( var i = 1; i <= rooms[throneRoom][3]; ++i ) {
         retval[rooms[throneRoom][0]][rooms[throneRoom][1]+i] = 5;
      }
   }

   console.log('===>',rooms.length,sarea);
   return retval;
}

console.log(generateMap(100,25,1));
