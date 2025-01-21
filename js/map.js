let mapCourses;
let courses = [
    {
        name: "Local Language Club",
        address: "улица Тверская, 21, стр. 1, Moscow",
        hours: "Mon-Sut: 9 AM - 8 PM",
        contact: "-",
        description: "Offers conversation practice for all levels",
        category: "Языковой клуб",
        coordinates: [55.765522, 37.613242]
    },
    {
        name: "Russian Language Course Center",
        address: "Милютинский переулок, 22, Москва",
        hours: "Mon-Sun: 10 AM - 8 PM",
        contact: "+7 (495) 545-47-45",
        description: "Full courses for beginners to advanced students",
        category: "Курсы русского языка",
        coordinates: [55.765667, 37.632836]
    },
    {
        name: "Public Library with Russian Resources",
        address: "улица Аносова, 3к2, Moscow",
        hours: "Mon-Sat: 12 AM - 7 PM",
        contact: "+7 (495) 309-15-67",
        description: "A variety of Russian books and learning materials",
        category: "Библиотеки с русскоязычными ресурсами",
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
}

//функция добавления меток
function addPlacemark() {
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
            mapCourses.setCenter(course.coordinates, 12); 
        });

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
        <p><strong>Address:</strong> ${course.address}</p>
        <p><strong>Hours:</strong> ${course.hours}</p>
        <p><strong>Contact:</strong> ${course.contact}</p>
        <p><strong>Description:</strong> ${course.description}</p>
    `;

    courseItem.onclick = function () {
        highlightCourse(course.name);
        mapCourses.setCenter(course.coordinates, 15); 
    };

    courseList.appendChild(courseItem);
}

//функция для подсветки выбранного ресурса
function highlightCourse(name) { 
    let items = document.querySelectorAll('.course-item'); 
     
    items.forEach(function(item) { 
        item.classList.remove('highlight'); 

        if (item.querySelector('h4').innerText === name) { 
            item.classList.add('highlight'); 

            mapCourses.setCenter(courses.find(r => r.name === name).coordinates, 15);  
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

ymaps.ready(createMap); 