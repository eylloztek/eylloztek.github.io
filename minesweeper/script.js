const table = [];
const tableHTML = [];

const gameDiv = document.getElementById("game");
const tableDiv = document.getElementById("table");
const title = document.getElementById("title");

let sizeX = 16;
let sizeY = 16;
let bombs = 40;

let generatedBombs = false;
let started = false;
let gameLost = false;
let gameWon = false;
let bestTimes = {
    easy: Infinity,
    normal: Infinity,
    hard: Infinity,
  };

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];
const EMPTY = 0, MINE = -1, NUMBER = 1, FLAG_RIGHT = -2, FLAG_WRONG = 2;

function buildTableArray() {
    for(let y = 0; y < sizeY; y++) {
        table.push([]);
        for(let x = 0; x < sizeX; x++) {
            table[y].push(0);
        }
    }
}

let firstClick = true;

function generateBombs(startX, startY) {
    generatedBombs = true;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            table[startY + i][startX + j] = NUMBER;
        }
    }
    let x = Math.floor(Math.random() * sizeX);
    let y = Math.floor(Math.random() * sizeY);
    for (let i = 0; i < bombs; i++) {
        while (table[y][x] !== EMPTY) {
            x = Math.floor(Math.random() * sizeX);
            y = Math.floor(Math.random() * sizeY);
        }
        table[y][x] = MINE;
    }
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            table[startY + i][startX + j] = EMPTY;
        }
    }
}


function getBoxNumber(x, y) {
    let count = 0, xx, yy;
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            xx = x+j;
            yy = y+i;
            if(yy >= 0 && xx >= 0 && yy < sizeY && xx < sizeX) {
                if (table[yy][xx] < 0)
                    count++;
            }
        }
    }
    return count;
}

function winCheck() {
    for(let y = 0; y < sizeY; y++) {
        for(let x = 0; x < sizeX; x++) {
            if(table[y][x] === FLAG_WRONG || table[y][x] === EMPTY) {
                return;
            }
        }
    }
    win();
}


function buildTableHTML() {
    for(let y = 0; y < sizeY; y++) {
        const line = document.createElement("div");
        line.classList.add("table-line");
        tableDiv.appendChild(line);

        tableHTML.push([]);
        for(let x = 0; x < sizeX; x++) {
            const box = document.createElement("div");
            box.classList.add("table-box");
            box.classList.add("animation");
            box.onmouseenter = () => {
                box.classList.add("hovered");
            }
            box.onmouseleave = () => {
                box.classList.remove("hovered");
            }
            box.onclick = (ev) => {
                ev.preventDefault();
                leftClickController(box, x, y);
            }
            box.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                rightClickController(box, x, y);
                return false;
            }, false);
            line.appendChild(box);
            tableHTML[y].push(box);
        }
    }
}

function leftClickController(elem, x, y) {
    leftClickController(elem, x, y, false);
}

function leftClickController(elem, x, y, recursion) {
    if (!generatedBombs) {
        generateBombs(x, y);
        startTimer();
        firstClick = false;
    }
    if (!started || gameLost || gameWon) {
        return;
    }
    if (table[y][x] === MINE) {
        gameOver();
        return;
    } else if (table[y][x] !== EMPTY) {
        let nr = tableHTML[y][x].innerText;
        if (nr === undefined || nr === 0) return;

        let flags = 0;
        let noEmpty = true;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let xx = x + i;
                if (xx < 0 || xx >= sizeX) continue;
                let yy = y + j;
                if (yy < 0 || yy >= sizeY) continue;
                if (table[yy][xx] === FLAG_WRONG) gameOver();
                if (table[yy][xx] === FLAG_RIGHT) flags++;
                else if (table[yy][xx] === EMPTY) noEmpty = false;
            }
        }
        if (noEmpty) return;
        if (flags.toString() !== nr) return;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let xx = x + i;
                if (xx < 0 || xx >= sizeX) continue;
                let yy = y + j;
                if (yy < 0 || yy >= sizeY) continue;
                if (table[yy][xx] === EMPTY)
                    leftClickController(tableHTML[yy][xx], xx, yy, true);
            }
        }
        return;
    }

    if (!recursion) {
        table[y][x] = NUMBER;
        elem.classList.add("number");
        let nr = getBoxNumber(x, y);
        elem.classList.add(numbers[nr]);
        if (nr === 0) {
            const emptyNeighbours = [];
            let xx, yy, elemTemp;
            emptyNeighbours.push({x: x, y: y});
            while(emptyNeighbours.length > 0) {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        xx = emptyNeighbours[0].x+j;
                        yy = emptyNeighbours[0].y+i;
                        if (yy >= 0 && xx >= 0 && yy < sizeY && xx < sizeX) {
                            if (table[yy][xx] === EMPTY) {
                                elemTemp = tableHTML[yy][xx];
                                elemTemp.classList.add("number");
                                nr = getBoxNumber(xx, yy);
                                elemTemp.classList.add(numbers[nr]);
                                if(nr === 0) {
                                    emptyNeighbours.push({x: xx, y: yy});
                                }
                                else {
                                    elemTemp.innerText = nr.toString();
                                }
                                table[yy][xx] = NUMBER;
                            }
                        }
                    }
                }
                emptyNeighbours.shift();
            }
        } else {
            elem.innerText = nr.toString();
        }
        table[y][x] = NUMBER;
        winCheck();
    }
}

