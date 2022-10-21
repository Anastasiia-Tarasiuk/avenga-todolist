const inputEl = document.querySelector('.input');
const addTaskButtonEl = document.querySelector('.addTaskButton');

const completedTodoListEl = document.querySelector('.completedTodoList');
const incompletedTodoListEl = document.querySelector('.incompletedTodoList');

const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');

addTaskButtonEl.addEventListener('click', onButtonClick);

const todoItemTemplate = `
<li class="todoItem" data-done-status="false">
<input class="completeItemButton" type="checkbox" onclick="onCheckBoxClick(this)">
<p class="todoItemText"></p>
<button class="removeItemButton" type="button" onclick="onRemoveBtnClick(this)">Remove</button>
</li>`

let todoItemArray = JSON.parse(localStorage.getItem('todos')) || [];

if (todoItemArray.length > 0) {

    for (let i = 0; i < todoItemArray.length; i++) {
        if (todoItemArray[i].isDone) {

            renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, completedTodoListEl);

            const checkboxEl = completedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.setAttribute('checked', '');    
        } else {

            renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, incompletedTodoListEl);
        
            const checkboxEl = incompletedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.removeAttribute('checked');
        }

    }
    updateTodoCounter();
}

if (todoItemArray.length === 0) {
    completedTodosCounterEl.textContent = 0;
    incompletedTodosCounterEl.textContent = 0;
}
    
function onButtonClick() {
    const dataIndex = Math.random().toString(36).slice(-6);
    renderTodoItem(dataIndex, inputEl.value, incompletedTodoListEl);
    setArrayItem(inputEl.value, dataIndex);
    inputEl.value = "";
}

function renderTodoItem(dataIndex, text, list) {
    list.insertAdjacentHTML('afterbegin', todoItemTemplate);
    const todoItemTextEl = list.querySelector('.todoItemText');
    todoItemTextEl.textContent = text;
    const todoItemEl = list.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', dataIndex);  
    updateTodoCounter();
}

function setArrayItem(value, dataIndex) {
    const item = {
        "id": dataIndex,
        "item": value,
        "isDone": false,
    }
    todoItemArray.push(item);
    localStorage.setItem('todos', JSON.stringify(todoItemArray));
}

function updateTodoCounter() {
    completedTodosCounterEl.textContent = completedTodoListEl.children.length;
    incompletedTodosCounterEl.textContent = incompletedTodoListEl.children.length;
}

function onCheckBoxClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');
    const todoTextContent = e.parentElement.querySelector('.todoItemText').textContent;

    // if checkbox is checked, item sets to completedTodoList and removes from incompletedTodoList
    if (e.checked) {
        changeCheckboxValue(itemDataIndex, incompletedTodoListEl, 'true');
        renderTodoItem(itemDataIndex, todoTextContent, completedTodoListEl);

        const checkboxEl = completedTodoListEl.querySelector('.completeItemButton');
        checkboxEl.setAttribute('checked', '');        
    } else {
        changeCheckboxValue(itemDataIndex, completedTodoListEl, 'false');
        renderTodoItem(itemDataIndex, todoTextContent, incompletedTodoListEl);
        
        const checkboxEl = incompletedTodoListEl.querySelector('.completeItemButton');
        checkboxEl.removeAttribute('checked');
    }
}

function changeCheckboxValue(index, element, dataDoneStatus) {
    [...element.querySelectorAll('.todoItem')].map(el => {
        // remove item from list if dataIndex of item is the same as choosen item has
        if (el.getAttribute('data-index') === index) {
            el.setAttribute('data-done-status', dataDoneStatus);
            removeFormDom(index, element);
        }
    })

    changeArrayItemStatus(index);
    localStorage.clear();
    localStorage.setItem('todos', JSON.stringify(todoItemArray));
    updateTodoCounter();
}

function onRemoveBtnClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');

    removeItem(itemDataIndex);

    [...document.querySelectorAll('.todoItem')].map(el => {
        // remove item from DOM if dataIndex of item is the same as choosen item has
        if (el.getAttribute('data-index') === itemDataIndex) {
            removeFormDom(itemDataIndex, document);
        }
    });

    updateTodoCounter();
}

function removeItem(id) {
    todoItemArray = todoItemArray.filter(item => {
        return item.id !== id;
    });

    localStorage.clear();
    localStorage.setItem('todos', JSON.stringify(todoItemArray));
}

function removeFormDom(id, element) {
    const item = element.querySelector(`[data-index="${id}"]`);
    item.remove();
}

function changeArrayItemStatus(index) {
    todoItemArray.map(el => {
        if (el.id === index) {
            el.isDone = !el.isDone;
        }
    })
}

