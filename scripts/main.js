const activeClass = document.querySelector('.myTasksBtn')
activeClass.classList.add('active')

// my tasks button
const myTasksBtn = document.querySelector('.myTasksBtn')
// my completed tasks button
const completedTasksBtn = document.querySelector('.completedTasksBtn')
// add tasks input
const addTaskInputBox = document.querySelector('.taskInput')
// add task input Btn
const addTaskBtn = document.querySelector('.addTaskBtn')
// tasks Container
const tasksContainer = document.querySelector('.tasksContainer')
// modalContainer
const modalContainer = document.getElementById('modal')
// alert message
const alertMsg = document.querySelector('.alertMsg')

// array to hold tasks
let todos =  JSON.parse(localStorage.getItem('todos')) || [];

// initial render
renderTodos()

addTaskBtn.addEventListener('click', () => {
    addInput()
})

completedTasksBtn.addEventListener('click', () => {
    renderCompletedTodos()
})
myTasksBtn.addEventListener('click', () => {
    renderTodos()
})

addTaskInputBox.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        addInput()
    }
})

function addInput(){
    let newTodo = addTaskInputBox.value.trim()
    console.log(newTodo)
    if(!newTodo){
        renderAlert('empty')
    } else if(checkSimilarity(newTodo)){
        renderAlert('same')
    } else {
        todos.push({
            todo: newTodo,
            todoStatus: 'incomplete'
        })
        renderAlert('success')
        renderTodos()
    }

    addTaskInputBox.value = ''
}

// function to render Alert msg when adding input
function renderAlert(alertType) {
    alertMsg.innerHTML = ''
    alertMsg.classList.add('show')

    if(alertType === 'empty'){
        alertMsg.style.background = 'rgba(184,59,59,0.5)'
        alertMsg.innerHTML = `
            <div class = "alertText">
                <p>Please enter a task!</p>
            </div>
        `
    }
    if(alertType === 'same'){
        alertMsg.style.background = 'rgba(184,59,59,0.5)'
        alertMsg.innerHTML = `
            <div class = "alertText">
                <p>This task is already a pending task. Please add a new task.</p>
            </div>
        `
    }
    if(alertType === 'success'){
        alertMsg.style.background = 'rgba(24,204,39,0.5)'
        alertMsg.innerHTML = `
            <div class = "alertText">
                <p>Task successfully added</p>
            </div>
        `
    }

    setTimeout(() => {
        alertMsg.classList.remove('show')
    }, 3000)
}

// function to check similarity when adding new task
function checkSimilarity(newTodo) {
    let isSame = false
    todos.forEach((todo) => {
        if(newTodo === todo.todo){
            isSame = true
        }
    })
    return isSame
}

// function to render tasks
function renderTodos(){
    // create array to hold incomplete todos for rendering
    let incompleteTodos = todos.filter((todo) => {
        return todo.todoStatus === 'incomplete'
    })

    // render array
    tasksContainer.innerHTML = incompleteTodos.length ?
    incompleteTodos.map((todo, index) => `
        <div class="taskCard">
            <div class="textContainer">
                <p class="cardTitle">${todo.todo}</p>
                <p class="cardStatus">${todo.todoStatus}</p>
            </div>
            <div class="cardBtns">
                <button class="cardBtn cardDoneBtn" data-index="${index}">Done</button>
                <button class="cardBtn cardEditBtn" data-index="${index}">Edit</button>
                <button class="cardBtn cardDeleteBtn" data-index="${index}">Delete</button>
            </div>
        </div>`).join('') 
        :`<p class="emptyTaskList">There have been no new tasks added.</p>`

    // save new todos to local storage
    localStorage.setItem('todos', JSON.stringify(todos));

    // button event listeners
    document.querySelectorAll('.cardDeleteBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            deleteTodo(btn.dataset.index)
        })
    })
    document.querySelectorAll('.cardDoneBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            completedTodo(btn.dataset.index)
            console.log(todos[btn.dataset.index])
        })
    })
    

}

// function to delete todo and rerender the section
function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function completedTodo(index){
    console.log(todos[index])
    todos[index].todoStatus = 'complete'
    renderTodos()
}

function renderCompletedTodos() {
    // create array to hold completed todos for rendering
    let completeTodos = todos.filter((todo) => {
        return todo.todoStatus === 'complete'
    })

    tasksContainer.innerHTML = completeTodos.length ?
    completeTodos.map((todo) => `
        <div class="taskCard">
            <div class="textContainer">
                <p class="cardTitle">${todo.todo}</p>
                <p class="cardStatus">${todo.taskStatus}</p>
            </div>
        </div>
    `).join('') 
    : `<p class="emptyTaskList">There have been no completed tasks.</p>`
}