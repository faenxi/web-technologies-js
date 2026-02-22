const titleElement = document.getElementById('main-title');
const buttonElement = document.getElementById('my-button');

function showStudentName() {
    console.log("Бикова Поліна");
}

buttonElement.onclick = showStudentName;