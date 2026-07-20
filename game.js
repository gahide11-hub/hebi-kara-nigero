let map = [];
const game = document.getElementById("game");

// 状態管理
let stage = 1;
let playerX = 1, playerY = 1;
let snakes = [], gameOver = false;
let stageNeedsKey = false, collectedKey = false;
let keyX = -1, keyY = -1;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateUI() {
    const stageEl = document.getElementById("stageText");
    const keyEl = document.getElementById("keyDisplay");
    if (stageEl) stageEl.textContent = stage;
    if (keyEl) {
        if (!stageNeedsKey) keyEl.textContent = "";
        else {
            keyEl.textContent = collectedKey ? "🔑 鍵ゲット！" : "🔑 鍵を探して！";
            keyEl.style.color = collectedKey ? "#d4af37" : "#aaa";
            keyEl.style.fontWeight = collectedKey ? "bold" : "normal";
        }
    }
}

function getStageData() {
    if (stage === 1) return { width: 12, height: 9, snakeCount: 1, density: 0.35, hasKey: false };
    if (stage === 2) return { width: 15, height: 11, snakeCount: 1, density: 0.4, hasKey: true };
    return { width: 18, height: 13, snakeCount: 2, density: 0.45, hasKey: true };
}

// =======================
// マップ生成
// =======================
function createMap() {
    const data = getStageData();
    stageNeedsKey = data.hasKey; 
    collectedKey = !data.hasKey; 
    keyX = -1; keyY = -1;

    map = [];
    for (let y = 0; y < data.height; y++) {
        let row = new Array(data.width).fill(".");
        for (let x = 0; x < data.width; x++) {
            if (y === 0 || y === data.height - 1 || x === 0 || x === data.width - 1) row[x] = "#";
        }
        map.push(row);
    }
    
    playerX = 1; playerY = 1;
    const goalX = data.width - 2; const goalY = data.height - 2;

    makeGoalPath(goalX, goalY);
    populateTreesDispersed(data.density);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "P") map[y][x] = ".";
        }
    }

    map[goalY][goalX] = "E";
    if (stageNeedsKey) createKey(data);
    createSnakes(data);
    
    updateUI();
    draw();
}

function makeGoalPath(gx, gy) {
    let x = playerX, y = playerY;
    while (x !== gx || y !== gy) {
        map[y][x] = "P";
        if (Math.random() < 0.5 && x !== gx) x += x < gx ? 1 : -1;
        else if (y !== gy) y += y < gy ? 1 : -1;
    }
    map[gy][gx] = "P";
}

function populateTreesDispersed(density) {
    let candidates = [];
    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
            if (map[y][x] === "." && !(x === playerX && y === playerY)) {
                candidates.push({x: x, y: y});
            }
        }
    }
    shuffleArray(candidates);

    for (let pos of candidates) {
        if (Math.random() < density) {
            let nearTreeCount = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (map[pos.y + dy] && map[pos.y + dy][pos.x + dx] === "#") {
                        nearTreeCount++;
                    }
                }
            }

            if (nearTreeCount < 2) {
                map[pos.y][pos.x] = "#";
            }
        }
    }
}

function createKey(data) {
    let spots = [];
    for (let y = 1; y < data.height - 1; y++) {
        for (let x = 1; x < data.width - 1; x++) {
            if (map[y][x] === ".") spots.push({ x: x, y: y });
        }
    }
    shuffleArray(spots);
    if (spots.length > 0) { keyX = spots[0].x; keyY = spots[0].y; }
}

function createSnakes(data) {
    snakes = []; let spots = [];
    for (let y = 1; y < data.height - 1; y++) {
        for (let x = 1; x < data.width - 1; x++) {
            if (map[y][x] === "." && !(x === keyX && y === keyY)) {
                 spots.push({ x: x, y: y });
            }
        }
    }
    shuffleArray(spots);
    for (let i = 0; i < data.snakeCount; i++) { if (spots[i]) snakes.push({ x: spots[i].x, y: spots[i].y }); }
}

