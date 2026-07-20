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

// 鍵システム用の状態
let hasKey = false;
let keyX = -1;
let keyY = -1;

// Fisher-Yates シャッフル
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// =======================
// ステージ設定（ヘビ数を調整済）
// =======================
function getStageData() {
    if (stage === 1) {
        return { width: 12, height: 9, snakeCount: 1, roadRate: 0.6, hasKey: false };
    }
    if (stage === 2) {
        return { width: 15, height: 11, snakeCount: 1, roadRate: 0.55, hasKey: true };
    }
    // ステージ3
    return { width: 18, height: 13, snakeCount: 2, roadRate: 0.5, hasKey: true };
}

// =======================
// ゲーム開始
// =======================
function startGame() {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    stage = 1;
    gameOver = false;
    createMap();
    updateStageText();
    draw();
}

function updateStageText() {
    const text = document.getElementById("stageText");
    if (text) text.textContent = stage;
}

// =======================
// マップ生成
// =======================
function createMap() {
    const data = getStageData();
    
    // 状態リセット
    hasKey = !data.hasKey;
    keyX = -1;
    keyY = -1;

    // 2次元配列初期化
    map = [];
    for (let y = 0; y < data.height; y++) {
        map.push(new Array(data.width).fill("#"));
    }

    playerX = 1;
    playerY = 1;
    const goalX = data.width - 2;
    const goalY = data.height - 2;

    openCell(playerX, playerY);
    createForestRoad(data);
    makeGoalPath(goalX, goalY);
    map[goalY][goalX] = "E";

    if (data.hasKey) createKey(data);
    createSnakes(data);
}

// =======================
// 鍵・道・敵配置
// =======================
function createKey(data) {
    let spots = [];
    for (let y = 1; y < data.height - 1; y++) {
        for (let x = 1; x < data.width - 1; x++) {
            if (map[y][x] === ".") {
                if (Math.abs(x - playerX) <= 2 && Math.abs(y - playerY) <= 2) continue;
                if (Math.abs(x - (data.width - 2)) <= 1 && Math.abs(y - (data.height - 2)) <= 1) continue;
                spots.push({ x: x, y: y });
            }
        }
    }
    shuffleArray(spots);
    if (spots.length > 0) {
        keyX = spots[0].x;
        keyY = spots[0].y;
    }
}

function createForestRoad(data) {
    let x = playerX;
    let y = playerY;
    let count = data.width * data.height * 3;
    for (let i = 0; i < count; i++) {
        let dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        shuffleArray(dirs);
        for (let d of dirs) {
            let nx = x + d[0], ny = y + d[1];
            if (nx > 0 && ny > 0 && nx < data.width - 1 && ny < data.height - 1) {
                if (Math.random() < data.roadRate) {
                    x = nx; y = ny;
                    openCell(x, y);
                    break;
                }
            }
        }
    }
}

function makeGoalPath(gx, gy) {
    let x = playerX, y = playerY;
    while (x !== gx || y !== gy) {
        openCell(x, y);
        if (Math.random() < 0.5 && x !== gx) x += x < gx ? 1 : -1;
        else if (y !== gy) y += y < gy ? 1 : -1;
    }
    openCell(gx, gy);
}

function openCell(x, y) { map[y][x] = "."; }

function createSnakes(data) {
    snakes = [];
    let spots = [];
    for (let y = 1; y < data.height - 1; y++) {
        for (let x = 1; x < data.width - 1; x++) {
            if (map[y][x] === ".") {
                if (Math.abs(x - playerX) <= 2 && Math.abs(y - playerY) <= 2) continue;
                if (Math.abs(x - (data.width - 2)) <= 1 && Math.abs(y - (data.height - 2)) <= 1) continue;
                if (x === keyX && y === keyY) continue;
                spots.push({ x: x, y: y });
            }
        }
    }
    shuffleArray(spots);
    for (let i = 0; i < data.snakeCount; i++) {
        if (spots[i]) snakes.push({ x: spots[i].x, y: spots[i].y });
    }
}

