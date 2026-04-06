const lights = {
    red: document.getElementById('light-red'),
    yellow: document.getElementById('light-yellow'),
    green: document.getElementById('light-green')
};
const desc = document.getElementById('state-desc');

let durations = { red: 5000, yellow: 2000, green: 6000 };
let activeTimer = null;
let stateIndex = 0;
const sequence = ['red', 'yellow', 'green', 'warning'];

const clearAllLights = () => {
    Object.values(lights).forEach(l => l.className = 'light ' + l.id.split('-')[1]);
};

const setLightState = (state) => {
    clearAllLights();
    switch(state) {
        case 'red':
            lights.red.classList.add('active');
            desc.textContent = 'СТОП';
            break;
        case 'yellow':
            lights.yellow.classList.add('active');
            desc.textContent = 'УВАГА';
            break;
        case 'green':
            lights.green.classList.add('active');
            desc.textContent = 'РУХ';
            break;
        case 'warning':
            lights.yellow.classList.add('active', 'blinking');
            desc.textContent = 'ПОПЕРЕДЖЕННЯ';
            break;
    }
};

const startTrafficCycle = () => {
    if (activeTimer) return;
    
    const runCycle = () => {
        stateIndex = 0;
        setLightState('red');
        activeTimer = setTimeout(() => {
            stateIndex = 1;
            setLightState('yellow');
            activeTimer = setTimeout(() => {
                stateIndex = 2;
                setLightState('green');
                activeTimer = setTimeout(() => {
                    stateIndex = 3;
                    setLightState('warning');
                    activeTimer = setTimeout(() => {
                        activeTimer = null;
                        runCycle();
                    }, 3000);
                }, durations.green);
            }, durations.yellow);
        }, durations.red);
    };
    runCycle();
};

const stopTrafficCycle = () => {
    clearTimeout(activeTimer);
    activeTimer = null;
    clearAllLights();
    desc.textContent = 'Світлофор вимкнено';
};

const stepNext = () => {
    stopTrafficCycle();
    stateIndex = (stateIndex + 1) % sequence.length;
    setLightState(sequence[stateIndex]);
};

const updateTimings = () => {
    durations.red = parseInt(document.getElementById('input-red').value) * 1000;
    durations.yellow = parseInt(document.getElementById('input-yellow').value) * 1000;
    durations.green = parseInt(document.getElementById('input-green').value) * 1000;
    alert('Час оновлено!');
};