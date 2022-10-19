const inputEl = document.querySelector('.input');
const addTaskButtonEl = document.querySelector('.addTaskButton');
const todoListEl = document.querySelector('.todoList');

const allTodosCounterEl = document.querySelector('.allTodosCounter');
const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');

addTaskButtonEl.addEventListener('click', onButtonClick);

let allTodosCounterValue = 0;
let completedTodosCounterValue = 0;
let incompletedTodosCounterValue = 0;

allTodosCounterEl.textContent = allTodosCounterValue;
completedTodosCounterEl.textContent = completedTodosCounterValue;
incompletedTodosCounterEl.textContent = incompletedTodosCounterValue;

function onButtonClick() {
    renderTodoItem();
    inputEl.value = "";
    allTodosCounterValue += 1; 
    allTodosCounterEl.innerHTML = `${allTodosCounterValue}`
}

function renderTodoItem() {
    const todoItemEl = document.createElement('li');
    todoItemEl.classList.add('todoItem');

    const todoItemTextEl = document.createElement('p');
    todoItemTextEl.classList.add('todoItemText');
    todoItemTextEl.textContent = inputEl.value;

    const removeItemButtontEl = document.createElement('button');
    removeItemButtontEl.classList.add('removeItemButton');
    removeItemButtontEl.setAttribute('type', 'button');
    removeItemButtontEl.textContent = 'remove';

    const completeItemCheckBoxtEl = document.createElement('input');
    completeItemCheckBoxtEl.classList.add('CompleteItemButton');
    completeItemCheckBoxtEl.setAttribute('type', 'checkbox');
    
    todoItemEl.appendChild(completeItemCheckBoxtEl);
    todoItemEl.appendChild(todoItemTextEl);
    todoItemEl.appendChild(removeItemButtontEl);

    todoListEl.prepend(todoItemEl);

    // localStorage.setItem('todos', JSON.stringify(todoItemEl));
}
