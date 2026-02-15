document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const bgMusic = document.getElementById('bg-music');

    let timerInterval;
    let isTimerRunning = false;
    const initialTime = 5 * 60; // 5 minutes
    let timeLeft = initialTime;
    let audioFadeInterval;

    // --- Audio Logic (Fade In/Out) ---
    function fadeInAudio() {
        clearInterval(audioFadeInterval);
        bgMusic.volume = 0;
        bgMusic.play().catch(e => console.log("Audio play failed:", e));

        audioFadeInterval = setInterval(() => {
            if (bgMusic.volume < 0.5) { // Max volume 0.5
                bgMusic.volume = Math.min(0.5, bgMusic.volume + 0.05);
            } else {
                clearInterval(audioFadeInterval);
            }
        }, 200); // Increase every 200ms
    }

    function fadeOutAudio(shouldPause = true) {
        clearInterval(audioFadeInterval);

        audioFadeInterval = setInterval(() => {
            if (bgMusic.volume > 0.05) {
                bgMusic.volume = Math.max(0, bgMusic.volume - 0.05);
            } else {
                clearInterval(audioFadeInterval);
                bgMusic.volume = 0;
                if (shouldPause) bgMusic.pause();
            }
        }, 200); // Decrease every 200ms
    }

    // --- Theme Logic ---
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        // Optional: Save preference to localStorage
    });

    // --- Timer Logic ---
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            // PAUSE
            clearInterval(timerInterval);
            isTimerRunning = false;
            startBtn.textContent = 'Start';
            fadeOutAudio(); // Fade out audio on pause
        } else {
            // START
            if (timeLeft === 0) timeLeft = initialTime;

            isTimerRunning = true;
            startBtn.textContent = 'Pause';
            fadeInAudio(); // Fade in audio on start

            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    // TIMER FINISHED
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    startBtn.textContent = 'Start';
                    fadeOutAudio(); // Fade out audio
                    timeLeft = initialTime;
                    updateTimerDisplay();
                }
            }, 1000);
        }
    });

    // --- Reset Logic ---
    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startBtn.textContent = 'Start';
        timeLeft = initialTime;
        updateTimerDisplay();

        // Stop audio immediately or fade out (Request said: "music stops" - let's fade out to be polite)
        fadeOutAudio(true);
        // Reset audio track to beginning
        setTimeout(() => { bgMusic.currentTime = 0; }, 1000); // Wait for fade out to likely finish/start
    });

    // Initialize
    updateTimerDisplay();
});
