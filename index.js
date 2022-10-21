const inputEl = document.querySelector('.input');
const addTaskButtonEl = document.querySelector('.addTaskButton');

const todoListEl = document.querySelector('.todoList');
const completedTodoListEl = document.querySelector('.completedTodoList');
const incompletedTodoListEl = document.querySelector('.incompletedTodoList');

const allTodosCounterEl = document.querySelector('.allTodosCounter');
const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');

addTaskButtonEl.addEventListener('click', onButtonClick);

const todoItemTemplate = `
<li class="todoItem">
<input class="completeItemButton" type="checkbox">
<p class="todoItemText"></p>
<button class="removeItemButton" type="button">Remove</button>
</li>`

let todoItemArray = [];
// зайві 2
let todoCompletedItemArray = [];
let todoIncompletedItemArray = [];


let allTodosCounterValue = 0;
let completedTodosCounterValue = 0;
let incompletedTodosCounterValue = 0;

updateTodoCounter();
    
const todoItemEls = todoListEl.querySelectorAll('.todoItem');
const completedTodoItemEls = completedTodoListEl.querySelectorAll('.todoItem');


todoListEl.addEventListener('click', itemActions); 
completedTodoListEl.addEventListener('click', itemActions);
    
function onButtonClick() {
    createTodoItem();
    updateTodoCounter();

    inputEl.value = "";
}
    
function createTodoItem() {
    todoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);
    incompletedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);
    
    let todoItemTextEl = todoListEl.querySelector('.todoItemText');
    todoItemTextEl.textContent = inputEl.value;
    todoItemTextEl = incompletedTodoListEl.querySelector('.todoItemText');
    todoItemTextEl.textContent = inputEl.value;

    const dataIndex = Math.random().toString(36).slice(-6);
    let todoItemEl = todoListEl.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', dataIndex);
    todoItemEl = incompletedTodoListEl.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', dataIndex);
    
    const item = {
        "id": todoItemEl.getAttribute('data-index'),
        "item": inputEl.value,
        "isDone": false,
    }
    
    todoItemArray.push(item);

    todoIncompletedItemArray.push(item);
}

function updateTodoCounter() {

    allTodosCounterValue = todoItemArray.length;
    completedTodosCounterValue = todoCompletedItemArray.length;
    incompletedTodosCounterValue = allTodosCounterValue - completedTodosCounterValue; 

    allTodosCounterEl.textContent = allTodosCounterValue;
    completedTodosCounterEl.textContent = completedTodosCounterValue;
    incompletedTodosCounterEl.textContent = incompletedTodosCounterValue;
}


function itemActions(e) {
    const element = e.target;
    const item = element.closest('li');
    const checkbox = element.closest('input');
    const itemDataIndex = item.getAttribute('data-index');

    const currentListClassName = element.parentElement.parentElement.className;
    let currentArray = null;
    let elementToDoAction = null;

    if (currentListClassName === 'todoList') {
        currentArray = todoItemArray;
        elementToDoAction = todoListEl;
    }

    if (currentListClassName === 'completedTodoList') {
        currentArray = todoCompletedItemArray;
        elementToDoAction = completedTodoListEl;
    }

    if (currentListClassName === 'incompletedTodoList') {
        currentArray = todoIncompletedItemArray;
        elementToDoAction = incompletedTodoListEl;
    }

    // ------------
        
    if (element.className === "removeItemButton") {
        removeItem(itemDataIndex, currentArray, elementToDoAction);
    }
    
    if (element.className === "completeItemButton") {
        if (checkbox.checked) {
            todoItemArray.map(el => {

                if (el.id === item.getAttribute('data-index')) {
                    el.isDone = true;
                }
            })
            setItemCompleted(item);
            removeItem(itemDataIndex, todoIncompletedItemArray, incompletedTodoListEl);
        } else {
            unsetItemCompleted(checkbox);
            removeItem(itemDataIndex, todoCompletedItemArray, completedTodoListEl);
        }
    }
}

function removeItem(id, array, element) {
    array = array.filter(item => {
        return item.id !== id;
    });
    removeFormDom(id, element);
    updateTodoCounter();
}

function setItemCompleted(element) {

    const item = {
        "id": element.getAttribute('data-index'),
        "item": element.querySelector('.todoItemText').textContent,
        "isDone": true,
    }

    todoCompletedItemArray.push(item);
    renderCompletedItems(element);
}

function unsetItemCompleted(checkbox) {
    checkbox.removeAttribute('checked');
    
}

function renderCompletedItems(element) {
    completedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);

    const todoItemEl = completedTodoListEl.querySelector('.todoItem');
    const todoItemTextEl = completedTodoListEl.querySelector('.todoItemText');
    const completeItemButtonEl = completedTodoListEl.querySelector('.completeItemButton');
    todoItemEl.setAttribute('data-index', element.getAttribute('data-index'));
    todoItemTextEl.textContent = element.querySelector('p').textContent;
    completeItemButtonEl.setAttribute('checked', '');

    updateTodoCounter();
}

function removeFormDom(id, element) {
    const item = element.querySelector(`[data-index="${id}"]`);
    item.remove();
}