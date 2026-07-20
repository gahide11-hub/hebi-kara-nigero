let map = [];

const game = document.getElementById("game");


// 現在ステージ
let stage = 1;


// プレイヤー
let playerX = 1;
let playerY = 1;


// ヘビ一覧
let snakes = [];


// ゲーム状態
let gameOver = false;




// ステージ設定

function getStageData(){


    if(stage === 1){

        return {
            width:10,
            height:7,
            tree:0.2,
            snake:1
        };

    }


    if(stage === 2){

        return {
            width:12,
            height:9,
            tree:0.3,
            snake:2
        };

    }


}





// 森を作る

function createMap(){


    const data = getStageData();


    map=[];


    for(let y=0;y<data.height;y++){


        let row="";


        for(let x=0;x<data.width;x++){


            // 外側は壁

            if(
                x===0 ||
                y===0 ||
                x===data.width-1 ||
                y===data.height-1
            ){

                row += "#";

            }
            else{


                if(Math.random()<data.tree){

                    row += "#";

                }
                else{

                    row += ".";

                }

            }


        }


        map.push(row);

    }





    // スタート地点

    playerX=1;
    playerY=1;


    map[1]=replaceTile(
        map[1],
        1,
        "."
    );





    // ゴール

    map[data.height-2]=replaceTile(
        map[data.height-2],
        data.width-2,
        "E"
    );





    // ヘビ配置

    snakes=[];


    for(let i=0;i<data.snake;i++){


        snakes.push({

            x:data.width-2-i,
            y:data.height-2

        });


    }


}





function replaceTile(row,index,value){

    return row.substring(0,index)
    +value
    +row.substring(index+1);

}





function startGame(){


    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";


    stage=1;

    gameOver=false;


    createMap();

    draw();


}
// 描画

function draw(){

    game.innerHTML="";


    for(let y=0;y<map.length;y++){


        for(let x=0;x<map[y].length;x++){


            const cell=document.createElement("div");

            cell.className="cell";



            if(map[y][x]==="#"){

                cell.textContent="🌳";

            }
            else if(x===playerX && y===playerY){

                cell.textContent="🙂";

            }
            else{


                let snakeHere=false;


                for(let snake of snakes){


                    if(
                        snake.x===x &&
                        snake.y===y
                    ){

                        snakeHere=true;

                    }

                }



                if(snakeHere){

                    cell.textContent="🐍";

                }
                else if(map[y][x]==="E"){

                    cell.textContent="🏠";

                }


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



    let nextX=playerX;
    let nextY=playerY;



    if(direction==="up"){
        nextY--;
    }

    if(direction==="down"){
        nextY++;
    }

    if(direction==="left"){
        nextX--;
    }

    if(direction==="right"){
        nextX++;
    }




    if(map[nextY][nextX]!=="#"){


        playerX=nextX;
        playerY=nextY;



        draw();



        checkGoal();



        // プレイヤーのターン終了
        // ヘビ全員移動

        moveSnakes();



        draw();



        checkSnake();



    }


}





// ヘビ全員移動

function moveSnakes(){


    for(let snake of snakes){


        let dx=playerX-snake.x;
        let dy=playerY-snake.y;



        // 横と縦の距離を比較

        if(Math.abs(dx)>Math.abs(dy)){


            if(dx>0){

                tryMoveSnake(
                    snake,
                    snake.x+1,
                    snake.y
                );

            }
            else{

                tryMoveSnake(
                    snake,
                    snake.x-1,
                    snake.y
                );

            }


        }
        else{


            if(dy>0){

                tryMoveSnake(
                    snake,
                    snake.x,
                    snake.y+1
                );

            }
            else{

                tryMoveSnake(
                    snake,
                    snake.x,
                    snake.y-1
                );

            }


        }


    }


}





// ヘビ移動チェック

function tryMoveSnake(snake,x,y){


    if(map[y][x]!=="#"){


        snake.x=x;
        snake.y=y;


    }


}





// ヘビに捕まったか

function checkSnake(){


    for(let snake of snakes){


        if(
            snake.x===playerX &&
            snake.y===playerY
        ){


            gameOver=true;


            alert(
                "🐍 GAME OVER\nヘビにつかまった！"
            );


        }


    }


}





// ゴール確認

function checkGoal(){


    if(map[playerY][playerX]==="E"){


        gameOver=true;


        document.getElementById(
            "nextStage"
        ).style.display="block";


    }


}





// 次のステージ

function nextStage(){


    stage++;


    if(stage>2){

        alert(
            "🎉 現在のステージはここまで！"
        );

        return;

    }



    gameOver=false;


    document.getElementById(
        "nextStage"
    ).style.display="none";



    createMap();


    draw();


}
