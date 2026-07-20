    let map = [];

const game = document.getElementById("game");


// ステージ設定
let stage = 1;


// プレイヤー
let playerX = 1;
let playerY = 1;


// ヘビ
let snakeX = 7;
let snakeY = 5;


// 状態
let gameOver = false;



// ステージごとの難易度

function getDifficulty(){

    if(stage === 1){
        return 0.2; // 木の量
    }

    if(stage === 2){
        return 0.3;
    }

    return 0.4;

}




// マップ作成

function createMap(){

    const width = 10;
    const height = 7;


    map = [];


    for(let y=0;y<height;y++){

        let row = "";


        for(let x=0;x<width;x++){


            // 外側は壁

            if(
                x===0 ||
                y===0 ||
                x===width-1 ||
                y===height-1
            ){

                row += "#";

            }
            else{


                if(Math.random() < getDifficulty()){

                    row += "#";

                }
                else{

                    row += ".";

                }

            }

        }


        map.push(row);

    }



    // スタート地点を空ける

    map[1] =
        replaceTile(map[1],1,".");



    // ゴール地点

    map[5] =
        replaceTile(map[5],8,"E");



    // ヘビ位置

    snakeX = 7;
    snakeY = 5;


}





function replaceTile(row,index,value){

    return row.substring(0,index)
    + value
    + row.substring(index+1);

}





function startGame(){


    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";


    stage = 1;

    playerX = 1;
    playerY = 1;

    gameOver = false;


    createMap();


    draw();


}
// 画面描画

function draw(){

    game.innerHTML="";


    for(let y=0;y<map.length;y++){


        for(let x=0;x<map[y].length;x++){


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

                cell.textContent="🏠";

            }


            game.appendChild(cell);

        }

    }

}





// プレイヤー移動

function movePlayer(direction){


    if(gameOver){
        return;
    }



    let nextX = playerX;
    let nextY = playerY;



    if(direction === "up"){
        nextY--;
    }

    if(direction === "down"){
        nextY++;
    }

    if(direction === "left"){
        nextX--;
    }

    if(direction === "right"){
        nextX++;
    }



    // 壁チェック

    if(map[nextY][nextX] !== "#"){


        playerX = nextX;
        playerY = nextY;



        draw();


        // ゴール確認

        checkGoal();



        // プレイヤーのターン終了
        // 次にヘビが動く

        moveSnake();


        draw();


        checkSnake();


    }


}





// ヘビの移動

function moveSnake(){


    if(gameOver){
        return;
    }



    let power = stage;



    // STAGE1
    // 少し迷う

    if(power === 1){


        if(Math.random() < 0.5){

            moveSnakeX();

        }
        else{

            moveSnakeY();

        }

    }



    // STAGE2
    // 近い方向を優先

    else if(power === 2){


        if(Math.abs(playerX-snakeX) >
           Math.abs(playerY-snakeY)){


            moveSnakeX();


        }
        else{

            moveSnakeY();

        }


    }



    // STAGE3
    // 最短追跡

    else{


        if(playerX > snakeX){

            snakeX++;

        }
        else if(playerX < snakeX){

            snakeX--;

        }
        else if(playerY > snakeY){

            snakeY++;

        }
        else if(playerY < snakeY){

            snakeY--;

        }


    }



}





// 横方向移動

function moveSnakeX(){


    if(playerX > snakeX){

        if(map[snakeY][snakeX+1] !== "#"){
            snakeX++;
        }

    }
    else if(playerX < snakeX){

        if(map[snakeY][snakeX-1] !== "#"){
            snakeX--;
        }

    }

}





// 縦方向移動

function moveSnakeY(){


    if(playerY > snakeY){

        if(map[snakeY+1][snakeX] !== "#"){
            snakeY++;
        }

    }
    else if(playerY < snakeY){

        if(map[snakeY-1][snakeX] !== "#"){
            snakeY--;
        }

    }

}





// ヘビに捕まった

function checkSnake(){


    if(playerX === snakeX &&
       playerY === snakeY){


        gameOver = true;


        alert("🐍 GAME OVER\nヘビにつかまった！");


    }

}





// ゴール

function checkGoal(){


    if(map[playerY][playerX] === "E"){


        gameOver = true;


        alert("🎉 STAGE CLEAR!\n森を抜けた！");


    }

}
