//canvas
var canvas=document.getElementById("gameCanvas");
var ctx=canvas.getContext("2d");


var pic = new Image();
pic.src="img/background.jpg";

var collision=document.getElementById("collision");

//ball 
var ballRadius=10;
var x=canvas.width/2;
var y=canvas.height-30;
var dx=2;
var dy=-12;
var d=Math.random();
if(d>0.5){
  dx=d*4;
}
else{
  dx=d*(-4);
}
//paddle
var paddleHeight=10;
var paddleWidth=75;
var paddleX=(canvas.width-paddleWidth)/2;
//keyboard
var rPressed =false;
var lPressed =false;
var sPressed =false;
//brick
var brickRow=2;
var brickCol=8;
var brickWidth=75;
var brickHeight=20;
var brickPadding=10;
var brickOffsetTop=40;
var brickOffsetLeft=30;
var bricks=[];
function brickSet(){
  for(i=0;i<brickCol;i++){
    bricks[i]=[];
    for(j=0;j<brickRow;j++){
      bricks[i][j]={x:0,y:0,status:1};
    }
  }
}
brickSet();
//score,life
var score=0;
var lives=3;
// control
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
document.addEventListener("mousemove",mouseMoveHandler,false);
document.addEventListener("mousedown",mouseDownHandler,false);
document.addEventListener("touchmove",touchMoveHandler,false);
document.addEventListener("touchstart",touchStartHandler,false);
function keyDownHandler(e){
  if(e.keyCode==39){
    rPressed=true;
  }
  else if(e.keyCode==37){
    lPressed=true;
  } 
  else if(e.keyCode==32){
    sPressed=true;
  }
}
function keyUpHandler(e){
  if(e.keyCode==39){
    rPressed=false;
  }
  else if(e.keyCode==37){
    lPressed=false;
  }
}
function touchStartHandler(e){
  var s=e.pageX;
  if(s>0&&s<canvas.width){
    start=true;
    sPressed=true;
  }
}


function touchMoveHandler(e){
  var relativeX=e.pageX-canvas.offsetLeft;
  if(relativeX>0 && relativeX<canvas.width){
    paddleX=relativeX-paddleWidth/2;
  }
}
function mouseMoveHandler(e){
  var relativeX=e.clientX-canvas.offsetLeft;
  if(relativeX>0 && relativeX<canvas.width){
    paddleX=relativeX-paddleWidth/2;
  }

}

function mouseDownHandler(e){
  var s2=e.clientX;
  if(s2>0&&s2<canvas.width){
    start=true;
  }
}



function drawScore(){
  ctx.font="32px Raleway";
  ctx.fillStyle="#0095DD";
  ctx.fill();
  ctx.fillText("SCORE: "+score,8,30);
}
function drawLives(){
  ctx.font="32px Raleway";
  ctx.fillStyle="#0095DD";
  ctx.fill();
  ctx.fillText("LIVES: "+lives,canvas.width-125,30);
}

function drawBricks(){
  for(i=0;i<brickCol;i++){
    for(j=0;j<brickRow;j++){
      if(bricks[i][j].status==1){
        var brickX=(i*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY=(j*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[i][j].x=brickX;
        bricks[i][j].y=brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle="#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPaddle(){
   ctx.beginPath();
   ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
   ctx.fillStyle="#0095DD";
   ctx.fill();
   ctx.closePath();
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0,Math.PI*2,false);
  ctx.fillStyle="#0095DD";
  ctx.fill();
  ctx.closePath();
}

function win(){
  ctx.font="60px Garamond";
  ctx.fillStyle="#0095DD";
  ctx.fill();
  ctx.fillText("You Win! Next?",canvas.width-550,canvas.height/2);
}




function collisionDetection(){
  for(i=0; i<brickCol;i++){
    for(j=0;j<brickRow;j++){
      var b =bricks[i][j];
      if(b.status==1){
        if(x>=b.x&&x<=b.x+brickWidth&&y>=b.y&&y<=b.y+brickHeight){
          dy=-dy;
          b.status=0;
          score++;
          collision.pause();
		      collision.currentTime = 0;
		      collision.play();
          
          if(score>=5){
            paddleWidth=125;
          }
          if(score==brickCol*brickRow){
            round2();
            sPressed=false;
          }
        }
      }
    }
  }
}

function draw(){

  if(start==false){
  drawStart();

  }else{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(pic,0, 0);  
  if(sPressed==true){
    x+=dx;
    y+=dy;
  }else{
    x=paddleX+paddleWidth/2;
  }
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  collisionDetection();
  //wall bounce
  if(x+dx>canvas.width-ballRadius||x+dx<ballRadius){
   dx=-dx;
  }
  if(y+dy<ballRadius){
   dy=-dy;
  }
  else if(y+dy>canvas.height-ballRadius){ 
     if(x>paddleX&&x<paddleX+paddleWidth/5){//most left bound paddle
      if(y=y-paddleHeight){
         dx=-2;
         dy=-dy;
       }
     }
     else if(x>paddleX+paddleWidth/5&&x<paddleX+2*(paddleWidth/5)){  // left bound
       if(y=y-paddleHeight){
         dx=-1;
         dy=-dy;
       }
     }
     else if(x>paddleX+2*(paddleWidth/5)&&x<paddleX+3*(paddleWidth/5)){  // middle bound
       if(y=y-paddleHeight){
         dx=0;
         dy=-dy;
       }
     }  
     else if(x>paddleX+3*(paddleWidth/5)&&x<paddleX+4*(paddleWidth/5)){ // right bound
       if(y=y-paddleHeight){
         dx=1;
         dy=-dy;
       }
     }else if(x>paddleX+4*(paddleWidth/5)&&x<paddleX+5*(paddleWidth/5)){ // right bound
       if(y=y-paddleHeight){
         dx=2;
         dy=-dy;
       }
     }
     else{
        lives--;
        sPressed=false;
        if(lives==0){
          alert("Game over!");
          brickSet();
          lives=3;
          score=0;
          draw();
        }
        else{
          x=canvas.width/2;
          y=canvas.height-30;
          dx=2;
          dy=-12;
          paddleX=(canvas.width-paddleWidth)/2;
        }
     }
  }
  //keyboard control
  if(rPressed&&paddleX<canvas.width-paddleWidth){
    paddleX+=7;
  }
  else if(lPressed&&paddleX>0){
    paddleX-=7;
  }

  var main=function(){
    $("canvas").dblclick(function() {
    sPressed=true;
  });
  }
  $(document).ready(main);
}
  requestAnimationFrame(draw);

}

draw();