// 描画（画面サイズに合わせて1マスの大きさを自動調整）
function draw() {
    game.innerHTML = "";
    const data = getStageData();

    // 画面横幅に合わせてマス目サイズ（cellSize）を動的に計算
    const availableWidth = Math.min(window.innerWidth - 20, 600); // 画面幅から余白を引く
    let cellSize = Math.floor(availableWidth / data.width) - 2;
    cellSize = Math.min(Math.max(cellSize, 18), 40); // 18px〜40pxの範囲に収める
    const fontSize = Math.floor(cellSize * 0.65); // アイコンサイズも自動縮小

    game.style.gridTemplateColumns = `repeat(${data.width}, ${cellSize}px)`;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.fontSize = `${fontSize}px`;

            if (map[y][x] === "#") cell.textContent = "🌳";
            else if (x === playerX && y === playerY) cell.textContent = "🙂";
            else {
                let snakeHere = snakes.some(s => s.x === x && s.y === y);
                if (snakeHere) cell.textContent = "🐍";
                else if (stageNeedsKey && !collectedKey && x === keyX && y === keyY) cell.textContent = "🔑";
                else if (map[y][x] === "E") cell.textContent = collectedKey ? "🏠" : "🔒";
            }
            game.appendChild(cell);
        }
    }
}

// ゲーム処理
function checkKey() {
    if (stageNeedsKey && playerX === keyX && playerY === keyY && !collectedKey) {
        collectedKey = true; keyX = -1; keyY = -1;
        updateUI(); draw();
    }
}

function checkGoal() {
    if (map[playerY][playerX] === "E") {
        if (stageNeedsKey && !collectedKey) return; 
        gameOver = true; document.getElementById("nextStage").style.display = "block";
    }
}

function movePlayer(dir) {
    if (gameOver) return;
    let nx = playerX, ny = playerY;
    if (dir === "up") ny--; if (dir === "down") ny++;
    if (dir === "left") nx--; if (dir === "right") nx++;
    if (map[ny] && map[ny][nx] !== "#") {
        playerX = nx; playerY = ny;
        checkKey(); checkGoal();
        if (!gameOver) moveSnakes();
        draw(); checkSnake();
    }
}

function moveSnakes() {
    let nextPositions = [];
    for (let i = 0; i < snakes.length; i++) nextPositions.push(getNextSnakePos(snakes[i], nextPositions));
    for (let i = 0; i < snakes.length; i++) { snakes[i].x = nextPositions[i].x; snakes[i].y = nextPositions[i].y; }
}

function getNextSnakePos(snake, currentNextPositions) {
    let moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    if (stage === 1 && Math.random() < 0.5) shuffleArray(moves);
    else {
        moves.sort((a, b) => {
            let da = Math.abs(playerX - (snake.x + a[0])) + Math.abs(playerY - (snake.y + a[1]));
            let db = Math.abs(playerX - (snake.x + b[0])) + Math.abs(playerY - (snake.y + b[1]));
            return da - db;
        });
    }
    for (let m of moves) {
        let nx = snake.x + m[0], ny = snake.y + m[1];
        if (!map[ny] || map[ny][nx] === "#") continue;
        let collisionWithUnmoved = snakes.some(other => other !== snake && !currentNextPositions.some((_, idx) => snakes[idx] === other) && other.x === nx && other.y === ny);
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

function startGame() {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    stage = 1; gameOver = false; createMap();
}

function nextStage() {
    stage++;
    if (stage > 3) { alert("🎉 全ステージクリア！"); return; }
    gameOver = false; document.getElementById("nextStage").style.display = "none";
    createMap();
}

// 画面サイズ変更時にも自動再計算して再描画
window.addEventListener("resize", () => {
    if (document.getElementById("gameScreen").style.display !== "none") {
        draw();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp") movePlayer("up");
    if (e.key === "ArrowDown") movePlayer("down");
    if (e.key === "ArrowLeft") movePlayer("left");
    if (e.key === "ArrowRight") movePlayer("right");
});
