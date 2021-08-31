var PLAY=1;
var END=0;
var gameState=PLAY;
var trex,trex_running,trex_collided,trex_static;
var ground,invisibleGround,ground_image;
var background_image;
var obstacle1_image,obstacle2_image,obstacle3_image,obstacle4_image,obstacleGroup;
var cloud_image,cloudGroup;
var score,sun,sun_image;
var gameOver,gameOver_image;
var restart,restart_image;
var jumpSound,collidedSound;
var cloud,obstacle;
function preload(){
  trex_running=loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided=loadImage("assets/trex_collided.png");
  trex_static=loadImage("assets/trex_1.png");
  ground_image=loadImage("assets/ground.png");
  background_image=loadImage("assets/backgroundImg.png");
  obstacle1_image=loadImage("assets/obstacle1.png");
  obstacle2_image=loadImage("assets/obstacle2.png");
  obstacle3_image=loadImage("assets/obstacle3.png");
  obstacle4_image=loadImage("assets/obstacle4.png");
  cloud_image=loadImage("assets/cloud.png");
  sun_image=loadImage("assets/sun.png");
  gameOver_image=loadImage("assets/gameOver.png");
  restart_image=loadImage("assets/restart.png");
  jumpSound=loadSound("assets/sounds/jump.wav");
  collidedSound=loadSound("assets/sounds/collided.wav");
}
function setup(){
createCanvas(displayWidth,displayHeight);
sun=createSprite(displayWidth-180,100,20,20);
sun.addImage(sun_image);
sun.scale=0.3;
trex=createSprite(displayWidth-1280,displayHeight-120,20,70);
trex.addAnimation("running",trex_running);
trex.addAnimation("collided",trex_collided);
trex.scale = 0.25
ground=createSprite(displayWidth/2,displayHeight,displayWidth,2);
ground.addImage(ground_image);
invisibleGround=createSprite(displayWidth/2,displayHeight+20,displayWidth,125);
invisibleGround.visible=false;
gameOver=createSprite((camera.position.x - displayWidth/2-200) + 875,displayHeight/2 + 50,20,20);
gameOver.addImage(gameOver_image);
gameOver.scale = 0.7;
restart=createSprite((camera.position.x - displayWidth/2-200) + 875,displayHeight/2 + 125,20,20);
restart.addImage(restart_image);
restart.scale = 0.2;
obstacleGroup = new Group();
cloudGroup = new Group();
touches=[];
trex.debug=false;
trex.setCollider("rectangle",0,0,450,650);
score=0;
}
function draw(){
background(background_image);

trex.collide(invisibleGround);

trex.depth=ground.depth;
trex.depth=trex.depth+1;

camera.position.x = trex.x + displayWidth/2-200;
camera.position.y = displayHeight/1.9;

gameOver.x = (camera.position.x - displayWidth/2-200) + 875;
restart.x = (camera.position.x - displayWidth/2-200) + 875;

if(gameState===PLAY){
//    score=score+ Math.round(getFrameRate()/60);
//    fill("black");
//    textSize(18);
//    text("Score:"+score,100,100);
//    ground.velocityX=-(7+3*score/100);
    gameOver.visible=false;
    restart.visible=false;
    score = score + Math.round((camera.position.x - displayWidth+1290-displayWidth/2)/400); 
    fill("black");
    textSize(18);
    text("Score:"+score,camera.position.x - displayWidth/2 + 100,100);
    if(trex.velocityX<20){
        trex.velocityX = 12 + score/1500;
        sun.velocityX = 12 + score/1500;
        invisibleGround.velocityX = 12 + score/1500;
    }
    ground.velocityX = 2;
    if(((camera.position.x - displayWidth/2)-ground.x)>-350){
        ground.x = (camera.position.x - displayWidth/2) + 800; 
    }
    if(touches.length>0||keyDown("SPACE")&&trex.y>=displayHeight-150){
        trex.velocityY=-16;
        //jumpSound.play();
        touches=[];
    }
    trex.velocityY=trex.velocityY+0.8;
    spawnObstacles();
    spawnClouds();
    if(obstacleGroup.isTouching(trex)){
        //collidedSound.play();
        gameState=END;
    }
}else if(gameState===END){
    trex.changeAnimation("collided",trex_collided);
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY=0;
    trex.velocityX = 0;
    sun.velocityX = 0;
    invisibleGround.velocityX = 0;
    ground.velocityX = 0;
    obstacleGroup.setVelocityEach(0,0);
    cloudGroup.setVelocityEach(0,0);
    ground.velocityX=0;
    obstacleGroup.setLifetimeEach=-1;
    cloudGroup.setLifetimeEach=-1;
    fill("black");
    textSize(20);
    text("Score:"+score,(camera.position.x - displayWidth/2 - 235) + 875,displayHeight/2+10);
    if(touches.length>0 || mousePressedOver(restart) && gameState===END){
        trex.x = displayWidth-1280;
        ground.x = displayWidth/2;
        invisibleGround.x = displayWidth/2;
        sun.x = displayWidth - 180;
        trex.changeAnimation("running",trex_running);
        obstacleGroup.destroyEach();
        cloudGroup.destroyEach();
        score=0;
        touches=[];
        gameState=PLAY;
    }
}

drawSprites();
}
function spawnObstacles(){
    if(frameCount%80===0){
    var rand=Math.round(random(1,2));
    obstacle=createSprite((camera.position.x - displayWidth/2-200) + 1000,displayHeight-100,20,20);
    obstacle.collide(invisibleGround);
    //obstacle.velocityX=-(7+3*score/100);
    switch(rand){
        case 1:obstacle.addImage(obstacle1_image);
        break;
        case 2:obstacle.addImage(obstacle2_image);
        break;
        case 3:obstacle.addImage(obstacle3_image);
        break;
        case 4:obstacle.addImage(obstacle4_image);
        break;
        default:obstacle.addImage(obstacle1_image);
        break;
    }
    obstacle.scale=0.5;
    obstacle.lifeTime=300;
    trex.depth=obstacle.depth;
    trex.depth=trex.depth+1;
    obstacleGroup.add(obstacle);    
}
}
function spawnClouds(){
    if(frameCount%60===0){
        cloud=createSprite((camera.position.x - displayWidth/2) + 700,100,20,20)
        //cloud.velocityX=-(7+3*score/100);
        cloud.addImage(cloud_image);
        cloud.scale=0.5;
        cloud.lifeTime=300;
        cloud.depth=score.depth;
        score.depth=score.depth+1;
        cloudGroup.add(cloud);
    }
}