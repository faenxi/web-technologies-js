const titleElement = document.getElementById('main-title');
const buttonElement = document.getElementById('my-button');

titleElement.textContent = "Hello world!";

function showStudentName() {
    console.log("Бикова Поліна");
}

buttonElement.onclick = showStudentName;