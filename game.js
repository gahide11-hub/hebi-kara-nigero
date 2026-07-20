 const map = [

"##########",
"#........#",
"#..###...#",
"#........#",
"#..###..E#",
"#........#",
"##########"

];


const game = document.getElementById("game");


let playerX = 1;
let playerY = 1;


// ヘビの初期位置
let snakeX = 8;
let snakeY = 5;


let gameOver = false;



function startGame(){

    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";

    draw();


    // ヘビ移動開始

    setInterval(moveSnake,1000);

}




function draw(){

    game.innerHTML="";


    for(let y=0; y<map.length; y++){


        for(let x=0; x<map[y].length; x++){


            const cell=document.createElement("div");

            cell.className="cell";


            if(map[y][x] === "#"){

                cell.textContent="🌳";

            }

            else if(x === playerX && y === playerY){

                cell.textContent="🙂";

            }

            else if(x === snakeX && y === snakeY){

                cell.textContent="🐍";

            }

            else if(map[y][x] === "E"){

                cell.textContent="🌿";

            }


            game.appendChild(cell);

        }

    }

}





// 主人公移動

function movePlayer(direction){


    if(gameOver){
        return;
    }


    let moveX = 0;
    let moveY = 0;



    if(direction==="up"){
        moveY=-1;
    }

    if(direction==="down"){
        moveY=1;
    }

    if(direction==="left"){
        moveX=-1;
    }

    if(direction==="right"){
        moveX=1;
    }



    const nextX = playerX + moveX;
    const nextY = playerY + moveY;



    if(map[nextY][nextX] !== "#"){

        playerX = nextX;
        playerY = nextY;


        draw();


        checkGoal();
        checkSnake();

    }

}





// ヘビ移動

function moveSnake(){


    if(gameOver){
        return;
    }



    let dx = playerX - snakeX;
    let dy = playerY - snakeY;



    if(Math.abs(dx) > Math.abs(dy)){


        snakeX += dx > 0 ? 1 : -1;


    }else{


        snakeY += dy > 0 ? 1 : -1;


    }



    draw();

    checkSnake();


}




// ヘビに捕まったか

function checkSnake(){


    if(playerX === snakeX && playerY === snakeY){


        gameOver = true;


        setTimeout(()=>{

            alert("🐍 GAME OVER\nヘビにつかまった！");

        },100);


    }


}





// ゴール判定

function checkGoal(){


    if(map[playerY][playerX] === "E"){


        gameOver = true;


        setTimeout(()=>{

            alert("🎉 STAGE CLEAR!\n森を抜けた！");

        },100);


    }


}
