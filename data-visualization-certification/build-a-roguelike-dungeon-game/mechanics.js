
var characters;
var deathSpeed = 1.0;

         var SPECIAL_COLORS = {WOODBROWN:"#966F33",IRON:"#434b4d",STEEL:"#4682B4",POISON:"#00FF00",TABLEBROWN:"#835C3B",CHAIRBROWN:"#8B4513",DARKGRAY0:"#282828",DARKGRAY1:"#484848",DARKGRAY2:"#585858"};

         var tileSize = 35;
         var errorTolerance = 0.01;
         var fps = 25;
         var aiFrequencyDecreaseRatio = 5; // AI runs in every (1 / fps * aiFrequenceDecreasingRatio) second
         var walkSfxFrequency = 10;
         var walkSfxCounter = 10;
         var aiCounter = 0;
         var deathSpeed = 1/25;
         var ANIMATION;
         var monsterKillingPerLevelFactor = 20;
         var heroBaseHp = 20;
         var heroHpPerLevelIncrease = 5;

         var ATTRIBUTES_BAREFIST       = {name:"nothing", value: 0, size:0};
         var ATTRIBUTES_WOODEN_STICK   = {name:"wooden stick"  ,color:SPECIAL_COLORS.WOODBROWN,width:30,height:4,value:1,holder:"weapon"};
         var ATTRIBUTES_IRON_BAR       = {name:"iron bar"      ,color:SPECIAL_COLORS.IRON     ,width:30,height:4,value:2,holder:"weapon"};
         var ATTRIBUTES_STEEL_SWORD    = {name:"steel sword"   ,color:SPECIAL_COLORS.STEEL    ,width:30,height:4,value:3,holder:"weapon"};
         var ATTRIBUTES_SILVER_SWORD   = {name:"silver sword"  ,color:'silver'                ,width:30,height:4,value:4,holder:"weapon"};
         var ATTRIBUTES_GOLD_SWORD     = {name:"gold sword"    ,color:'gold'                  ,width:30,height:4,value:5,holder:"weapon"};
         var ATTRIBUTES_CRISTAL_SWORD  = {name:"cristal sword" ,color:'cyan'                  ,width:30,height:4,value:6,holder:"weapon"};

         var ATTRIBUTES_MINISHIELD     = {name:"minishield"    ,color:"black",width:11,height:12,value:1,size:0.75,holder:"shield"}
         var ATTRIBUTES_BUCKLER_SHIELD = {name:"buckler"       ,color:"black",width:15,height:12,value:2,size:1.00,holder:"shield"}
         var ATTRIBUTES_BATTLESHIELD   = {name:"battleshield"  ,color:"black",width:19,height:12,value:3,size:1.25,holder:"shield"}
         var ATTRIBUTES_KITE_SHIELD    = {name:"kite shield"   ,color:"black",width:24,height:12,value:4,size:1.50,holder:"shield"}
         var ATTRIBUTES_TOWER_SHIELD   = {name:"tower shield"  ,color:"black",width:30,height:12,value:5,size:2.00,holder:"shield"}

         // 1 +1 +1
         // 2 +1 +1
         // 3 +2 +2
         // 4 +3 +3
         // 5 +3 +3
         // 6 +4 +4
         // 7 +5 +5
         // 8 +5 +5
         // 9 +6 +5


         var weaponPerLevel = [undefined,
                               undefined,
                               ATTRIBUTES_WOODEN_STICK,
                               ATTRIBUTES_IRON_BAR,
                               ATTRIBUTES_IRON_BAR,
                               ATTRIBUTES_STEEL_SWORD,
                               ATTRIBUTES_SILVER_SWORD,
                               ATTRIBUTES_GOLD_SWORD,
                               ATTRIBUTES_GOLD_SWORD,
                               ATTRIBUTES_CRISTAL_SWORD,
                               ATTRIBUTES_CRISTAL_SWORD];

         var shieldPerLevel = [undefined, 
                               undefined,
                               ATTRIBUTES_MINISHIELD,
                               ATTRIBUTES_BUCKLER_SHIELD,
                               ATTRIBUTES_BUCKLER_SHIELD,
                               ATTRIBUTES_BATTLESHIELD,
                               ATTRIBUTES_BATTLESHIELD,
                               ATTRIBUTES_KITE_SHIELD,
                               ATTRIBUTES_KITE_SHIELD,
                               ATTRIBUTES_TOWER_SHIELD,
                               ATTRIBUTES_TOWER_SHIELD];

         var heroStartingLevel = 1;
         var heroDefaultWeapon = weaponPerLevel[heroStartingLevel];
         var heroDefaultShield = shieldPerLevel[heroStartingLevel];

         function twoColors(colorA, colorB) { return [colorA,colorB,colorA,colorB,colorA,colorB]; }
         function threeColors(colorC, colorA, colorB) { return [colorC,colorB,colorA,colorB,colorA,colorB]; }

         var undeadExHeroColors = ['royalblue','lightgreen','royalblue','green','royalblue','green'];
         var knightColors = threeColors('tomato',SPECIAL_COLORS.DARKGRAY1,SPECIAL_COLORS.DARKGRAY2);
         var zombieColors = twoColors('mediumseagreen','mediumaquamarine');
         var tiefColors = ['orange','royalblue','orange','blue','orange','blue'];
         var evilWoodColors = twoColors(SPECIAL_COLORS.WOODBROWN,SPECIAL_COLORS.WOODBROWN);
         var giantColors = ['orange','limegreen','orange','olive','orange','olive'];
         var strongZombieColors = twoColors('mediumseagreen','mediumaquamarine');
         var masterTiefColors = ['orange','tomato','orange','crimson','orange','crimson'];
         var crazyGiantColors = ['orange','orange','orange','olive','orange','olive'];
         var stoneGolemColors = twoColors(SPECIAL_COLORS.DARKGRAY0,SPECIAL_COLORS.DARKGRAY0);
         var superGenieColors = ['yellow','yellow','yellow',"",'yellow',""];

         var ATTRIBUTES_OF_ENEMIES = [
             {name:"devilguy",scale:0.75,coloring:twoColors('crimson','tomato'),         slowness:10,range:4,level:1,weakness:2,baseAttack:0,baseDefense:0},
             {name:"ogre"    ,scale:0.9,coloring:twoColors('limegreen','olive'),         slowness: 8,range:5,level:1,weakness:2,baseAttack:0,baseDefense:0},
             {name:"zombie"  ,scale:0.95,coloring:zombieColors,                          slowness:10,range:4,level:2,weakness:2,baseAttack:1,baseDefense:0},
             {name:"thief"   ,scale:1.00,coloring:tiefColors,                            slowness: 6,range:5,level:2,weakness:2,baseAttack:0,baseDefense:1},
             {name:"ogre warrior",scale:0.9,coloring:twoColors('limegreen','olive'),     slowness: 8,range:5,level:2,weakness:2,baseAttack:0,baseDefense:1,defaultWeapon:ATTRIBUTES_WOODEN_STICK},
             {name:"dwarf",scale:0.6,coloring:twoColors('orange','mediumblue'),          slowness: 5,range:5,level:3,weakness:2,baseAttack:1,baseDefense:0},
             {name:"evil wood",scale:0.90,coloring:evilWoodColors,                       slowness: 9,range:5,level:3,weakness:2,baseAttack:1,baseDefense:2,defaultWeapon:ATTRIBUTES_WOODEN_STICK},
             {name:"tough devilguy",scale:0.80,coloring:twoColors('crimson','tomato'),   slowness: 9,range:5,level:3,weakness:3,baseAttack:1,baseDefense:2,defaultWeapon:ATTRIBUTES_IRON_BAR},
             {name:"giant"   ,scale:1.30,coloring:giantColors,                           slowness: 6,range:5,level:4,weakness:2,baseAttack:1,baseDefense:1},

             {name:"ice golem",scale:0.95,coloring:twoColors('mediumblue','mediumblue'), slowness: 8,range:4,level:4,weakness:3,baseAttack:3,baseDefense:1},
             {name:"strong zombie",scale:1.10,coloring:strongZombieColors,               slowness:10,range:5,level:4,weakness:1,baseAttack:1,baseDefense:1},
             {name:"master thief" ,scale:1.00,coloring:masterTiefColors,                 slowness: 5,range:5,level:5,weakness:4,baseAttack:2,baseDefense:2},
             {name:"ghost"        ,scale:0.90,coloring:twoColors('gray','gray'),         slowness: 7,range:5,level:5,weakness:2,baseAttack:2,baseDefense:3,transparency:0.5},
             {name:"fire elemental",scale:0.95,coloring:twoColors('yellow','yellow'),    slowness: 7,range:5,level:5,weakness:1,baseAttack:2,baseDefense:1},
             {name:"crazy giant"   ,scale:1.30,coloring:crazyGiantColors,                slowness: 8,range:5,level:6,weakness:2,baseAttack:2,baseDefense:3},
             {name:"undead ogre",scale:0.9,coloring:twoColors('royalblue','olive'),      slowness: 9,range:5,level:6,weakness:2,baseAttack:3,baseDefense:3,defaultWeapon:ATTRIBUTES_WOODEN_STICK},
             {name:"blue orb",scale:0.7,coloring:['blue',"","","","",""],                slowness: 8,range:5,level:6,weakness:2,baseAttack:3,baseDefense:4,transparency:0.50},
             {name:"blue daemon",scale:0.85,coloring:twoColors('blue','blue'),           slowness: 5,range:5,level:7,weakness:2,baseAttack:2,baseDefense:3,transparency:0.25},

             {name:"elite dwarf",scale:0.5,coloring:twoColors('orange','mediumblue'),    slowness: 5,range:5,level:7,weakness:3,baseAttack:3,baseDefense:4,defaultWeapon:ATTRIBUTES_WOODEN_STICK},
             {name:"genie",scale:1.1,coloring:['green','green','green',"",'green',""],   slowness: 7,range:5,level:7,weakness:2,baseAttack:4,baseDefense:4,transparency:0.25},
             {name:"stone golem",scale:0.95,coloring:stoneGolemColors,                   slowness: 8,range:4,level:8,weakness:2,baseAttack:4,baseDefense:3},
             {name:"undead ex-hero",scale:1.0,coloring:undeadExHeroColors,               slowness: 5,range:5,level:8,weakness:4,baseAttack:4,baseDefense:3,defaultWeapon:ATTRIBUTES_WOODEN_STICK,defaultShield:ATTRIBUTES_MINISHIELD},
             {name:"hell knight",scale:1.00,coloring:knightColors,                       slowness: 8,range:6,level:8,weakness:2,baseAttack:3,baseDefense:3,defaultWeapon:ATTRIBUTES_IRON_BAR,defaultShield:ATTRIBUTES_MINISHIELD},
             {name:"fire orb",scale:0.7,coloring:['yellow',"","","","",""],              slowness: 8,range:5,level:9,weakness:2,baseAttack:4,baseDefense:5,transparency:0.50},
             {name:"gold dwarf",scale:0.5,coloring:twoColors('gold','orange'),           slowness: 5,range:5,level:9,weakness:4,baseAttack:5,baseDefense:4,defaultWeapon:ATTRIBUTES_IRON_BAR},
             {name:"mercury golem",scale:0.95,coloring:twoColors('silver','silver'),     slowness: 4,range:5,level:9,weakness:3,baseAttack:4,baseDefense:5},
             {name:"super genie",scale:1.1,coloring:superGenieColors,                    slowness: 5,range:5,level:10,weakness:3,baseAttack:4,baseDefense:4,transparency:0.50},

             {name:"diabolito",scale:1.25,coloring:threeColors('crimson',SPECIAL_COLORS.DARKGRAY1,SPECIAL_COLORS.DARKGRAY0),slowness:4,range:6,level:10,weakness:0.5,defaultWeapon:ATTRIBUTES_SILVER_SWORD,defaultShield:ATTRIBUTES_BATTLESHIELD},
         ];

         function getBaseHp(level) { return (heroBaseHp + Math.max(level-1,0)*heroHpPerLevelIncrease)*2; }

         function minimalLevelXp(level) { return (level>1) * 500 * Math.pow(2,level); }

         function createMonster(pos,attributes) {
            attributes.baseHp = Math.floor(getBaseHp(attributes.level)/attributes.weakness/2);
            return [pos,0,0,[],attributes,0,{hp: attributes.baseHp,exists:1,weapon:attributes.defaultWeapon,shield:attributes.defaultShield}];
         }
         function createStuff(pos,attributes)   { return [pos,attributes,{exists:1}]; }

         function destroying(index) {
            characters[index][6].exists -= deathSpeed;
         }

         function kill(index) {
            sendMessage(characters[index][4].name+" dies");
            destroying(index);
         }

         function capitalize(text) {
            return text[0].toUpperCase() + text.substring(1);
         }

         function sendMessage(text) {
         }

         function getCharacterHoldedObjectAttribute(i,holder,attribute) {
            return (characters[i][6][holder]||ATTRIBUTES_BAREFIST)[attribute];
         }

         function damage(attacked, value) {
            if ( value <= 0 ) {
               return;
            }
            if ( !isCharacterAlive(attacked) ) {
               return;
            }
            characters[attacked][6].hp -= value;
            if ( characters[attacked][6].hp <= 0 ) {
               characters[attacked][6].hp = 0;
               kill(attacked);
               return 1;
            }
            characters[attacked][5] = 1;
            return 0;
         }

         function usePotion(number) {
            if ( characters[0][6].potions === undefined
              || number >= characters[0][6].potions.length
              || characters[0][6].potions[number] === undefined ) {
               return;
            }
            var exec = characters[0][6].potions[number];
            characters[0][6].potions[number] = undefined;
            if ( exec.effect() ) {
               sendMessage('Hero uses '+exec.name+', '+exec.effectText);
            } else {
               sendMessage('Hero uses '+exec.name+', but nothing happens');
            }
         }

         function magicFunction(x) { return Math.floor((Math.pow(1.11,x)-1)*10); }

         function getBaseAttack(i) {
            return magicFunction(characters[i][4].level)+(characters[i][4].baseAttack?characters[i][4].baseAttack:0);
         }

         function getBaseDefense(i) {
            return Math.max(0,magicFunction(characters[i][4].level)-2+(characters[i][4].baseDefense?characters[i][4].baseDefense:0));
         }
         
         function levelingOneLevelUp(i) {
            ++characters[i][4].level;
            characters[i][4].baseHp += heroHpPerLevelIncrease;
            characters[i][6].hp = characters[i][4].baseHp;
         }

         function levelingUp(i) {
            if ( characters[i][6].xp !== undefined ) {
/*               while ( minimalLevelXp(characters[i][4].level+1) <= characters[i][6].xp ) {
                  levelingOneLevelUp(i);
               }*/
            }
         }

         function awardXp(i, enemyLevel) {
            if ( characters[i][6].xp !== undefined ) {
               var rndPart = (0.75+Math.random()/4);
               characters[i][6].xp += Math.floor( (minimalLevelXp(enemyLevel+1) / monsterKillingPerLevelFactor) * rndPart );
               levelingUp(i);
            }
         }

         function attack(attacker, attacked) {
            var attackValueMax  = getBaseAttack(attacker)  + getCharacterHoldedObjectAttribute(attacker,"weapon","value");
            var attackValueMin  = Math.floor(attackValueMax / 2);
            var defenseValueMax = getBaseDefense(attacked) + getCharacterHoldedObjectAttribute(attacked,"shield","value");
            var defenseValueMin = Math.floor(defenseValueMax / 2);
            var attackValue  =  attackValueMin  + Math.round( (attackValueMax - attackValueMin)*Math.random() );
            var defenseValue =  defenseValueMin + Math.round( (defenseValueMax-defenseValueMin)*Math.random() );
            var damageValue = Math.max(attackValue - defenseValue,0);
            sendMessage(characters[attacker][4].name + " attacks " + characters[attacked][4].name + " and " + (damageValue <= 0 ? "misses" : "damages " + damageValue + " points") + " ("+attackValue+"-"+defenseValue+")");
            if ( damage(attacked,damageValue) ) {
               awardXp(attacker,characters[attacked][4].level);
            }
         }


         function heroHpIncreaser(value) {
            return ()=>{ return isCharacterAlive(0)
                             && (characters[0][6].hp < characters[0][4].baseHp)
                             && (characters[0][6].hp=Math.min(characters[0][4].baseHp,characters[0][6].hp+value))
                             && healSfx(); };
         }

         function isCharacterAlive(index) {
            return ( characters[index][6].exists > 1 - errorTolerance );
         }

         function isCharacterFullyDead(index) {
            return ( characters[index][6].exists < errorTolerance );
         }

         function damageInRadius(radius, value) {
            return ()=>{
               var characterIndex = createCharacterIndex();
               iterateOverBucketItemsAroundPos(characters[0][0],
                                               characterBuckets,
                                               (i)=>{
                                                   if ( manhattan(characters[0][0], characters[i][0]) < radius ) {
                                                      damage(i,value);
                                                   }
                                                });
               return 1;
            };
         }

