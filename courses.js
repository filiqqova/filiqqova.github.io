const API_KEY = "0c7d67da-8303-41b3-853b-d6fa91ed2736";
const COURSES_API_URL = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses?api_key=${API_KEY}`;
let coursesData = []; 
let currentPage = 1; 
const coursesPerPage = 3; 

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
function changePage(pageNumber) {
    currentPage = pageNumber;
    displayCourses();
    updateActivePage();
}

function updateActivePage() {
    const pageItems = document.querySelectorAll('#pagination .page-item');
    pageItems.forEach(item => {
        item.classList.remove('active'); 
    });
    pageItems[currentPage - 1].classList.add('active'); 
}

window.onload = loadCourses;

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
    } else {
        console.error('Course not found:', courseId);
    }
}