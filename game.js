let map = [];

const game = document.getElementById("game");


// ステージ
let stage = 1;


// プレイヤー
let playerX = 1;
let playerY = 1;


// ゴール
let goalX = 0;
let goalY = 0;


// ヘビ
let snakes = [];


// 状態
let gameOver = false;





// ステージ設定

function getStageData(){


    if(stage===1){

        return {

            width:10,
            height:7,
            snakeCount:1

        };

    }



    if(stage===2){

        return {

            width:12,
            height:9,
            snakeCount:2

        };

    }



    return {

        width:15,
        height:11,
        snakeCount:3

    };


}






// ゲーム開始

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



    // 全部壁

    for(let y=0;y<data.height;y++){


        let row="";


        for(let x=0;x<data.width;x++){


            row+="#";


        }


        map.push(row);


    }




    playerX=1;

    playerY=1;


    goalX=data.width-2;

    goalY=data.height-2;





    // 迷路を作る

    carveMaze(
        1,
        1
    );





    // ゴール確保

    map[goalY]=replaceTile(
        map[goalY],
        goalX,
        "E"
    );





    // ヘビ配置

    createSnakes(data);



}






// 穴掘り法

function carveMaze(x,y){



    map[y]=replaceTile(
        map[y],
        x,
        "."
    );



    let dirs=[


        [2,0],

        [-2,0],

        [0,2],

        [0,-2]


    ];



    // ランダム化

    dirs.sort(
        ()=>Math.random()-0.5
    );




    for(let d of dirs){



        let nx=x+d[0];

        let ny=y+d[1];



        if(
            ny>0 &&
            ny<map.length-1 &&
            nx>0 &&
            nx<map[0].length-1 &&
            map[ny][nx]==="#"
        ){



            // 間の壁を壊す

            map[
                y+d[1]/2
            ]=replaceTile(
                map[y+d[1]/2],
                x+d[0]/2,
                "."
            );



            carveMaze(
                nx,
                ny
            );



        }


    }


}






// ヘビ配置

function createSnakes(data){


    snakes=[];



    let positions=[


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

            x:positions[i].x,

            y:positions[i].y

        });


    }


}







// 文字置換

function replaceTile(row,index,value){


    return row.substring(0,index)
    +value
    +row.substring(index+1);


}
// =======================
// 描画
// =======================

function draw(){


    game.innerHTML="";



    // ステージによって列数変更

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
                else if(
                    map[y][x]==="E"
                ){


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





    // 壁チェック

    if(
        map[ny] &&
        map[ny][nx]!=="#"
    ){


        playerX=nx;

        playerY=ny;



        draw();



        checkGoal();



        // プレイヤー移動後だけヘビ移動

        moveSnakes();



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



    // プレイヤーに近づく順

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
// ヘビ判定
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
