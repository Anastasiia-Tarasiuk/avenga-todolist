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
let todoCompletedItemArray = [];

let allTodosCounterValue = 0;
let completedTodosCounterValue = 0;
let incompletedTodosCounterValue = 0;

updateTodoCounter();
    
const todoItemEls = document.querySelectorAll('.todoItem');
todoListEl.addEventListener('click', itemActions);
    
function onButtonClick() {
    createTodoItem();
    updateTodoCounter();

    inputEl.value = "";
}
    
function updateTodoCounter() {

    allTodosCounterValue = todoItemArray.length;
    completedTodosCounterValue = todoCompletedItemArray.length;
    incompletedTodosCounterValue = allTodosCounterValue - completedTodosCounterValue; 

    allTodosCounterEl.textContent = allTodosCounterValue;
    completedTodosCounterEl.textContent = completedTodosCounterValue;
    incompletedTodosCounterEl.textContent = incompletedTodosCounterValue;
}

function createTodoItem() {
    todoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);
    
    const todoItemTextEl = document.querySelector('.todoItemText');
    todoItemTextEl.textContent = inputEl.value;

    const todoItemEl = document.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', Math.random().toString(36).slice(-6));
    
    const item = {
        "id": todoItemEl.getAttribute('data-index'),
        "item": inputEl.value,
        "isDone": false,
    }
    
    todoItemArray.push(item);
}

// function renderTodoList() {
//     try {
//         // todoItemArray = JSON.parse(localStorage.getItem('todos'));
//         // todoListEl.innerHTML = '';

//         todoItemArray.map(item => {
//             todoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);
//             const todoItem = document.querySelector('.todoItem');
//             todoItem.setAttribute('data-index', item.id);
//             const todoItemTextEl = document.querySelector('.todoItemText');
//             todoItemTextEl.textContent = item.item;
//         })

//     } catch (error) {
//         console.log(error)
//     }
// }

// function saveTodoList(item) {
//     localStorage.setItem('todos', JSON.stringify(item));
// }


function itemActions(e) {
    const element = e.target;
    const item = element.closest('li');
    const checkbox = element.closest('input');

    console.log(item)
    console.log(checkbox)

    const itemDataIndex = item.getAttribute('data-index');
    
    if (element.className === "removeItemButton") {
        removeItem(itemDataIndex, todoItemArray);
    }
    
    if (element.className === "completeItemButton") {
        if (checkbox.checked) {
            setItemCompleted(item);
        } else {
            unsetItemCompleted(checkbox, itemDataIndex, todoCompletedItemArray);
        }
    }
}

function removeItem(id, array) {
    array = array.filter(item => {
        return item.id !== id;
    });
    removeFormDom(id);
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


function unsetItemCompleted(checkbox, id, array) {
    checkbox.removeAttribute('checked');
    removeItem(id, array);
}

function renderCompletedItems(element) {
    completedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);

    const todoItemTextEl = completedTodoListEl.querySelector('.todoItemText');
    const completeItemButtonEl = completedTodoListEl.querySelector('.completeItemButton');
    todoItemTextEl.textContent = element.querySelector('p').textContent;
    completeItemButtonEl.setAttribute('checked', '');

    updateTodoCounter();
}

function removeFormDom(id) {
    const element = document.querySelector(`[data-index="${id}"]`);
    element.remove();
}