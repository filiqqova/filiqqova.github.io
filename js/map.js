let mapCourses;
let courses = [
    {
        name: "Local Language Club",
        address: "улица Тверская, 21, стр. 1, Moscow",
        hours: "Mon-Sut: 9 AM - 8 PM",
        contact: "-",
        description: "Offers conversation practice for all levels",
        category: "Language club",
        coordinates: [55.765522, 37.613242]
    },
    {
        name: "Russian Language Course Center",
        address: "Милютинский переулок, 22, Москва",
        hours: "Mon-Sun: 10 AM - 8 PM",
        contact: "+7 (495) 545-47-45",
        description: "Full courses for beginners to advanced students",
        category: "Russian language courses",
        coordinates: [55.765667, 37.632836]
    },
    {
        name: "Public Library with Russian Resources",
        address: "улица Аносова, 3к2, Moscow",
        hours: "Mon-Sat: 12 AM - 7 PM",
        contact: "+7 (495) 309-15-67",
        description: "A variety of Russian books and learning materials",
        category: "Libraries with Russian-language resources",
        coordinates: [55.743268, 37.755064]
    }
];


//создание карты
function createMap() 
{
    //устанавливаем точку центра и поиск по карте
    mapCourses = new ymaps.Map("map", {
        center: [55.752837, 37.623423],
        zoom: 12,
        controls: ['searchControl'] 
    });

    //настройка поиска по карте
    let searchControl = mapCourses.controls.get('searchControl');
    searchControl.options.set({
        provider: 'yandex#search', 
        placeholderContent: 'Address or place'
    });

    //добавление меток
    addPlacemark();

    //фильтрация
    addFilter();
}

//функция добавления меток
function addPlacemark() {

    let placemarks = []; // Инициализация массива для хранения меток
    //создаем содержимое меток
    courses.forEach(function (course) {
        let placemark = new ymaps.Placemark(course.coordinates, {
            balloonContentHeader: course.name,
            balloonContentBody: `
                <strong>Address:</strong> ${course.address} <br>
                <strong>Hours:</strong> ${course.hours} <br>
                <strong>Contact:</strong> ${course.contact} <br>
                <strong>Description:</strong> ${course.description}`
        });
        //фукнция для подсветки и центирования при нажитии на определенный ресурс
        placemark.events.add('click', function () {
            highlightCourse(course.name);
            mapCourses.setCenter(course.coordinates, 17); 
            
        });
        

        placemarks.push({ placemark, type: course.category }); //сохраняем метку и ее тип

        mapCourses.geoObjects.add(placemark);

        addCourseToList(course);
    });
}

//функция добавления всех ресурсов в лист
function addCourseToList(course) {
    let courseList = document.getElementById('info');
    let courseItem = document.createElement('div');

    courseItem.className = 'course-item';
    courseItem.innerHTML = `
        <h4>${course.name}</h4>
        <p><strong>Address:</strong> ${course.address}
        <p><strong>Hours:</strong> ${course.hours}
        <p><strong>Contact:</strong> ${course.contact}
        <p><strong>Description:</strong> ${course.description}
    `;

    courseItem.onclick = function () {
        highlightCourse(course.name);
        mapCourses.setCenter(course.coordinates, 17); 
    };

    courseList.appendChild(courseItem);
}

//хранение текущего выделенного курса
let highlightedCourse = null;

//функция для подсветки выбранного ресурса
function highlightCourse(name) { 
    let items = document.querySelectorAll('.course-item'); 
    
    items.forEach(function(item) { 
        item.classList.remove('highlight'); 

        if (item.querySelector('h4').innerText === name) { 
            item.classList.add('highlight'); 
            highlightedCourse = name; //сохраняем выделенный курс

            mapCourses.setCenter(courses.find(r => r.name === name).coordinates, 17);  
            mapCourses.geoObjects.each(function(placemark) { 
                if (placemark.properties.get('balloonContentHeader') === name) { 
                    placemark.balloon.open();  
                } else { 
                    placemark.balloon.close();  
                } 
            }); 
        } 
    }); 
}

//функция добавления фильтра
function addFilter() {
    let filterContainer = document.getElementById('filter');
    let filterSelect = document.createElement('select');

    const categories = [
        "All",
        "Language club",
        "Russian language courses",
        "Libraries with Russian-language resources",
        "Community centers",
        "Private language courses",
        "Language cafes or clubs"
    ];

    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });

    filterSelect.onchange = function() {
        filterCourses(filterSelect.value);
    };

    filterContainer.appendChild(filterSelect);
}

//функция фильтрации курсов
function filterCourses(selectedCategory) {
    mapCourses.geoObjects.removeAll(); 
    highlightedCourse = null; //сбрасываем выделенный курс при фильтрации

    courses.forEach(course => {
        if (selectedCategory === "All" || course.category === selectedCategory) {
            let placemark = new ymaps.Placemark(course.coordinates, {
                balloonContentHeader: course.name,
                balloonContentBody: `
                    <strong>Address:</strong> ${course.address} <br>
                    <strong>Hours:</strong> ${course.hours} <br>
                    <strong>Contact:</strong> ${course.contact} <br>
                    <strong>Description:</strong> ${course.description}`
            });

            placemark.events.add('click', function () {
                highlightCourse(course.name);
                mapCourses.setCenter(course.coordinates, 17);
            });

            mapCourses.geoObjects.add(placemark);
        }
    });
}

document.addEventListener('click', function(event) {
    let courseList = document.getElementById('info');
    if (!courseList.contains(event.target)) {
        //если кликнули вне списка, убираем подсветку
        highlightedCourse = null;
        document.querySelectorAll('.course-item').forEach(item => {
            item.classList.remove('highlight');
        });
    }
});

ymaps.ready(createMap); 
