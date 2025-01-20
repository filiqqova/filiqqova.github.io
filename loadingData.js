const API_KEY = "0c7d67da-8303-41b3-853b-d6fa91ed2736";
const COURSES_API_URL = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses?api_key=${API_KEY}`;
let coursesData = []; 
let currentPage = 1; 
const coursesPerPage = 3; 

const TUTORS_API_URL = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/tutors?api_key=${API_KEY}`;
let tutorsData = []; 

//загрузка данных с апи для курсов
async function loadCourses() {
    try {
        const response = await fetch(COURSES_API_URL);
        coursesData = await response.json();
        displayCourses();
        setupPagination();
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

//функция отображения курсов 
function displayCourses() {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = ''; 

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const coursesToDisplay = coursesData.slice(startIndex, endIndex);

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-4 mb-4';
        courseCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#courseModal" onclick="showCourseDetails(${course.id})">More details</button>
                </div>
            </div>
        `;
        coursesContainer.appendChild(courseCard);
    });
}

//пагинация страниц для курсов
function setupPagination() {
    const paginationContainer = document.querySelector('#pagination ul');
    paginationContainer.innerHTML = ''; 

    const totalPages = Math.ceil(coursesData.length / coursesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        
        if (i === currentPage) {
            pageItem.classList.add('active');
        }

        pageItem.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        paginationContainer.appendChild(pageItem);
    }
}

//изменение страницы
function changePage(pageNumber) {
    currentPage = pageNumber;
    displayCourses();
    updateActivePage();
}

// обновление активной страницы
function updateActivePage() {
    const pageItems = document.querySelectorAll('#pagination .page-item');
    pageItems.forEach(item => {
        item.classList.remove('active'); 
    });
    pageItems[currentPage - 1].classList.add('active'); 
}

//функция для доп инфы по курсам
function showCourseDetails(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    
    if (course) {
        document.getElementById('courseTitle').innerText = course.name;
        document.getElementById('courseDescription').innerText = course.description;
        document.getElementById('courseTeacher').innerText = course.teacher;
        document.getElementById('courseLevel').innerText = course.level;
        document.getElementById('courseDuration').innerText = course.total_length;
        document.getElementById('courseHoursPerWeek').innerText = course.week_length;
        document.getElementById('courseFeePerHour').innerText = course.course_fee_per_hour;
        
        const existingAddButton = document.getElementById('addButton');
        if (existingAddButton) {
            existingAddButton.remove();
        }

        const addButton = document.createElement('button');
        addButton.innerText = 'Add';
        addButton.id = 'addButton'; 
        addButton.onclick = () => openCourseRequestForm(course.name);

        const courseModalBody = document.getElementById('courseModalBody'); 
        courseModalBody.appendChild(addButton);
    } else {
        console.error('Course not found:', courseId);
    }
}

//загрузка данных с апи для тьюторов
async function loadTutors() {
    try {
        const response = await fetch(TUTORS_API_URL);
        tutorsData = await response.json();
        displayTutors();
    } catch (error) {
        console.error('Error loading tutors:', error);
    }
}

//отображение тьюторов
function displayTutors() {
    const tutorsContainer = document.getElementById('tutors-container');
    tutorsContainer.innerHTML = ''; 

    const tutorsToDisplay = tutorsData;

    tutorsToDisplay.forEach(tutor => {
        const tutorCard = document.createElement('div');
        tutorCard.className = 'col-md-3 mb-6';
        tutorCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${tutor.name}</h5>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tutorModal" onclick="showTutorDetails(${tutor.id})">More details</button>
                </div>
            </div>
        `;
        tutorsContainer.appendChild(tutorCard);
    });
}

//функция для доп инфы по тьюторам
function showTutorDetails(tutorId) {
    const tutor = tutorsData.find(c => c.id === tutorId);
    
    if (tutor) {
        document.getElementById('tutorName').innerText = tutor.name;
        document.getElementById('tutorExperience').innerText = tutor.work_experience;
        document.getElementById('tutorLangSpoken').innerText = tutor.languages_spoken;
        document.getElementById('tutorLangOffered').innerText = tutor.languages_offered;
        document.getElementById('tutorLangLevel').innerText = tutor.language_level;
        document.getElementById('tutorPricePerHour').innerText = tutor.price_per_hour;
        
        const existingAddButton = document.getElementById('addButton');
        if (existingAddButton) {
            existingAddButton.remove();
        }

        const addButton = document.createElement('button');
        addButton.innerText = 'Add';
        addButton.id = 'addButton';
        addButton.onclick = () => openTutorRequestForm(tutor.name);

        const tutorModalBody = document.getElementById('tutorModalBody'); 
        tutorModalBody.appendChild(addButton);
    } else {
        console.error('Tutor not found:', tutorId);
    }
}

//функция для открытия формы по курсам
function openCourseRequestForm(courseName = "") {
    document.getElementById('courseName').value = courseName;
    document.getElementById('courseRequestForm').style.display = 'block';
    document.getElementById('tutorRequestForm').style.display = 'none'; 
}

