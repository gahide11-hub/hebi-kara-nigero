const map = [
"##########",
"#P.......#",
"#..###...#",
"#......#.#",
"#..#....E#",
"#........#",
"##########"
];


const game = document.getElementById("game");


function draw(){

    game.innerHTML = "";

    for(let y = 0; y < map.length; y++){

        for(let x = 0; x < map[y].length; x++){

            const cell = document.createElement("div");

            cell.className = "cell";


            if(map[y][x] === "#"){

                cell.textContent = "🌳";

            }

            else if(map[y][x] === "P"){

                cell.textContent = "🙂";

            }

            else if(map[y][x] === "E"){

                cell.textContent = "🌿";

            }


            game.appendChild(cell);

        }

    }

}


function startGame(){

    document.getElementById("titleScreen").style.display="none";

    document.getElementById("gameScreen").style.display="block";

    draw();

}
