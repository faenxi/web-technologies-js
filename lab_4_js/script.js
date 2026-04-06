// 1
function manageFruitsArray() {
    let fruits = ["лимон", "банан", "яблуко", "груша"];
    
    fruits.pop();
    console.log("завд1: без останнього:", fruits);

    fruits.unshift("ананас");
    fruits.sort().reverse();

    fruits.length = 0;
    
    let appleIndex = fruits.indexOf("яблуко");
    
    console.log("завд1: Оновлений масив фруктів:", fruits);
    return appleIndex;
}
const indexResult = manageFruitsArray();
console.log("завд1 (індекс яблука):", indexResult);

// 2
function processColorsArray() {
    let colors = ["червоний", "синій", "зелений", "темно-синій", "помаранчевий"];
    
    let longest = colors.reduce((a, b) => a.length > b.length ? a : b);
    let shortest = colors.reduce((a, b) => a.length < b.length ? a : b);
    
    let filteredColors = colors.filter(color => color.includes("синій"));
    
    let joinedString = filteredColors.join(", ");
    
    console.log(`завд2: Найдовший: ${longest}, Найкоротший: ${shortest}`);
    return joinedString; 
}
const colorsResult = processColorsArray();
console.log("завд2 (рядок):", colorsResult);

// 3
function manageEmployeesData() {
    let employees = [
        { name: "Оксана", age: 30, position: "дизайнер" },
        { name: "Антон", age: 25, position: "розробник" },
        { name: "Ігор", age: 45, position: "розробник" }
    ];

    employees.forEach((item) => {
        console.log(item.worker = true)
    })

    console.log(employees)
    
    
    employees.sort((a, b) => a.name.localeCompare(b.name));
    let developers = employees.filter(emp => emp.position === "розробник");
    //console.log("завд3 (тільки розробники):", developers);
   
    employees = employees.filter(emp => emp.age <= 40);
    
    employees.push({ name: "Поліна", age: 20, position: "менеджер" });
    
    return employees; 
}
console.log("завд3:", manageEmployeesData());

// 4
function manageStudentsData() {
    let students = [
        { name: "Олексій", age: 21, course: 4 },
        { name: "Марія", age: 18, course: 2 },
        { name: "Олег", age: 20, course: 3 }
    ];
    
    students = students.filter(s => s.name !== "Олексій");
    students.push({ name: "Дар'я", age: 17, course: 1 });
    
    students.sort((a, b) => b.age - a.age);
    
    let studentThirdCourse = students.filter(s => s.course === 3);
    
    console.log("завд4: Студент 3-го курсу:", studentThirdCourse);
    return students;
}
manageStudentsData();

// 5
function applyAdvancedArrayMethods() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    
    let squared = numbers.map(n => n * n);
    let evens = numbers.filter(n => n % 2 === 0);
    let totalSum = numbers.reduce((acc, curr) => acc + curr, 0);
    
    let extendedArray = [...numbers, 11, 12, 13, 14, 15];
    extendedArray.splice(0, 3); 
    
    return totalSum;
}
console.log("завд5:", applyAdvancedArrayMethods());

// 6
function libraryManagement() {
    let books = [
        { title: "Кобзар", author: "Шевченко", genre: "Поезія", pages: 300, isAvailable: true },
        { title: "1984", author: "Орвелл", genre: "Антиутопія", pages: 328, isAvailable: true }
    ];

    function addBook(title, author, genre, pages) {
        books.push({ title, author, genre, pages, isAvailable: true });
    }
    
    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }
    
    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }
    
    function toggleBookAvailability(title, isBorrowed) {
        let book = books.find(b => b.title === title);
        if (book) book.isAvailable = !isBorrowed;
    }
 
    function sortBooksByPages() {
        return books.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        let total = books.length;
        let available = books.filter(b => b.isAvailable).length;
        let borrowed = total - available;
        let avgPages = books.reduce((acc, b) => acc + b.pages, 0) / total;
        return { total, available, borrowed, avgPages };
    }

    addBook("Маруся Чурай", "Костенко", "Роман", 190);
    toggleBookAvailability("1984", true);
    console.log("Статистика бібліотеки:", getBooksStatistics());

    return books;
}
libraryManagement();


// 7
function updateStudentObject() {
    let student = {
        name: "Поліна",
        age: 20,
        course: 2
    };
    
    student.subjects = ["Програмування", "Бази даних", "Польска мова"];
    delete student.age;
    
    return student;
}
console.log("завд7 (об'єкт):", updateStudentObject());