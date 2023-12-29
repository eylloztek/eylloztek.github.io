let isTimerActive = false;
let timerInterval;
let elapsedTime = 0;

const timerBox = document.getElementsByClassName("timer-box")[0];
const timer = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("bestTimes");

const easyBestTimeKey = 'easyBestTime';
const normalBestTimeKey = 'normalBestTime';
const hardBestTimeKey = 'hardBestTime';

function startTimer() {
    isTimerActive = true;
    timerBox.classList.remove("animation");
    let time = 0;
    timer.innerHTML = "0:00";
    const x = setInterval(function () {
        if (isTimerActive && !isGameOver) {
            time += 1;

            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) seconds = "0" + seconds;
            timer.innerHTML = minutes + ":" + seconds;
        } else {
            clearInterval(x);
        }
    }, 1000);
}

function stopTimer() {
    isTimerActive = false;
    clearInterval(timerInterval);
}

function updateBestTimesDisplay() {
    const bestTimes = getBestTimes();
    bestTimeDisplay.innerHTML = `
        <div>Easy: ${bestTimes.easy}</div>
        <div>Normal: ${bestTimes.normal}</div>
        <div>Hard: ${bestTimes.hard}</div>
    `;
}

function updateBestTimes(difficulty, newTime) {
    const bestTimeKey = `${difficulty}BestTime`;

    if (!localStorage.getItem(bestTimeKey) || newTime < localStorage.getItem(bestTimeKey)) {
        localStorage.setItem(bestTimeKey, newTime);
        updateBestTimesDisplay();
    }
}

function getBestTimes() {
    const easyBestTime = localStorage.getItem(easyBestTimeKey) || '--:--';
    const normalBestTime = localStorage.getItem(normalBestTimeKey) || '--:--';
    const hardBestTime = localStorage.getItem(hardBestTimeKey) || '--:--';

    return {
        easy: easyBestTime,
        normal: normalBestTime,
        hard: hardBestTime
    };
}

function resetTimer() {
    isTimerActive = false;
    elapsedTime = 0;
    timer.innerHTML = "0:00";
    clearInterval(timerInterval);
}
