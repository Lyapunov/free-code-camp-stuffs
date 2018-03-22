class MapGenerator {
   carveRoom(map,world,y,x,yrad,xrad) {
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

   getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
   }

   isInsideRoom(py,px,map,y,x,yrad,xrad) {
      return px >= x-xrad && px <= x+xrad && py >= y-yrad && py <= y+yrad;
   }

   generateBasicRoomStructure(sizeY,sizeX,world) {
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
      var sarea = this.carveRoom(retval,world,...rooms[0]);
      for ( var i = 0; i < 1000; ++i ) {
         var room = [this.getRandomInt(sizeY),this.getRandomInt(sizeX),this.getRandomInt(5)+1,this.getRandomInt(5)+1];
         var aarea = this.carveRoom(retval,world,...room);
         if ( aarea ) {
            sarea += aarea;
            rooms.push(room);
         }
      }
      return [retval,rooms,sarea];
   }

   getMapCell(map,y,x) {
      if ( y < 0 || y >= map.length || x < 0 || x >= map[y].length ) {
         return 0;
      }
      return map[y][x];
   }

   bfsMap(map, source, goods) {
      if ( goods.indexOf(this.getMapCell(map, source.y,source.x)) == -1 ) {
         return [];
      }
      var retval = [];
      for ( var y = 0; y < map.length; ++y ) {
         var row = [];
         for ( var x = 0; x < map[y].length; ++x ) {
            row.push(0);
         }
         retval.push(row);
      }
      var hops = {};
      var findings = [[source.y,source.x]];
      hops[findings[0]]=false;
      var level = 1;
      retval[source.y][source.x] = level;
      var dirs = [[0,1],[-1,0],[0,-1],[1,0]];
      while ( findings.length > 0 ) {
         ++level;
         var nfindings = [];
         for ( var i = 0; i < findings.length; ++i ) {
            for ( var j = 0; j < dirs.length; ++j ) {
               var nextp = [(findings[i][0]+dirs[j][1]),(findings[i][1]+dirs[j][0])];
               if ( goods.indexOf(this.getMapCell(map,nextp[0],nextp[1])) >= 0
                 && hops[nextp] === undefined ) {
                  nfindings.push(nextp);
                  hops[nextp] = findings[i];
                  retval[nextp[0]][nextp[1]] = level;
               }
            }
         }
         findings = nfindings;
      }
      return [retval, level];
   }

   countMap(map,low,hi) {
      var retval = 0;
      for ( var y = 0; y < map.length; ++y ) {
         for ( var x = 0; x < map[y].length; ++x ) {
            if ( map[y][x] >= low && map[y][x] < hi ) {
               ++retval;
            }
         }
      }
      return retval;
   }

   getNthCell(map,low,hi,n) {
      var counter = 0;
      for ( var y = 0; y < map.length; ++y ) {
         for ( var x = 0; x < map[y].length; ++x ) {
            if ( map[y][x] >= low && map[y][x] < hi ) {
               if ( counter == n ) {
                  return [y,x];
               }
               ++counter;
            }
         }
      }
      return false;
   }

   generateMap(sizeY,sizeX,world,ept,spt,wpt,createEnemy,createStuff) {
      var retval = [];
      var rooms = [];
      var sarea = 0;

      for ( var i = 0; i < 10; ++i ) {
         var [nretval, nrooms, nsarea] = this.generateBasicRoomStructure(sizeY,sizeX,world);
         if ( nsarea > sarea ) {
            retval = nretval;
            rooms = nrooms;
            sarea = nsarea;
         }
      }

      rooms.sort(function (rooma,roomb) {return (rooma[0] > roomb[0] || rooma[0] == roomb[0] && rooma[1] > roomb[1])
                                               -(roomb[0] > rooma[0] || roomb[0] == rooma[0] && roomb[1] > rooma[1]) });

      var tset = [0];
      var tdic = {0:1};
      var oset = [];
      for ( var i = 1; i < rooms.length; ++i ) {
         oset.push(i);
      }
      while ( oset.length > 0 ) {
         var source = tset[this.getRandomInt(tset.length)];
         var target = oset[this.getRandomInt(oset.length)];
         var type = this.getRandomInt(2);
         for ( var ty = Math.min(rooms[source][0],rooms[target][0]); ty <= Math.max(rooms[source][0],rooms[target][0]); ++ty ) {
            var py = ty;
            var px = rooms[type?source:target][1];
            retval[py][px] = world;
            for ( var i = 0; i < rooms.length; ++i ) {
               if ( this.isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
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
               if ( this.isInsideRoom(py,px,retval,...rooms[i]) && !(tdic[i]) ) {
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

         var throneRoom = rooms.length - 1 ;
         for ( var i = 1; i < rooms.length; ++i ) {
            if ( i == throneRoom ) {
               continue;
            }
            if ( i % 3 ) {
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
                  var type = this.getRandomInt(2);
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
                  var type = this.getRandomInt(2);
                  if ( type ) {
                     for ( var px = -1; px <= 1; ++px ) {
                        for ( var py = -1; py <= 1; ++py ) {
                           if ( !px && !py || px == 1 && !py ) {
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

      console.log('===>',rooms.length,sarea,sarea/sizeX/sizeY);

      if ( createStuff !== undefined && createEnemy !== undefined ) {
         var [hmap,hlev] = this.bfsMap(retval,{y:rooms[0][0],x:rooms[0][1]},[world,5]);
         var helper = [10,Math.floor(hlev/3),Math.floor(2*hlev/3),hlev-2];
         var numbers= [];
         for ( var i = 0; i < 3; ++i ) {
            numbers.push(this.countMap(hmap,helper[i],helper[i+1]));
         }
         var placedict = {};
         var enemies = [];
         var stuffs  = [];
         for ( var i = 0; i < 3; ++i ) {
            {
               var ecounter = 0;
               while ( ecounter < ept ) {
                  var rnum = this.getRandomInt(numbers[i]);
                  var pos  = this.getNthCell(hmap,helper[i],helper[i+1],rnum);
                  if ( !placedict[pos] ) {
                     placedict[pos] = 1;
                     var hienemy = i;
                     var loenemy = Math.max(0,i);
                     enemies.push( createEnemy( pos, ecounter % 2 ? hienemy : loenemy ) );
                     ++ecounter;
                  }
               }
            }
            {
               var scounter = 0;
               while ( scounter < spt ) {
                  var rnum = this.getRandomInt(numbers[i]);
                  var pos  = this.getNthCell(hmap,helper[i],helper[i+1],rnum);
                  if ( !placedict[pos] ) {
                     placedict[pos] = 1;
                     stuffs.push( createStuff( pos, 0 ) ); // healing potion
                     ++scounter;
                  }
               }
            }

            {
               var scounter = 0;
               while ( scounter < 1 ) {
                  var rnum = this.getRandomInt(numbers[i]);
                  var pos  = this.getNthCell(hmap,helper[i],helper[i+1],rnum);
                  if ( !placedict[pos] ) {
                     placedict[pos] = 1;
                     stuffs.push( createStuff( pos, 1 ) ); // poison gas
                     ++scounter;
                  }
               }
            }
            
            if ( i != 1 ) {
               var scounter = 0;
               while ( scounter < wpt ) {
                  var rnum = this.getRandomInt(numbers[i]);
                  var pos  = this.getNthCell(hmap,helper[i],helper[i+1],rnum);
                  if ( !placedict[pos] ) {
                     placedict[pos] = 1;
                     stuffs.push( createStuff( pos, 2+(i>1) ) ); // sword
                     ++scounter;
                  }
               }
            }
            if ( i != 0 ) {
               var scounter = 0;
               while ( scounter < wpt ) {
                  var rnum = this.getRandomInt(numbers[i]);
                  var pos  = this.getNthCell(hmap,helper[i],helper[i+1],rnum);
                  if ( !placedict[pos] ) {
                     placedict[pos] = 1;
                     stuffs.push( createStuff( pos, 4+(i>1) ) ); // shield
                     ++scounter;
                  }
               }
            }
         }
         return [retval,enemies,stuffs];
      } else {
         return [retval,undefined,undefined];
      }
   }

   drawPack(pack) {
      var [map,enemies,stuffs] = pack;
      var retval = "";
      for ( var y = 0; y < map.length; ++y ) {
         var row = "";
         for ( var x = 0; x < map[y].length; ++x ) {
            if ( enemies !== undefined ) {
               var enemyHere = enemies.filter(([pos,code])=>pos[0]==y&&pos[1]==x);
               if ( enemyHere.length ) {
                  var [pos,enemy] = enemyHere[0];
                  row += enemy;

                  continue;
               }
            }
            if ( stuffs !== undefined ) {
               var stuffHere = stuffs.filter(([pos,code])=>pos[0]==y&&pos[1]==x);
               if ( stuffHere.length ) {
                  var [pos,stuff] = stuffHere[0];
                  row += stuff;
                  continue;
               }
            }
            if ( map[y][x] == 0 ) {
               row += "#";
            } else if ( map[y][x] == 5 ) {
               row += "~";
            } else if ( map[y][x] == 17 ) {
               row += "h";
            } else {
               row += " ";
            }
         }
         row += "\n";
         retval += row;
      }
      return retval;
   }
}

var generator = new MapGenerator();

function enemyGenerator(pos, code) {
   if ( code == 0 ) {
      return [pos,"o"];
   } else if ( code == 1 ) {
      return [pos,"O"];
   } else if ( code == 2 ) {
      return [pos,"@"];
   }
   return [pos,"?"];
}

function stuffGenerator(pos, code) {
   if ( code == 0 ) {
      return [pos,"p"];
   } else if ( code == 1 ) {
      return [pos,"g"];
   } else if ( code == 2 ) {
      return [pos,","];
   } else if ( code == 3 ) {
      return [pos,"/"];
   } else if ( code == 4 ) {
      return [pos,"v"];
   } else if ( code == 5 ) {
      return [pos,"V"];
   }
   return [pos,"?"];
}

//generateMap(300,100,1);
//var pack = generateMap(100,20,1);
var pack = generator.generateMap(300,100,1,300,50,4,enemyGenerator,stuffGenerator);
console.log(generator.drawPack(pack));
