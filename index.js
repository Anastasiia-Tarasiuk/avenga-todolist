const inputEl = document.querySelector('.input');
const addTaskButtonEl = document.querySelector('.addTaskButton');
const todoListEl = document.querySelector('.todoList');

const allTodosCounterEl = document.querySelector('.allTodosCounter');
const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');

addTaskButtonEl.addEventListener('click', onButtonClick);

let allTodosCounterValue = 0;
let incompletedTodosCounterValue = 0;
let completedTodosCounterValue = 0;

allTodosCounterEl.textContent = allTodosCounterValue;
completedTodosCounterEl.textContent = completedTodosCounterValue;
incompletedTodosCounterEl.textContent = incompletedTodosCounterValue;

function onButtonClick() {
    renderTodoItem();
    inputEl.value = "";
    allTodosCounterValue += 1; 
    // doesn't count????
    incompletedTodosCounterValue = allTodosCounterValue - completedTodosCounterValue;
    console.log(incompletedTodosCounterValue)
    allTodosCounterEl.innerHTML = `${allTodosCounterValue}`
}

function renderTodoItem() {
    todoListEl.insertAdjacentHTML('afterbegin', 
        `<li class="todoItem">
            <input class="CompleteItemButton" type="checkbox">
            <p class="todoItemText">${inputEl.value}</p>
            <button class="removeItemButton" type="button">Remove</button>
        </li>`
    )
    // localStorage.setItem('todos', JSON.stringify(todoItemEl));
}


