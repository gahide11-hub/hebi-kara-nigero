alert("新しいgame.jsです");
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

let snakeX = 7;
let snakeY = 5;

let gameOver = false;



function startGame(){

    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";

    draw();

    setInterval(moveSnake,1500);

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





function movePlayer(direction){

    if(gameOver) return;


    let x = playerX;
    let y = playerY;


    if(direction==="up") y--;
    if(direction==="down") y++;
    if(direction==="left") x--;
    if(direction==="right") x++;



    if(map[y][x] !== "#"){

        playerX = x;
        playerY = y;

        draw();

        checkSnake();

    }

}




function moveSnake(){

    if(gameOver) return;


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


    draw();

    checkSnake();

}




function checkSnake(){

    if(playerX === snakeX && playerY === snakeY){

        gameOver = true;

        alert("🐍 GAME OVER\nヘビにつかまった！");

    }

}
