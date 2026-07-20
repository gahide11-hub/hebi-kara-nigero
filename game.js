let map = [];

const game = document.getElementById("game");


// ステージ
let stage = 1;


// プレイヤー
let playerX = 1;
let playerY = 1;


// ヘビ
let snakes = [];


// 状態
let gameOver = false;




// ステージ設定

function getStageData(){


    if(stage === 1){

        return {
            width:10,
            height:7,
            snakes:1,
            tree:0.15
        };

    }


    if(stage === 2){

        return {
            width:12,
            height:9,
            snakes:2,
            tree:0.25
        };

    }


    return {
        width:15,
        height:11,
        snakes:3,
        tree:0.35
    };


}





// マップ作成

function createMap(){


    const data = getStageData();


    map=[];


    for(let y=0;y<data.height;y++){


        let row="";


        for(let x=0;x<data.width;x++){


            if(
                x===0 ||
                y===0 ||
                x===data.width-1 ||
                y===data.height-1
            ){

                row+="#";

            }
            else{

                row+=".";

            }

        }


        map.push(row);

    }





    // 木を配置

    for(let y=1;y<data.height-1;y++){


        for(let x=1;x<data.width-1;x++){


            if(
                (x===1 && y===1) ||
                (x===data.width-2 && y===data.height-2)
            ){

                continue;

            }



            if(Math.random()<data.tree){

                map[y]=replaceTile(
                    map[y],
                    x,
                    "#"
                );

            }


        }


    }





    // 必ず通れる道を作る

    createPath(
        1,
        1,
        data.width-2,
        data.height-2
    );





    // ゴール

    map[data.height-2]=replaceTile(
        map[data.height-2],
        data.width-2,
        "E"
    );





    // プレイヤー位置

    playerX=1;
    playerY=1;





    // ヘビ配置

    snakes=[];


    for(let i=0;i<data.snakes;i++){


        snakes.push({

            x:data.width-2-i,
            y:data.height-2

        });


    }


}






// 道を確保

function createPath(x1,y1,x2,y2){


    let x=x1;
    let y=y1;



    while(x!==x2 || y!==y2){



        map[y]=replaceTile(
            map[y],
            x,
            "."
        );



        if(Math.random()<0.5){


            if(x<x2){
                x++;
            }
            else if(x>x2){
                x--;
            }


        }
        else{


            if(y<y2){
                y++;
            }
            else if(y>y2){
                y--;
            }


        }


    }


    map[y2]=replaceTile(
        map[y2],
        x2,
        "."
    );


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


    updateStageText();


    draw();


}
// ステージ表示更新

function updateStageText(){

    const text = document.getElementById("stageText");

    if(text){

        text.textContent = stage;

    }

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


                let snake=false;


                for(let s of snakes){


                    if(s.x===x && s.y===y){

                        snake=true;

                    }

                }



                if(snake){

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




    // 壁チェック

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





// ヘビ移動

function moveSnakes(){



    for(let snake of snakes){



        let dx=playerX-snake.x;

        let dy=playerY-snake.y;




        // ステージごとに強さ変更

        if(stage===1){


            // 少し迷う

            if(Math.random()<0.5){

                randomSnakeMove(snake);

            }
            else{

                chaseMove(snake);

            }


        }
        else{


            // STAGE2以降は追跡

            if(Math.abs(dx)>Math.abs(dy)){


                if(dx>0){

                    tryMove(
                        snake,
                        snake.x+1,
                        snake.y
                    );

                }
                else{

                    tryMove(
                        snake,
                        snake.x-1,
                        snake.y
                    );

                }


            }
            else{


                if(dy>0){

                    tryMove(
                        snake,
                        snake.x,
                        snake.y+1
                    );

                }
                else{

                    tryMove(
                        snake,
                        snake.x,
                        snake.y-1
                    );

                }


            }


        }


    }


}





// 追跡移動

function chaseMove(snake){


    let dx=playerX-snake.x;
    let dy=playerY-snake.y;



    if(Math.abs(dx)>Math.abs(dy)){


        if(dx>0){

            tryMove(
                snake,
                snake.x+1,
                snake.y
            );

        }
        else{

            tryMove(
                snake,
                snake.x-1,
                snake.y
            );

        }


    }
    else{


        if(dy>0){

            tryMove(
                snake,
                snake.x,
                snake.y+1
            );

        }
        else{

            tryMove(
                snake,
                snake.x,
                snake.y-1
            );

        }


    }


}





// ランダム移動

function randomSnakeMove(snake){


    const dirs=[

        [1,0],
        [-1,0],
        [0,1],
        [0,-1]

    ];


    const d =
        dirs[Math.floor(Math.random()*dirs.length)];



    tryMove(
        snake,
        snake.x+d[0],
        snake.y+d[1]
    );


}





// ヘビ移動可能か

function tryMove(snake,x,y){


    if(map[y][x]!=="#"){


        snake.x=x;
        snake.y=y;


    }


}





// ヘビ確認

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





// 次ステージ

function nextStage(){


    stage++;



    if(stage>3){


        alert(
            "🎉 全ステージクリア！"
        );


        return;


    }



    document.getElementById(
        "nextStage"
    ).style.display="none";



    gameOver=false;



    createMap();



    updateStageText();



    draw();


}
