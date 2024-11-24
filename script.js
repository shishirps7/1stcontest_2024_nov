// Global state for timers
let timers = [];
let timerIdCounter = 0;

// DOM Elements
const activeTimersContainer = document.getElementById('active-timers-container');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setTimerButton = document.getElementById('set-timer');
const timerAudio = document.getElementById('timer-audio');

// Helper function to format time
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}   :    ${String(minutes).padStart(2, '0')}    :    ${String(seconds).padStart(2, '0')}`;
}

// Create timer element
function createTimerElement(timerId, initialTime) {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card';
    timerCard.dataset.timerId = timerId;
    
    timerCard.innerHTML = `
        <div class="label-time-group">
            <span class="time-left-label">Time Left :</span>
            <span class="timer-display">${formatTime(initialTime)}</span>
            <button class="delete-button" onclick="deleteTimer(${timerId})">Delete</button>
        </div>
        
    `;
    
    return timerCard;
}

// Start new timer
function startNewTimer() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert('Please enter a valid time');
        return;
    }
    
    const timerId = timerIdCounter++;
    const timerElement = createTimerElement(timerId, totalSeconds);
    activeTimersContainer.appendChild(timerElement);
    
    const timer = {
        id: timerId,
        remainingSeconds: totalSeconds,
        element: timerElement,
        interval: setInterval(() => updateTimer(timerId), 1000)
    };
    
    timers.push(timer);
    
    // Reset inputs
    hoursInput.value = 'hh';
    minutesInput.value = 'mm';
    secondsInput.value = 'ss';
}

// Update timer
function updateTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;
    
    timer.remainingSeconds--;
    
    if (timer.remainingSeconds <= 0) {
        endTimer(timer);
    } else {
        const displayElement = timer.element.querySelector('.timer-display');
        displayElement.textContent = formatTime(timer.remainingSeconds);
    }
}

// End timer
function endTimer(timer) {
    clearInterval(timer.interval);
    timer.element.classList.add('ended');
    const displayElement = timer.element.querySelector('.timer-display');
    const deleteButton = timer.element.querySelector('.delete-button');
    displayElement.textContent = "Time's Up!";
    displayElement.style.color = " #2b2d42";
    deleteButton.textContent = "Stop";
    timerAudio.play();
}

// Delete timer
function deleteTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;
    
    clearInterval(timer.interval);
    timer.element.remove();
    timers = timers.filter(t => t.id !== timerId);
}

// Input validation
function validateTimeInput(input, max) {
    let value = parseInt(input.value) || 0;
    if (value < 0) value = 0;
    if (value > max) value = max;
    input.value = String(value).padStart(2, '0');
}

// Event listeners
setTimerButton.addEventListener('click', startNewTimer);

hoursInput.addEventListener('input', () => validateTimeInput(hoursInput, 99));
minutesInput.addEventListener('input', () => validateTimeInput(minutesInput, 59));
secondsInput.addEventListener('input', () => validateTimeInput(secondsInput, 59));

// Initialize default values
hoursInput.value = 'hh';
minutesInput.value = 'mm';
secondsInput.value = 'ss';