//функция для открытия формы по тьюторам
function openTutorRequestForm(tutorsName = "") {
    document.getElementById('tutorsName').value = tutorsName;
    document.getElementById('tutorRequestForm').style.display = 'block';
    document.getElementById('courseRequestForm').style.display = 'none'; 
}

loadCourses();
loadTutors();


//обработчик для курсов
document.addEventListener('DOMContentLoaded', () => {
    const COURSES_API_URL = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses';
    
    const tableCourse = document.querySelector('#courses-table tbody');

    //загрузка из апи
    const fetchCourses = async () => {
        try {
            const response = await fetch(`${COURSES_API_URL}?api_key=${API_KEY}`);
            if (!response.ok) throw new Error('Failed to fetch courses');

            const courses = await response.json();
            filterAndUpdateCourses(courses);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //фильтрация курсов
    const filterAndUpdateCourses = (courses) => {
        const nameFilter = document.getElementById('course-name').value.toLowerCase();
        const levelFilter = document.getElementById('course-level').value;

        const filteredCourses = courses.filter(course => {
            const matchesName = course.name.toLowerCase().includes(nameFilter);
            const matchesLevel = levelFilter === '' || course.level === levelFilter;
            return matchesName && matchesLevel;
        });

        updateCoursesTable(filteredCourses);
    };

    //отфильтроранная таблица курсов
    const updateCoursesTable = (courses) => {
        tableCourse.innerHTML = '';

        courses.forEach(course => {
            const row = `
                <tr>
                    <td>${course.name}</td>
                    <td>${course.level}</td>
                    <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#courseModal" onclick="showCourseDetails(${course.id})">More details</button></td>
                </tr>
            `;
            tableCourse.insertAdjacentHTML('beforeend', row);
        });

        if (courses.length === 0) {
            tableCourse.innerHTML = '<tr><td colspan="5" class="text-center">No courses found</td></tr>';
            return;
        }
    };

    document.getElementById('course-name').addEventListener('input', fetchCourses);
    document.getElementById('course-level').addEventListener('change', fetchCourses);
    
    fetchCourses();
});


//обработчик для тьюторов
document.addEventListener("DOMContentLoaded", function () {
    const TUTORS_API_URL = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/tutors';
    const API_KEY = "0c7d67da-8303-41b3-853b-d6fa91ed2736";
    
    const tableTutor = document.querySelector('#tutors-table tbody');

    //данные с апи
    const fetchTutors = async () => {
        try {
            const response = await fetch(`${TUTORS_API_URL}?api_key=${API_KEY}`);
            if (!response.ok) throw new Error('Failed to fetch tutors');
            const tutors = await response.json();
            filterTutors(tutors);
        } catch (error) {
            console.error(error);
            tableTutor.innerHTML = '<tr><td colspan="6" class="text-danger text-center">Error loading tutors</td></tr>';
        }
    };
    
    // фильтрация тьюторов
    const filterTutors = (tutors) => {
        const nameFilter = document.getElementById('tutor-name').value.toLowerCase();
        const levelFilter = document.getElementById('language-level').value;
        const languageFilter = document.getElementById('language-offered').value;
        const experienceFilter = parseInt(document.getElementById('tutor-experience').value);
    
        const filteredTutors = tutors.filter(tutor => {
            const matchesName = !nameFilter || tutor.name.toLowerCase().includes(nameFilter);
            const matchesLevel = !levelFilter || tutor.language_level === levelFilter;
            const matchesLanguage = !languageFilter || tutor.languages_offered.includes(languageFilter);
            const matchesExperience = !experienceFilter || tutor.work_experience === experienceFilter;
            
            return matchesName && matchesLevel && matchesLanguage && matchesExperience;
        });
    
        updateTutorsTable(filteredTutors);
    };
    
    //Отфильтрованная таблица
    const updateTutorsTable = (tutors) => {
        tableTutor.innerHTML = '';
    
        tutors.forEach(tutor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tutor.name}</td>
                <td>${tutor.language_level}</td>
                <td>${tutor.languages_spoken.join(', ')}</td>
                <td>${tutor.work_experience}</td>
                <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tutorModal" onclick="showTutorDetails(${tutor.id})">More details</button></td>
            `;
            tableTutor.appendChild(row);
        });

        if (!tutors.length) {
            tableTutor.innerHTML = '<tr><td colspan="6" class="text-center">No tutors found</td></tr>';
            return;
        }
    };
    
    
    //добавление обработчиков для фильтров
    document.getElementById('tutor-name').addEventListener('input', fetchTutors);
    document.getElementById('language-level').addEventListener('change', fetchTutors);
    document.getElementById('language-offered').addEventListener('change', fetchTutors);
    document.getElementById('tutor-experience').addEventListener('input', fetchTutors);

    fetchTutors();
});


