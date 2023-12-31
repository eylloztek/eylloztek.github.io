let isTimerActive = false;
let timerInterval;
let elapsedTime = 0;

const timerBox = document.getElementsByClassName("timer-box")[0];
const timer = document.getElementById("timer");

function startTimer() {
    isTimerActive = true;
    timerBox.classList.remove("animation");
    elapsedTime = 0;
    timer.innerHTML = "0:00";
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        if (isTimerActive) {
            elapsedTime += 1;

            let minutes = Math.floor(elapsedTime / 60);
            let seconds = elapsedTime % 60;
            if (seconds < 10)
                seconds = "0" + seconds;
            timer.innerHTML = minutes + ":" + seconds;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function stopTimer() {
    isTimerActive = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    isTimerActive = false;
    elapsedTime = 0;
    timer.innerHTML = "0:00";
    clearInterval(timerInterval);
}

function getElapsedTime() {
    return elapsedTime;
}
