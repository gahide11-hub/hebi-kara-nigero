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
            tree:0.25,
            snakeCount:1
        };

    }


    if(stage === 2){

        return {
            width:12,
            height:9,
            tree:0.30,
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



    const goalX=data.width-2;

    const goalY=data.height-2;




    // 基本ルート作成

    digPath(
        playerX,
        playerY,
        goalX,
        goalY
    );





    // 追加の小道を作る

    createBranches(
        data
    );





    // 森を配置

    for(let y=1;y<data.height-1;y++){


        for(let x=1;x<data.width-1;x++){



            if(map[y][x]==="#"){



                if(Math.random()>data.tree){


                    map[y]=replaceTile(
                        map[y],
                        x,
                        "."
                    );


                }


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

    createSnakes(
        data
    );


}





// 道を掘る

function digPath(x,y,gx,gy){


    map[y]=replaceTile(
        map[y],
        x,
        "."
    );



    while(x!==gx || y!==gy){



        let direction=Math.random();



        if(direction<0.5 && x!==gx){


            x += x<gx ? 1 : -1;


        }
        else if(y!==gy){


            y += y<gy ? 1 : -1;


        }



        map[y]=replaceTile(
            map[y],
            x,
            "."
        );


    }


}





// 分岐作成

function createBranches(data){


    let count =
    stage * 3;



    for(let i=0;i<count;i++){



        let x =
        Math.floor(
            Math.random()*(data.width-2)
        )+1;



        let y =
        Math.floor(
            Math.random()*(data.height-2)
        )+1;



        if(map[y][x]==="."){


            let length=2+
            Math.floor(
                Math.random()*3
            );



            for(let j=0;j<length;j++){



                let nx=x+j;



                if(nx<data.width-1){


                    map[y]=replaceTile(
                        map[y],
                        nx,
                        "."
                    );


                }


            }


        }


    }


}





// ヘビ配置

function createSnakes(data){


    snakes=[];


    let spots=[

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

            x:spots[i].x,
            y:spots[i].y

        });


    }


}





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



        moveSnakes();



        draw();



        checkSnake();


    }


}






// ヘビ移動

function moveSnakes(){



    for(let snake of snakes){


        moveSnake(snake);


    }


}






// ヘビAI

function moveSnake(snake){



    let directions=[

        [1,0],
        [-1,0],
        [0,1],
        [0,-1]

    ];



    // プレイヤー方向を優先

    directions.sort(()=>Math.random()-0.5);



    directions.sort((a,b)=>{


        let da=
        Math.abs(
            playerX-(snake.x+a[0])
        )
        +
        Math.abs(
            playerY-(snake.y+a[1])
        );


        let db=
        Math.abs(
            playerX-(snake.x+b[0])
        )
        +
        Math.abs(
            playerY-(snake.y+b[1])
        );


        return da-db;


    });





    for(let d of directions){


        let nx=snake.x+d[0];

        let ny=snake.y+d[1];



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







// ヘビ接触

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






// ゴール判定

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