function initCharacters() {
   characters = [];
   var hero = [[15.5,15.5],0,0,[],{name:"hero",scale:1.00,coloring:['orange','lightgreen','orange','green','orange','green'],slowness:5,range:50,level:heroStartingLevel},0,{xp:0,exists:1,weapon:heroDefaultWeapon,shield:heroDefaultShield,potions:[undefined,undefined,undefined,undefined,undefined]}];
   hero[4].baseHp = getBaseHp(hero[4].level);
   hero[6].hp     = hero[4].baseHp;
   characters.push(hero);
   for ( var i = 0; i < ATTRIBUTES_OF_ENEMIES.length; ++i ) {
      characters.push(createMonster([i+1,i+1], ATTRIBUTES_OF_ENEMIES[i]));
   }
}

function battleTest(i,j) {
   initCharacters();

   var tim1 = 0;
   var tim2 = 0;
   var killCount = 0;

   while ( isCharacterAlive(i) && killCount < 100 ) {
      if ( ++tim1 >= characters[i][4].slowness ) {
         tim1 = 0;
         attack(i,j);
      }
      if ( ++tim2 >= characters[j][4].slowness ) {
         tim2 = 0;
         attack(j,i);
      }
      if ( !isCharacterAlive(j) ) {
         characters[j] = createMonster([j,j], ATTRIBUTES_OF_ENEMIES[j-1]);
         ++killCount;
      }
   }
   return killCount + (1.0-characters[j][6].hp/characters[j][4].baseHp);
}

function sum(arr) {
   return arr.reduce((t,x)=>t+=x,0);
}

function avg(arr) {
   return sum(arr)/arr.length;
}

function dev(arr) {
   var avga = avg(arr); 
   return Math.sqrt(arr.reduce((t,x)=>t+=((x-avga)**2),0)/arr.length);
}

function battleStats(i,j) {
   var sample = [];
   for ( var u = 0; u < 1000; ++u ) {
      sample.push(battleTest(i,j));
   }
   return ""+avg(sample).toFixed(3)+" "+dev(sample).toFixed(3);
}

function pad(x,size) {
   x = "" + x;
   while (x.length < size) {
      x += " ";
   }
   return x;
}

initCharacters();
console.log('---> Hero level',characters[0][4].level,', hp:',characters[0][6].hp, ', weapon:',(characters[0][6].weapon?characters[0][6].weapon.name:"nothing"), ', shield:',(characters[0][6].weapon?characters[0][6].shield.name:"nothing"));
for ( var i = 0; i < ATTRIBUTES_OF_ENEMIES.length; ++i ) {
   console.log(pad(characters[i+1][4].name,20),pad(characters[i+1][4].level,5),battleStats(0,i+1));
}
