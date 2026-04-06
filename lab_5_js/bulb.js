const bulbImage = document.getElementById('bulb-image');
const statusText = document.getElementById('status');
const typeSelector = document.getElementById('bulb-type-selector');
const timerDisplay = document.getElementById('timer-display');

const BULB_IMAGES = {
    standard: { off: 'bulb_standard_off.png', on: 'bulb_standard_on.png' },
    energy: { off: 'bulb_energy_off.png', on: 'bulb_energy_on.png' },
    led: { off: 'bulb_led_off.png', on: 'bulb_led_on.png' }
};

let isPowered = false;
let offTimer = null;

function turnOn() {
    if (isPowered) return;
    isPowered = true;
    const type = typeSelector.value;
    bulbImage.src = BULB_IMAGES[type].on;
    //bulbImage.classList.add('active');
    statusText.textContent = "Статус: Увімкнено";
    
    offTimer = setTimeout(() => {
        turnOff();
        timerDisplay.textContent = "Вимкнено автоматично через бездіяльність";
    }, 300000);
}

function turnOff() {
    isPowered = false;
    const type = typeSelector.value;
    bulbImage.src = BULB_IMAGES[type].off;
    //bulbImage.classList.remove('active');
    bulbImage.style.opacity = '1';
    statusText.textContent = "Статус: Вимкнено";
    clearTimeout(offTimer);
    timerDisplay.textContent = "";
}

function handleTypeChange() {
    if (isPowered) turnOff();
    else bulbImage.src = BULB_IMAGES[typeSelector.value].off;
}

function adjustBrightness() {
    if (typeSelector.value === 'standard') {
        alert("Цей тип не підтримує яскравість!");
        return;
    }
    if (!isPowered) return alert("Спочатку увімкніть лампу!");
    
    const level = prompt("Введіть яскравість (1-100):");
    if (level >= 1 && level <= 100) {
        bulbImage.style.opacity = level / 100;
        statusText.textContent = `Статус: Увімкнено (${level}%)`;
    }
}