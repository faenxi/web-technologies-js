const updateClock = () => {
    const now = new Date();
    
    const format = (num) => String(num).padStart(2, '0');

    document.getElementById('hours').textContent = format(now.getHours());
    document.getElementById('minutes').textContent = format(now.getMinutes());
    document.getElementById('seconds').textContent = format(now.getSeconds());
};

updateClock();
setInterval(updateClock, 1000);


let countdownInterval = null;

const startCountdown = () => {
    const targetValue = document.getElementById('timer-input').value;
    if (!targetValue) return alert('Оберіть дату!');

    if (countdownInterval) clearInterval(countdownInterval);

    const targetDate = new Date(targetValue);
    if (targetDate <= new Date()) return alert('Дата має бути у майбутньому!');

    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-display').textContent = 'Час вийшов!';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');
        document.getElementById('countdown-display').textContent = 
            `${pad(days)}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }, 1000);
};

const stopCountdown = () => {
    clearInterval(countdownInterval);
    document.getElementById('countdown-display').textContent = '00d 00:00:00';
};


const MONTH_NAMES = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const renderCalendar = () => {
    const input = document.getElementById('month-selector').value;
    if (!input) return;

    const [year, month] = input.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    
    let startOffset = firstDay.getDay(); 
    startOffset = startOffset === 0 ? 6 : startOffset - 1;

    const today = new Date();
    let html = `<h3>${MONTH_NAMES[month - 1]} ${year}</h3><table><tr>`;
    
    WEEKDAYS.forEach(day => html += `<th>${day}</th>`);
    html += '</tr><tr>';

    for (let i = 0; i < startOffset; i++) html += '<td></td>';

    let currentColumn = startOffset;
    for (let day = 1; day <= lastDay; day++) {
        const isToday = day === today.getDate() && 
                        (month - 1) === today.getMonth() && 
                        year === today.getFullYear();

        html += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
        currentColumn++;

        if (currentColumn === 7 && day < lastDay) {
            html += '</tr><tr>';
            currentColumn = 0;
        }
    }

    html += '</tr></table>';
    document.getElementById('calendar-container').innerHTML = html;
};

const initCalendar = () => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('month-selector').value = monthStr;
    renderCalendar();
};
initCalendar();


const calculateBirthday = () => {
    const input = document.getElementById('birth-date-input').value;
    if (!input) return alert('Оберіть дату народження!');

    const [bYear, bMonth, bDay] = input.split('-').map(Number);
    const now = new Date();
    
    let nextBirthday = new Date(now.getFullYear(), bMonth - 1, bDay);
    if (nextBirthday <= now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    const diff = nextBirthday - now;
    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minsLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const resultDiv = document.getElementById('birthday-result');
    resultDiv.innerHTML = `
        <strong>Наступний день народження:</strong> ${bDay} ${MONTH_NAMES[bMonth-1]}<br>
        Залишилось днів: <b>${daysLeft}</b><br>
        Точний час: ${hoursLeft}г ${minsLeft}хв
    `;
};