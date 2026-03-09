// 1
function task1() {
    let sum = 0;
    let i = 1;
    while (i <= 50) {
        sum += i;
        i++;
    }
    console.log("завад 1: сума перших 50 чисел: ", sum);
}
task1();

// 2
function task2(n) {
    let factorial = 1;
    for (let i = 1; i <= n; i++) {
        factorial *= i;
    }
    console.log(`завд 2: факторіал числа ${n} =`, factorial);
}
task2(5); 

// 3
function task3(monthNumber) {
    let monthName;
    switch (monthNumber) {
        case 1: monthName = "Січень"; break;
        case 2: monthName = "Лютий"; break;
        case 3: monthName = "Березень"; break;
        case 4: monthName = "Квітень"; break;
        case 5: monthName = "Травень"; break;
        case 6: monthName = "Червень"; break;
        case 7: monthName = "Липень"; break;
        case 8: monthName = "Серпень"; break;
        case 9: monthName = "Вересень"; break;
        case 10: monthName = "Жовтень"; break;
        case 11: monthName = "Листопад"; break;
        case 12: monthName = "Грудень"; break;
        default: monthName = "Невірний номер місяця";
    }
    console.log(`завад 3: місяць ${monthNumber} це ${monthName}`);
}
task3(3);

// 4
function task4(arr) {
    let sum = 0;
    for (let num of arr) {
        if (num % 2 === 0) {
            sum += num;
        }
    }
    console.log("завд 4: сума парних чисел у масиві: ", sum);
}
task4([1, 2, 3, 4, 5, 6]);

// 5
const task5 = (str) => {
    const vowels = "аеєиіїоуюяАЕЄИІЇОУЮЯ";
    let count = 0;
    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count;
};
console.log("завд 5: кількість голосних у рядку: ", task5("привіт світ"));

// 6
function task6(base, exponent) {
    let result = Math.pow(base, exponent);
    console.log(`завд 6: ${base} у степені ${exponent}: `, result);
}
task6(2, 3);