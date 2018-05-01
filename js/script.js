var canvas, context;
var canon = new Image();
var bg = new Image();
var bricks = new Array(45);
var balls = new Array(10);

var score = 0;
var handle;
var cx=360;
var cy=660;
var dct=-1;    //主角的方向(0:左    1:右)

var bombImg = function(){
  this.image = new Image();
  this.image.src="./assets/bomb.png";
}

var bomb = function(x,y){
  this.x = x;
  this.y = y;
  this.draw=function(){
    document.getElementById("canvas").getContext("2d").drawImage(this.image,this.x,this.y,40,40);        
  }
}

var brickImg = function(){
  this.image = new Image();
  this.image.src = "./assets/bee.png";
}

var myBrick = function(x,y){
  this.x=x;
  this.y=y;
  this.spawn=true;
  this.brbomb;
  this.showbomb=false;
  this.drop=function(){
    if(this.spawn==true && parseInt(Math.random()*100%100)<2) {
      // console.log("drop")
      this.brbomb=new bomb(this.x,this.y);
      this.showbomb=true;}
    // } else console.log("no");
  }
  this.draw=function(){
    if(this.spawn)
    document.getElementById("canvas").getContext("2d").drawImage(this.image,this.x,this.y,60,60);

  }
  
}

var ballImg = function(){
  this.image = new Image();
  this.image.src="./assets/ball.png";
}

var ball = function(x){
  this.x = x;
  this.y = cy;
  this.spawn=false;
  this.draw = function(){
    if (this.spawn){
      document.getElementById("canvas").getContext("2d").drawImage(this.image,this.x,this.y,20,20);
    }
  }
}

function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  
  bg.addEventListener("load",setup,false);

  canon.src="./assets/cannon.png";
  bg.src="./assets/map.png";
  myBrick.prototype = new brickImg();
  ball.prototype = new ballImg();
  bomb.prototype = new bombImg();
    
}

function setup(){
    

  for(var i=0; i<10;i++){
    balls[i] = new ball(cx+32);
  } 
  for(var i = 0; i < 45; i++) {
    
    var x = (i%9) * 90 + 7;
    var y = parseInt(i/9) * 80;
    bricks[i] = new myBrick(x,y);
    
  }

  //****如果使用者按下鍵盤****	
  document.onkeydown=function(e){

    //如果按左
    if(e.keyCode==37){dct=0;}       

    //如果按右
    if(e.keyCode==39){dct=1;} 

    if(e.keyCode==32){
      addBall();
    }
  }    
  handle=setInterval(showImg, 50);  
}

function addBall(){
  for(var i=0;i<10;i++){
    if(balls[i].spawn==false){
      balls[i].x=cx+32;
      balls[i].y=cy;
      balls[i].spawn=true;
      break;
    }
  }  
}

function showImg() {
//   clear canvas
  context.clearRect(0,0,canvas.width,canvas.height);
  
//   fill bg
  context.drawImage(bg,0,0,canvas.width,canvas.height);
  
  // 畫圖
  context.drawImage(canon,cx,cy,80,100);

  // ****移動主角座標
  if(dct==0 && cx>0){cx-=6;}
  if(dct==1 && cx+6+80<800){cx+=6;}  
  
  for(var i=0; i<10;i++){ //check for collision
    if(balls[i].spawn){      
      var bax = balls[i].x;
      var bay = balls[i].y;
      for(var j = 0; j<45; j++){
        if(bricks[j].spawn==false) continue;
        var brx=bricks[j].x;
        var bry=bricks[j].y;
        // hit an alien!
        if(bax>=brx && bax<=brx+50 && bay>=bry && bay<=bry+50){
          score++;
          bricks[j].spawn=false;
          balls[i].spawn=false;              
        }
      }
      if(balls[i].y+30>0){ //ball keeps falling
        balls[i].y-=10;
      }
      else { //ball falls out of map
        balls[i].spawn=false;
      }
    }
    balls[i].draw();

  }
  
    
  for(var i=0; i<45;i++){
    if(bricks[i].showbomb==true){ //already dropped bomb?
      if(bricks[i].brbomb.y+5<canvas.height){ //bomb keeps falling
        if(bricks[i].brbomb.x>cx && bricks[i].brbomb.x+30<cx+80 && bricks[i].brbomb.y>cy && bricks[i].brbomb.y+30<cy+100) { //ohno u lose!
          context.font="50px Arial Black";
          context.fillText("You lose :(",300,300);
          clearInterval(handle);
        } else {
          bricks[i].brbomb.y+=5;
          bricks[i].brbomb.draw();
        }
      }else bricks[i].showbomb=false; //bomb falls out of map
    }else if((i+9<45 && bricks[i+9].spawn==false)||(i+9>45 && bricks[i].spawn==true)){ //drop bomb?
      bricks[i].drop();
    }
    bricks[i].draw();
  }
  
    
  //show score
  context.font="20px Arial Black";
  context.fillText("Score: "+score.toString(),0,770);
  if(score>=45){
            context.font="20px Arial Black";
            context.fillText("Score: "+score.toString(),0,770);
            context.font="50px Arial Black";
            context.fillText("You win :)",300,300);
            clearInterval(handle);
          }

}
              