function rightClickController(elem, x, y) {
    if(!generatedBombs) {
        generateBombs(x, y);
        firstClick = false;
    }

    if (!started || gameLost || gameWon) {
      return;
    }

    if(table[y][x] === EMPTY || table[y][x] === MINE) {
        elem.classList.add("flag");
        mineCounter--;
            updateMineCounter();
        if(table[y][x] === MINE)
            table[y][x] = FLAG_RIGHT;
        else
            table[y][x] = FLAG_WRONG;
    }
    else if(table[y][x] === FLAG_RIGHT) {
        table[y][x] = MINE;
        elem.classList.remove("flag");
        mineCounter++;
            updateMineCounter();
    }
    else if(table[y][x] === FLAG_WRONG) {
        table[y][x] = EMPTY;
        elem.classList.remove("flag");
        mineCounter++;
            updateMineCounter();

    }

}

function resetGame() {
    started = false;
    gameLost = false;
    gameWon = false;
}

function start(x, y, bombsAmount) {
    resetGame();

    while (tableDiv.firstElementChild != null) {
        tableDiv.firstElementChild.remove();
    }
    resetTimer();
    gameDiv.style.paddingBottom = '0';
    gameDiv.style.paddingTop = '0';
    started = true;

    sizeX = x;
    sizeY = y;
    bombs = bombsAmount;

    gameDiv.style.paddingTop = '2vh';
    gameDiv.style.paddingBottom = '6vh';
    title.classList.add("title-top");

    table.length = 0;
    tableHTML.length = 0;
    generatedBombs = false;
    resetTimer();
    buildTableArray();
    buildTableHTML();
    document.querySelector('.mine-count').classList.add('visible');
    mineCounter = bombsAmount;
    updateMineCounter();

    setTimeout(startAnimation, 50);
}

function startAnimation() {
    let cols = document.getElementsByClassName("table-box");
    for(let i = 0; i < cols.length; i++) {
        cols[i].classList.remove("animation");
    }
}

function win() {
    if (!gameWon) {
        gameWon = true;
        stopTimer();

        const difficulty = getDifficulty();
        const currentTime = getElapsedTime();

        if (currentTime < bestTimes[difficulty]) {
            bestTimes[difficulty] = currentTime;
            updateBestTimes();
        }

        alert('You won the game. Congratulations!');
    }
}

function gameOver() {
  gameLost = true;
  alert("You've lost the game!");
  generateBombsAfterLoss();
  stopTimer();
}

function generateBombsAfterLoss() {
  for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
          if (table[y][x] === MINE) {
              tableHTML[y][x].classList.add("bomb");
          }
      }
  }
}

let mineCounter = bombs;

function updateMineCounter() {
    document.getElementById("mineCounter").innerText = mineCounter;
}

function updateBestTimes() {
    document.getElementById("bestTime-easy").innerText = `Easy: ${formatTime(bestTimes.easy)}`;
    document.getElementById("bestTime-normal").innerText = `Normal: ${formatTime(bestTimes.normal)}`;
    document.getElementById("bestTime-hard").innerText = `Hard: ${formatTime(bestTimes.hard)}`;
}

function getDifficulty() {
    if (sizeX === 9 && sizeY === 9 && bombs === 10) {
        return 'easy';
    } else if (sizeX === 16 && sizeY === 16 && bombs === 40) {
        return 'normal';
    } else if (sizeX === 30 && sizeY === 16 && bombs === 99) {
        return 'hard';
    }
    return 'unknown';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}