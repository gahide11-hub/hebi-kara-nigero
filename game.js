let map = [];

const game = document.getElementById("game");


// =======================
// 状態
// =======================

let stage = 1;

let playerX = 1;
let playerY = 1;

let snakes = [];

let gameOver = false;




// =======================
// ステージ設定
// =======================

function getStageData(){

    if(stage === 1){

        return {
            width:12,
            height:9,
            snakeCount:1,
            openRate:0.55
        };

    }


    if(stage === 2){

        return {
            width:14,
            height:10,
            snakeCount:2,
            openRate:0.60
        };

    }


    return {
        width:18,
        height:13,
        snakeCount:3,
        openRate:0.65
    };

}






// =======================
// ゲーム開始
// =======================

function startGame(){

    document
    .getElementById("titleScreen")
    .style.display="none";


    document
    .getElementById("gameScreen")
    .style.display="block";


    stage=1;
    gameOver=false;


    createMap();

    updateStageText();

    draw();

}






function updateStageText(){

    const text =
    document.getElementById("stageText");


    if(text){

        text.textContent=stage;

    }

}






// =======================
// マップ生成
// =======================

function createMap(){

    const data=getStageData();


    map=[];


    // 全部森

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



    // 道作成

    openCell(
        playerX,
        playerY
    );


    digRoad(
        playerX,
        playerY,
        data
    );


    // ゴールまで確保

    connectGoal(
        goalX,
        goalY
    );



    map[goalY]=replaceTile(
        map[goalY],
        goalX,
        "E"
    );



    createSnakes(data);

}






// =======================
// 道を広げる
// =======================

function digRoad(x,y,data){

    let count =
    data.width *
    data.height *
    2;


    for(let i=0;i<count;i++){


        let dirs=[

            [1,0],
            [-1,0],
            [0,1],
            [0,-1]

        ];


        dirs.sort(
            ()=>Math.random()-0.5
        );


        for(let d of dirs){


            let nx=x+d[0];
            let ny=y+d[1];


            if(
                nx>0 &&
                ny>0 &&
                nx<data.width-1 &&
                ny<data.height-1
            ){


                if(Math.random()<data.openRate){


                    x=nx;
                    y=ny;


                    openCell(
                        x,
                        y
                    );


                    break;

                }

            }

        }


    }

}






// =======================
// ゴール接続
// =======================

function connectGoal(gx,gy){

    let x=playerX;
    let y=playerY;


    while(
        x!==gx ||
        y!==gy
    ){


        openCell(x,y);


        if(
            Math.random()<0.5 &&
            x!==gx
        ){

            x += x<gx ? 1:-1;

        }
        else if(y!==gy){

            y += y<gy ? 1:-1;

        }


    }


    openCell(
        gx,
        gy
    );

}





function openCell(x,y){

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
// =======================
// ヘビ配置
// =======================

function createSnakes(data){

    snakes=[];


    let places=[];


    for(let y=1;y<data.height-1;y++){

        for(let x=1;x<data.width-1;x++){


            if(map[y][x]==="."){


                if(
                    Math.abs(x-playerX)<=2 &&
                    Math.abs(y-playerY)<=2
                ){

                    continue;

                }


                if(
                    Math.abs(x-(data.width-2))<=1 &&
                    Math.abs(y-(data.height-2))<=1
                ){

                    continue;

                }


                places.push({

                    x:x,
                    y:y

                });


            }


        }

    }



    places.sort(
        ()=>Math.random()-0.5
    );



    for(
        let i=0;
        i<data.snakeCount;
        i++
    ){

        if(places[i]){

            snakes.push({

                x:places[i].x,
                y:places[i].y

            });

        }

    }


}






// =======================
// 描画
// =======================

function draw(){

    game.innerHTML="";


    const data=getStageData();


    game.style.gridTemplateColumns =
    `repeat(${data.width},40px)`;


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


                let snake=false;


                for(let s of snakes){


                    if(
                        s.x===x &&
                        s.y===y
                    ){

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






// =======================
// プレイヤー移動
// =======================

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



    if(
        map[ny] &&
        map[ny][nx]!=="#"
    ){


        playerX=nx;
        playerY=ny;


        draw();


        checkGoal();


        if(!gameOver){

            moveSnakes();

        }


        draw();


        checkSnake();


    }


}







// =======================
// ヘビ移動
// =======================

function moveSnakes(){


    for(let snake of snakes){

        moveSnake(snake);

    }

}






function moveSnake(snake){


    let moves=[

        [1,0],
        [-1,0],
        [0,1],
        [0,-1]

    ];



    // STAGE2は少しミスする

    if(
        stage===2 &&
        Math.random()<0.35
    ){

        moves.sort(
            ()=>Math.random()-0.5
        );

    }
    else{


        moves.sort((a,b)=>{


            let da =
            Math.abs(
                playerX-(snake.x+a[0])
            )
            +
            Math.abs(
                playerY-(snake.y+a[1])
            );



            let db =
            Math.abs(
                playerX-(snake.x+b[0])
            )
            +
            Math.abs(
                playerY-(snake.y+b[1])
            );


            return da-db;


        });


    }




    for(let m of moves){


        let nx=snake.x+m[0];
        let ny=snake.y+m[1];


        if(
            map[ny] &&
            map[ny][nx]!=="#"
        ){

            snake.x=nx;
            snake.y=ny;

            break;

        }


    }


}
// =======================
// ヘビ接触
// =======================

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






// =======================
// ゴール判定
// =======================

function checkGoal(){


    if(
        map[playerY][playerX]==="E"
    ){


        gameOver=true;



        document
        .getElementById("nextStage")
        .style.display="block";


    }


}







// =======================
// 次ステージ
// =======================

function nextStage(){


    stage++;



    if(stage>3){


        alert(
            "🎉 全ステージクリア！"
        );


        return;


    }



    gameOver=false;



    document
    .getElementById("nextStage")
    .style.display="none";



    createMap();


    updateStageText();


    draw();


}







// =======================
// キーボード操作対応
// =======================

document.addEventListener(
"keydown",
function(e){


    if(e.key==="ArrowUp"){

        movePlayer("up");

    }


    if(e.key==="ArrowDown"){

        movePlayer("down");

    }


    if(e.key==="ArrowLeft"){

        movePlayer("left");

    }


    if(e.key==="ArrowRight"){

        movePlayer("right");

    }


});
