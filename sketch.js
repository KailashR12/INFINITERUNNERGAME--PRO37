var gameState, previousState, monkey, invisibleGround, obstacleGroup, bananaGroup, restart, gameOver, score, life, framesElapsedInInitialState; 
var  framesElapsedTillLoseState, frameCount2, bananasCollected;
var scene_img, monkey_running, banana_img;
var  obstacle_img, restart_img, gameOver_img;
var jumpSound, collectSound, collisionSound;
var monkeyY = 307; 
var monkeySize = 1;
var monkeyPosY = 500;

function preload() {
  scene_img = loadImage("images/scene2.png");
  banana_img = loadImage("images/banana.png");
  obstacle_img = loadImage("images/stone.png");
  restart_img = loadImage("images/restart.png");
  monkey_running = loadAnimation("images/Monkey_01.png", "images/Monkey_02.png", "images/Monkey_03.png", "images/Monkey_04.png", "images/Monkey_05.png", "images/Monkey_06.png", "images/Monkey_07.png", "images/Monkey_08.png", "images/Monkey_09.png", "images/Monkey_10.png");
  jumpSound = loadSound("sounds/jump.mp3");
  collectSound = loadSound("sounds/clicky_crunch.mp3");
  collisionSound = loadSound("sounds/Ouch.mp3");
}
function setup() {
  createCanvas(displayWidth, displayHeight);
  gameState = "displayRules"; 
  previousState = "displayRules"; 
  monkey = createSprite(50, displayHeight-250, 50, 50);
  monkey.addAnimation("running", monkey_running);
  monkey.frameDelay = 2;
  monkey.scale = 0.2;
  monkey.setCollider("rectangle", 0, 0, 400, 490, 15); 
  invisibleGround = createSprite(displayWidth/2, displayHeight-200, displayWidth*2, 10);
  invisibleGround.visible = false; 
  obstacleGroup = new Group();
  bananaGroup = new Group();
  restart = createSprite(displayWidth/2, displayHeight/2, 10, 10);
  restart.addImage(restart_img);
  restart.scale = 0.4;
  restart.visible = false; 


  gameOver = createSprite(200, 160, 20, 20);
  gameOver.scale = 0.7;
  gameOver.visible = false;

  score = 0;  
  life = 2; 

  var heading = "Welcome!";
  var text1 = " Hello! This is a monkey runner game. In this game, a monkey has escaped from the zoo and is very \nhungry. ";
  var text2 = "You have to feed him the bananas by making him jump. But be careful! \n";
  var text3 = "There are some obstacles also that you have to save the monkey from colliding into. ";
  var text4 = "To make the \nmonkey jump, press the space bar. ";
  var text5 = "All the best!";
  var information2 = "CLICK ANYWHERE ON THIS SCREEN TO CONTINUE.";

  var information = text1 + text2 + text3 + text4 + text5;

  if (gameState == "displayRules") {
    background("blanchedAlmond");
    push();

    displayInformation(heading, 52, 570, 55);
    displayInformation(information, 38, 15, 110);
    displayInformation(information2, 35, 15, 650);

    pop();
  }

  bananasCollected = 0;

  camera.position.x = 0;
}

function draw() {


  if (mouseDown() && gameState == "displayRules") {
  
    gameState = "play";
  }

  if (monkey.isTouching(invisibleGround)) {
    setMonkeyY();
  }

  monkey.collide(invisibleGround);

  if (gameState == "play") {

    camera.position.x += 15;
    camera.position.y = displayHeight/2;

    monkey.x = camera.position.x - monkeyPosY;

    if (camera.position.x == displayWidth) {
    
      drawBananas();
    }

    if(camera.position.x >= displayWidth) {
      camera.position.x = 0;
    }

    if (camera.position.x == 0) {

      drawObstacles();
    }

    if (monkey.y > monkeyY) {
      monkey.play();
    }

    if (keyDown("space") && monkey.y > monkeyY) {
      monkey.velocityY = -10;
      jumpSound.play();
      monkey.pause();
    }

    monkey.velocityY += 0.5;

    if (obstacleGroup.isTouching(monkey)) {

      collisionSound.play();
      monkey.velocityY = 0; 
      monkeyPosY -= 100;
      decreaseSize();
    }

    if (bananaGroup.isTouching(monkey)) {
      bananaGroup.destroyEach();
      collectSound.play();
      bananasCollected++;
      monkeySize++;

      switch (bananasCollected) {
        case bananasCollected:
          monkey.scale = 0.25 + (monkeySize / 300);
          break;

        default:
          break;
      }
    }

    score = score + Math.round(getFrameRate() / 60);
  }

  if (gameState == "lose") {
    print('lose');
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setVelocityXEach(0);
    bananaGroup.setLifetimeEach(-1);
    monkey.pause();
    restart.visible = true;
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  if (gameState != "displayRules") {
    imageMode(CENTER);
    image(scene_img ,displayWidth/2, displayHeight/2, displayWidth*2, displayHeight);
    drawSprites();

    var textX = camera.position.x + 200;

    displayInformation("Score: " + score, 30, textX, 70);
    displayInformation("Bananas Collected: " + bananasCollected, 30, textX, 110);
    
    if (gameState != "lose") {
      displayInformation("Lives remaining: " + life, 30, textX, 150);
    }

  }
}

function displayInformation(information, size, coordinateX, coordinateY) {
  fill("black");
  textSize(size);
  textFont("cursive");
  text(information, coordinateX, coordinateY);
}

function drawObstacles() {
  var obstacle = createSprite(displayWidth/2+random(0, 100), displayHeight-210);
  obstacle.addImage(obstacle_img);
  obstacle.scale = 0.2;
  monkey.depth = obstacle.depth + 1;
  obstacle.setCollider("circle", 0, 0, 150);
  obstacle.lifetime = Math.round(displayWidth/15); 
  obstacleGroup.add(obstacle);
}

function drawBananas() {
  var banana = createSprite(displayWidth/2 - 100, random(displayHeight-250, displayHeight-350));
  banana.addImage(banana_img);
  banana.scale = 0.09;
  banana.rotation = random(0, 360);
  monkey.depth = banana.depth + 1;
  restart.depth = banana.depth + 1;
  banana.setCollider("circle", 0, -200, 550);
  banana.lifetime = Math.round(displayWidth/15);
  bananaGroup.add(banana);
}

function decreaseSize() {
  //life--;

  
  switch (life) {
    case 1:
      monkey.scale = 0.1;
      break;

    case 0:
      monkey.scale = 0.07;
      break;

    case -1:
      monkey.scale = 0.07;
      gameState = "lose";
      break;

    default:
      break;
  }
  monkeySize = monkey.scale;
}

function setMonkeyY() {
  monkeyY = monkey.y - 1;
}

function reset() {
  gameState = "play";
  camera.position.x = 0;
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  score = 0;
  bananasCollected = 0;
  monkeySize = 1;
  life = 2;
  monkey.scale = 0.1;
  monkey.x = 50;
  restart.visible = false;
}