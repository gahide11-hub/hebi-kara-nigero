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
            tree:0.15,
            snakes:1
        };

    }


    if(stage === 2){

        return {
            width:12,
            height:9,
            tree:0.25,
            snakes:2
        };

    }


    return {
        width:15,
        height:11,
        tree:0.35,
        snakes:3
    };

}





// マップ生成

function createMap(){


    const data = getStageData();


    map=[];



    // まず全部道にする

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




    // スタート

    playerX=1;
    playerY=1;



    // ゴール位置

    let goalX=data.width-2;
    let goalY=data.height-2;




    // 安全な道を作る

    createSafePath(
        playerX,
        playerY,
        goalX,
        goalY
    );





    // 木を置く

    for(let y=1;y<data.height-1;y++){


        for(let x=1;x<data.width-1;x++){



            // 道は守る

            if(map[y][x]==="."){


                // スタートとゴール周辺は空ける

                if(
                    Math.abs(x-playerX)<=1 &&
                    Math.abs(y-playerY)<=1
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


    }





    // ゴール設置

    map[goalY]=replaceTile(
        map[goalY],
        goalX,
        "E"
    );





    // ヘビ配置

    snakes=[];


    let snakePlaces=[


        {
            x:data.width-2,
            y:1
        },


        {
            x:1,
            y:data.height-2
        },


        {
            x:data.width-3,
            y:data.height-3
        }


    ];



    for(let i=0;i<data.snakes;i++){


        snakes.push({

            x:snakePlaces[i].x,
            y:snakePlaces[i].y

        });


    }


}





// 必ずゴールへつながる道

function createSafePath(x,y,gx,gy){


    while(x!==gx || y!==gy){



        map[y]=replaceTile(
            map[y],
            x,
            "."
        );



        if(
            Math.random()<0.5 &&
            x!==gx
        ){


            if(x<gx){

                x++;

            }
            else{

                x--;

            }


        }
        else if(y!==gy){


            if(y<gy){

                y++;

            }
            else{

                y--;

            }


        }


    }


    map[y]=replaceTile(
        map[y],
        x,
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
// ステージ表示

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



        // プレイヤーのターン後に
        // ヘビ全員が1回動く

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



        // STAGE1は少し迷う

        if(stage===1){



            if(Math.random()<0.5){

                randomMoveSnake(snake);

            }
            else{

                chaseSnake(snake);

            }



        }
        else{


            // STAGE2以降は追跡


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


}





// 追跡

function chaseSnake(snake){


    let dx=playerX-snake.x;
    let dy=playerY-snake.y;



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





// ランダム移動

function randomMoveSnake(snake){


    let moves=[

        [1,0],
        [-1,0],
        [0,1],
        [0,-1]

    ];


    let move =
        moves[Math.floor(Math.random()*moves.length)];


    tryMoveSnake(
        snake,
        snake.x+move[0],
        snake.y+move[1]
    );


}





// ヘビ移動チェック

function tryMoveSnake(snake,x,y){


    if(map[y][x]!=="#"){


        snake.x=x;

        snake.y=y;


    }


}





// ヘビに捕まった

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





// ゴール

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


    if(stage>3){


        alert(
            "🎉 全ステージクリア！"
        );


        return;

    }



    gameOver=false;


    document.getElementById(
        "nextStage"
    ).style.display="none";



    createMap();


    updateStageText();


    draw();


}
