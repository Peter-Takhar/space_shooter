//refactor all global variables using YUI module pattern
// link: https://stackoverflow.com/questions/2613310/ive-heard-global-variables-are-bad-what-alternative-solution-should-i-use

//remember to use preload js to

//setting references to the canvas and the stage
var canvas;
var stage;

//background
//two tiled images used to create an infinitely scrolling background
//new Image(width,height) is functionally equivalment to
//    document.createElement('img')
//new Image() creates a new HTMLImageElement
var bgImg = new Image();
var bg;
var bg2Img = new Image();
var bg2;

//setting up the ship
var sImg = new Image();
var ship;

//enemy
var eImg = new Image();

//boss
var bImg = new Image();
var boss;

//lives
var lImg = new Image();

//bullets
var bltImg = new Image();

//alert graphics
var winImg = new Image();
var loseImg = new Image();
var win;
var lose;

//variables for random elements
var lives = new createjs.Container(); //stores the lives gfx
var bullets = new createjs.Container(); //stores the bullets gfx
var enemies = new createjs.Container(); // stores the enemies gfx
var bossHelath = 20;
var score;
var gfxLoaded = 0; //used as a preloader, counts the already loaded items
var centerX = 160;
var centerY = 240;
var tkr = new Object(); //used as a Ticker listener
var timerSource; //references a setInterval method


//bullet spritesheet
var bulletSpritesheet;

//music
var mInstance = null;
function Main()
{
  //link canvas to stage
  canvas = document.getElementById('Shooter');
  stage = new createjs.Stage(canvas);

  //need to enable mouse events
  //easeljs disables mouse events to improve performance
  stage.mouseEventsEnabled = true;

  //sound

  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.on("complete", handleComplete);
  var assetPath = "./resources/";
  queue.loadManifest([
    {id:"mShot", src:assetPath + "shot.wav"},
    {id:"mExplo", src:assetPath + "explosion.wav"},
    {id:"mMain", src:assetPath + "Battle Lines.mp3"},
    {id:"mBoss", src:assetPath + "Palpitations.mp3"},
    {id:"mBuildup", src:assetPath + "Last Stand.mp3"}
  ]);


  //createjs.Sound.registerSound(assetPath + sounds[2].src, sounds[2].id);
  function handleComplete(e){
    //make an AbstractSoundIstance to control sound
    mIstance = createjs.Sound.play("mMain", {loop:-1});
  }

  //load gfx
  bgImg.src = 'resources/bg.png';
  bgImg.name = 'bg';
  //bgImg.onload = loadGfx;

  bg2Img.src = 'resources/bg2.png';
  bg2Img.name = 'bg2';
  bg2Img.onload = loadGfx;

  sImg.src = 'resources/ship.png';
  sImg.name = 'ship';
  sImg.onload = loadGfx;

  eImg.src = 'resources/enemy.png';
  eImg.name = 'enemy';
  eImg.onload = loadGfx;

  bImg.src = 'resources/boss.png';
  bImg.name = 'boss';
//  bImg.onload = loadGfx;

  lImg.src = 'resources/life.png';
  lImg.name = 'life';
  lImg.onload = loadGfx;

  bltImg.src = 'resources/bullet.png';
  bltImg.name = 'bullet';
  bltImg.onload = loadGfx;

  winImg.src = 'resources/win.png';
  winImg.name = 'win';
//  winImg.onload = loadGfx;

  loseImg.src = 'resources/lose.png';
  loseImg.name = 'lose';
  //loseImg.onload = loadGfx;

  //Ticker
  createjs.Ticker.on("tick", handleTick);
  function handleTick(e){
    update();
    stage.update();
  }

}

//function to load graphics
//createjs.Bitmap used to draw an source image
function loadGfx(e){

  if (e.target.name = 'bg2'){bg2 = new createjs.Bitmap(bg2Img);}
  if (e.target.name = 'ship'){ship = new createjs.Bitmap(sImg);}

  gfxLoaded++;

  if (gfxLoaded == 5){
    addGameView();
  }
}


//function adds Game UI elements after graphics are gfxLoaded
//  such as lives counter, backgrounds, etc.

