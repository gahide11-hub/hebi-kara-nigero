console.log("game.js読み込み成功");
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



function startGame(){

    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";

    draw();

}




function draw(){

    game.innerHTML="";


    for(let y=0; y<map.length; y++){


        for(let x=0; x<map[y].length; x++){


            const cell=document.createElement("div");

            cell.className="cell";


            if(map[y][x]=="#"){

                cell.textContent="🌳";

            }

            else if(x===playerX && y===playerY){

                cell.textContent="🙂";

            }

            else if(map[y][x]=="E"){

                cell.textContent="🌿";

            }


            game.appendChild(cell);

        }

    }

}





function movePlayer(direction){


    let moveX=0;
    let moveY=0;



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



    const nextX=playerX+moveX;
    const nextY=playerY+moveY;



    // 森の外・木には入れない

    if(map[nextY][nextX] !== "#"){

        playerX=nextX;
        playerY=nextY;

        draw();
    // ゴール到達チェック

    if(map[playerY][playerX] === "E"){

        setTimeout(function(){

            alert("🎉 STAGE CLEAR!\n\n森を抜けた！");

        },100);

    }

                
    }


}
