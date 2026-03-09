/* ==========================================================================
   TO-DO LIST FUNCTIONALITY
   ========================================================================== */

// 1. Element Selectors
const inputField = document.querySelector('#input');
const addBtn = document.querySelector('#add-btn');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const taskCount = document.querySelector('#task-count');
const errorMsg = document.querySelector('#error-msg');
const clearAllBtn = document.querySelector('#clear-completed');

// 2. Load Tasks from LocalStorage on Startup
document.addEventListener('DOMContentLoaded', getTasks);

// 3. Event Listeners
addBtn.addEventListener('click', addTask);

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearAllBtn.addEventListener('click', clearAllTasks);

// --------------------------------------------------------------------------
// Functions
// --------------------------------------------------------------------------

function addTask() {
    const taskValue = inputField.value.trim();

    // Validation
    if (taskValue === "") {
        showError();
        return;
    }

    // Create Task Object
    const taskObj = {
        id: Date.now(),
        text: taskValue,
        completed: false
    };

    createTaskElement(taskObj);
    saveLocalTasks(taskObj);
    
    inputField.value = "";
    checkEmptyState();
    updateCounter();
}

function createTaskElement(task) {
    // Create main div
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    if (task.completed) taskDiv.classList.add('completed');
    taskDiv.setAttribute('data-id', task.id);

    // Task Content (Text)
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('task-content');
    contentDiv.innerHTML = `<span class="task-text">${task.text}</span>`;
    
    // Toggle completion on click
    contentDiv.addEventListener('click', () => {
        taskDiv.classList.toggle('completed');
        updateLocalStatus(task.id);
    });

    // Actions (Delete Button)
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('task-actions');

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => removeTask(taskDiv, task.id);

    actionsDiv.appendChild(deleteBtn);
    taskDiv.appendChild(contentDiv);
    taskDiv.appendChild(actionsDiv);

    // Append to List
    taskList.appendChild(taskDiv);
}

function removeTask(element, id) {
    // Add the CSS animation class we defined earlier
    element.classList.add('removing');
    
    // Wait for animation to finish before removing from DOM
    element.addEventListener('transitionend', () => {
        element.remove();
        removeLocalTasks(id);
        checkEmptyState();
        updateCounter();
    });
}

function showError() {
    inputField.classList.add('input-error');
    errorMsg.classList.remove('is-hidden');
    
    setTimeout(() => {
        inputField.classList.remove('input-error');
        errorMsg.classList.add('is-hidden');
    }, 2000);
}

function checkEmptyState() {
    const tasks = taskList.querySelectorAll('.task-item');
    emptyState.style.display = tasks.length > 0 ? 'none' : 'block';
}

function updateCounter() {
    const tasks = taskList.querySelectorAll('.task-item').length;
    taskCount.innerText = `${tasks} Task${tasks === 1 ? '' : 's'} Remaining`;
}

function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = "";
        localStorage.clear();
        checkEmptyState();
        updateCounter();
    }
}

// --------------------------------------------------------------------------
// Local Storage Logic
// --------------------------------------------------------------------------

function saveLocalTasks(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => createTaskElement(task));
    checkEmptyState();
    updateCounter();
}

function removeLocalTasks(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

function updateLocalStatus(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        if (task.id === id) task.completed = !task.completed;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}