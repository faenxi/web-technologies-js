//1

function findMinMax(numbers) {
    let min = Math.min(...numbers);
    let max = Math.max(...numbers);
    console.log("1.1:", numbers);
    console.log("мінімальне:", min, " максимальне:", max);
}
findMinMax([10, 5, 22, 1, 33]);

const student1 = { name: "вася", score: 5 };
const student2 = { name: "пєтя", score: 3 };

console.log("1.2: чи бал васі більший?");
console.log(student1.score > student2.score);


//2

function checkRange(num) {
    const isInRange = num >= 3 && num <= 67;
    console.log(`2.1: число ${num} в діапазоне 3-67?`, isInRange);
}
checkRange(25);

let isPCOn = true;
console.log("2.2: пк включений?", isPCOn);
isPCOn = !isPCOn;
console.log("після(!):", isPCOn);


//3

function getGrade(score) {
    let result;
    if (score >= 90) result = "відмінно";
    else if (score >= 80) result = "добре";
    else if (score >= 60) result = "задовільно";
    else result = "незадовільно";
    
    console.log(`3.1: оцінка ${score}: ${result}`);
}
getGrade(80);

function getSeason(month) {
    let seasonIf;
    if (month === 12 || month <= 2) seasonIf = "зима";
    else if (month <= 5) seasonIf = "весна";
    else if (month <= 8) seasonIf = "літо";
    else seasonIf = "осінь";

    console.log(`3.2 (місяць ${month}): використаня if: ${seasonIf}`);

    let seasonTernary = (month === 12 || month <= 2) ? "зима" :
                        (month <= 5) ? "весна" :
                        (month <= 8) ? "літо" : "осінь";

    console.log(`3.3 використаня "?": ${seasonTernary}`)
}
getSeason(12); 