function addGameView(){

  ship.x = centerX - 18.5;
  ship.y = 480 + 34;


  //add lives
  for (var i=0; i<3; i++){
    var l = new createjs.Bitmap(lImg);

    l.x = 220 + (30 * i);
    l.y = 450;

    lives.addChild(l);
  }

  //score text
  score = new createjs.Text('0', 'bold 14px Courier New', '#FFFFFF');
  score.x = 2;
  score.y = 460;

  //second background
  bg2.y = -1100;

  //add gfx to stage and tween ship
  stage.addChild(bg2, ship, bullets, enemies, lives, score);

  createjs.Tween.get(ship).to({y:400}, 1000).call(startGame);
}


function moveShip(e){
  ship.x = e.stageX - 18.5;
}



function shoot(){
  var b = new createjs.Bitmap(bltImg);

  b.x = ship.x + 43;
  b.y = ship.y - 30;

  bullets.addChild(b);
  //stage.update();

  createjs.Sound.play('mShot');
}



function addEnemy(){
  var e = new createjs.Bitmap(eImg);

  e.x = Math.floor(Math.random()*(320-50));
  e.y = -50;

  enemies.addChild(e);

}


//function to add listeners to stage and time
var limit = 0;
var time;
function startGame(){

  stage.on("stagemousemove", moveShip);

  bg2.on("click", shoot);

  stage.addEventListener("tick", handleEnemy);

  function handleEnemy(e){
     time = parseInt(createjs.Ticker.getTime());
     if ((time-3000)>limit){
        limit = time;
        addEnemy();
      }
  }

}



function update(){
  bg2.y += 5;

  if (bg2.y >= 0){
    bg2.y =-1100;
  }


  //move bullets
  for (var i=0; i<bullets.children.length; i++){
    bullets.children[i].y -= 10;

    //remove offstage bullets
    if (bullets.children[i].y < -20){
      bullets.removeChildAt(i);
    }
  }
  /*
  //show boss
  if(parseInt(score.text) >= 500 && boss == null){
    boss = new createjs.Bitmap(bImg);

    createjs.Sound.play('boss');

    boss.x = centerX - 90;
    boss.y = -183;

    stage.addChild(boss);
    Tween.get(boss).to({y:40}, 2000); //twwen the boss onto the play area
  }
  */

  //move enemies
  for (var j=0; j<enemies.children.length; j++){
    enemies.children[j].y += 5;
    //remove offstage enemies
    if (enemies.children[j].y > 480 + 50){
      enemies.removeChildAt(j);
    }


    for (var k = 0; k<bullets.children.length; k++){
      //bullet - enemy collision
      if(bullets.children[k].x+9 >= enemies.children[j].x &&
          bullets.children[k].x <= enemies.children[j].x+48 &&
          bullets.children[k].y < enemies.children[j].y+43){
                bullets.removeChildAt(k);
                enemies.removeChildAt(j);

                createjs.Sound.play('mExplo');
                score.text = parseInt(score.text + 50, 10);
              }
      }
    }
      /*
      if(boss != null && bullets.children[k].x >= boss.x
          && bullets.children[k].x + 11 < boss.x + 183 &&
            bullets.children[k].y < boss.y +162){
              bullets.removeChildAt(k);
              bossHealth--;
              stage.update();
              createjs.Sound.play('explo');
              score.text = parseInt(score.text + 50);
            }
    }

    //ship - enemy collision
    if(enemies.hitTest(ship.x, ship.y) ||
        enemies.hitTest(ship.x + 37, ship.y)){
          enemies.removeChildAt(j);
          lives.removeChildAt(lives.length);
          ship.y = 480 + 34;
          Tween.get(ship).to({y:425}, 500);
          createjs.Sound.play('explo');
    }
  }

  //check for win
  if (boss != null && bossHealth <= 0){
    alert('win');
  }

  //check for lose
  if(lives.children.length <= 0){
    alert('lose');
  }
  */
}

/*
function alert(e){
  //remove listeners
  stage.onMouseMove = null;
  bg.onPress = null;
  bg2.onPress = null;

  createjs.Ticker.removeListener(tkr);
  tkr = null;

  timerSource = null;

  //display currect message
  if (e == 'win'){
    win = new createjs.Bitmap(winImg);
    win.x = centerX - 64;
    win.y = centerY - 23;
    stage.addChild(win);
    stage.removeChild(enemies, boss);
  } else {
    lose= new createjs.Bitmap(loseImg);
    lose.x = centerX - 64;
    lose.y = centerY - 23;
    stage.addChild(lose);
    stage.removeChild(enemies, ship);
  }

  bg.onPress = function() {window.location.reload();};
  bg2.onPress = function() {window.location.reload();};
  stage.update();

}
*/
