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
            snakeCount:1
        };

    }


    if(stage === 2){

        return {
            width:12,
            height:9,
            tree:0.25,
            snakeCount:2
        };

    }


    return {
        width:15,
        height:11,
        tree:0.35,
        snakeCount:3
    };

}




// ゲーム開始

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

    const text =
    document.getElementById("stageText");


    if(text){

        text.textContent=stage;

    }

}





// マップ生成

function createMap(){


    const data=getStageData();


    map=[];



    // まず全部壁

    for(let y=0;y<data.height;y++){


        let row="";


        for(let x=0;x<data.width;x++){


            row+="#";


        }


        map.push(row);


    }





    playerX=1;
    playerY=1;



    const goalX=data.width-2;
    const goalY=data.height-2;




    // 必ず通れる道を作る

    createPath(
        playerX,
        playerY,
        goalX,
        goalY
    );





    // 周囲を少し開ける

    for(let y=1;y<data.height-1;y++){


        for(let x=1;x<data.width-1;x++){


            if(map[y][x]==="."){


                const around=[

                    [1,0],
                    [-1,0],
                    [0,1],
                    [0,-1]

                ];



                for(let a of around){


                    let nx=x+a[0];

                    let ny=y+a[1];


                    if(
                        nx>0 &&
                        ny>0 &&
                        nx<data.width-1 &&
                        ny<data.height-1
                    ){

                        map[ny]=replaceTile(
                            map[ny],
                            nx,
                            "."
                        );


                    }


                }


            }


        }


    }





    // 木を配置

    for(let y=1;y<data.height-1;y++){


        for(let x=1;x<data.width-1;x++){


            if(map[y][x]==="."){

                continue;

            }



            if(Math.random()<data.tree){


                map[y]=replaceTile(
                    map[y],
                    x,
                    "#"
                );


            }
            else{


                map[y]=replaceTile(
                    map[y],
                    x,
                    "."
                );


            }


        }


    }





    // ゴール

    map[goalY]=replaceTile(
        map[goalY],
        goalX,
        "E"
    );





    // ヘビ配置

    snakes=[];


    const places=[

        {
            x:data.width-2,
            y:1
        },

        {
            x:data.width-2,
            y:data.height-3
        },

        {
            x:1,
            y:data.height-2
        }

    ];



    for(let i=0;i<data.snakeCount;i++){


        snakes.push({

            x:places[i].x,
            y:places[i].y

        });


    }


}





// 道を作る

function createPath(x,y,gx,gy){



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


            x += x<gx ? 1 : -1;


        }
        else if(y!==gy){


            y += y<gy ? 1 : -1;


        }


    }



    map[y]=replaceTile(
        map[y],
        x,
        "."
    );


}





// 文字置換

function replaceTile(row,index,value){

    return row.substring(0,index)
    +value
    +row.substring(index+1);

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
            else if(
                x===playerX &&
                y===playerY
            ){


                cell.textContent="🙂";


            }
            else{


                let snakeFlag=false;


                for(let snake of snakes){


                    if(
                        snake.x===x &&
                        snake.y===y
                    ){

                        snakeFlag=true;

                    }


                }



                if(snakeFlag){

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



    let nx=playerX;

    let ny=playerY;



    if(direction==="up"){

        ny--;

    }

    if(direction==="down"){

        ny++;

    }

    if(direction==="left"){

        nx--;

    }

    if(direction==="right"){

        nx++;

    }





    // 壁チェック

    if(
        map[ny] &&
        map[ny][nx]!=="#"
    ){


        playerX=nx;

        playerY=ny;



        draw();



        checkGoal();



        // プレイヤーのターン終了
        // ヘビが動く

        moveSnakes();



        draw();



        checkSnake();


    }


}





// ヘビ移動

function moveSnakes(){


    for(let snake of snakes){


        chaseSnake(snake);


    }


}





// ヘビ追跡

function chaseSnake(snake){



    let dx=playerX-snake.x;

    let dy=playerY-snake.y;



    let moves=[];



    if(Math.abs(dx)>Math.abs(dy)){


        if(dx>0){

            moves.push([1,0]);

        }
        else{

            moves.push([-1,0]);

        }


        if(dy>0){

            moves.push([0,1]);

        }
        else{

            moves.push([0,-1]);

        }


    }
    else{


        if(dy>0){

            moves.push([0,1]);

        }
        else{

            moves.push([0,-1]);

        }


        if(dx>0){

            moves.push([1,0]);

        }
        else{

            moves.push([-1,0]);

        }


    }





    // 動ける方向を探す

    for(let move of moves){


        let nx=snake.x+move[0];

        let ny=snake.y+move[1];



        if(
            map[ny] &&
            map[ny][nx]!=="#"
        ){


            snake.x=nx;

            snake.y=ny;


            return;

        }


    }


}





// 捕まった確認

function checkSnake(){


    for(let snake of snakes){


        if(
            snake.x===playerX &&
            snake.y===playerY
        ){


            gameOver=true;


            setTimeout(()=>{


                alert(
                    "🐍 GAME OVER\nヘビにつかまった！"
                );


            },100);


        }


    }


}





// ゴール確認

function checkGoal(){


    if(
        map[playerY][playerX]==="E"
    ){


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



    gameOver=false;



    document.getElementById(
        "nextStage"
    ).style.display="none";



    createMap();



    updateStageText();



    draw();


}