// =======================
// 描画
// =======================
function draw() {
    game.innerHTML = "";
    const data = getStageData();
    game.style.gridTemplateColumns = `repeat(${data.width}, 40px)`;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (map[y][x] === "#") {
                cell.textContent = "🌳";
            } else if (x === playerX && y === playerY) {
                cell.textContent = "🙂";
            } else {
                let snakeHere = snakes.some(s => s.x === x && s.y === y);
                if (snakeHere) {
                    cell.textContent = "🐍";
                } else if (x === keyX && y === keyY && !hasKey) {
                    cell.textContent = "🔑";
                } else if (map[y][x] === "E") {
                    cell.textContent = "🏠";
                }
            }
            game.appendChild(cell);
        }
    }
}

// =======================
// プレイヤー移動
// =======================
function movePlayer(direction) {
    if (gameOver) return;
    let nx = playerX, ny = playerY;
    if (direction === "up") ny--;
    if (direction === "down") ny++;
    if (direction === "left") nx--;
    if (direction === "right") nx++;

    if (map[ny] && map[ny][nx] !== "#") {
        playerX = nx;
        playerY = ny;
        checkKey();
        checkGoal();
        if (!gameOver) moveSnakes();
        draw();
        checkSnake();
    }
}

// =======================
// 各種ゲームロジック
// =======================
function checkKey() {
    if (playerX === keyX && playerY === keyY && !hasKey) {
        hasKey = true;
        keyX = -1; keyY = -1;
    }
}

function moveSnakes() {
    let nextPositions = [];
    for (let i = 0; i < snakes.length; i++) {
        nextPositions.push(getNextSnakePos(snakes[i], nextPositions));
    }
    for (let i = 0; i < snakes.length; i++) {
        snakes[i].x = nextPositions[i].x;
        snakes[i].y = nextPositions[i].y;
    }
}

function getNextSnakePos(snake, currentNextPositions) {
    let moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    if (stage === 1 && Math.random() < 0.5) {
        shuffleArray(moves);
    } else {
        moves.sort((a, b) => {
            let da = Math.abs(playerX - (snake.x + a[0])) + Math.abs(playerY - (snake.y + a[1]));
            let db = Math.abs(playerX - (snake.x + b[0])) + Math.abs(playerY - (snake.y + b[1]));
            return da - db;
        });
    }

    for (let m of moves) {
        let nx = snake.x + m[0], ny = snake.y + m[1];
        if (!map[ny] || map[ny][nx] === "#") continue;
        
        let collisionWithUnmoved = snakes.some(other => 
            other !== snake && !currentNextPositions.some((_, idx) => snakes[idx] === other) && other.x === nx && other.y === ny
        );
        let collisionWithMoved = currentNextPositions.some(pos => pos.x === nx && pos.y === ny);

        if (!collisionWithUnmoved && !collisionWithMoved) return { x: nx, y: ny };
    }
    return { x: snake.x, y: snake.y };
}

function checkSnake() {
    for (let snake of snakes) {
        if (snake.x === playerX && snake.y === playerY) {
            gameOver = true;
            setTimeout(() => alert("🐍 GAME OVER\nヘビにつかまった！"), 100);
            break;
        }
    }
}

function checkGoal() {
    if (map[playerY][playerX] === "E" && hasKey) {
        gameOver = true;
        document.getElementById("nextStage").style.display = "block";
    }
}

function nextStage() {
    stage++;
    if (stage > 3) {
        alert("🎉 全ステージクリア！");
        return;
    }
    gameOver = false;
    document.getElementById("nextStage").style.display = "none";
    createMap();
    updateStageText();
    draw();
}

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp") movePlayer("up");
    if (e.key === "ArrowDown") movePlayer("down");
    if (e.key === "ArrowLeft") movePlayer("left");
    if (e.key === "ArrowRight") movePlayer("right");
});
