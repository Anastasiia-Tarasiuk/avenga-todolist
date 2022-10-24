const inputEl = document.querySelector('.input');
const addTaskButtonEl = document.querySelector('.addTaskButton');

const completedTodoListEl = document.querySelector('.completedTodoList');
const incompletedTodoListEl = document.querySelector('.incompletedTodoList');
const allTodoListEl = document.querySelector('.allTodoList');

const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');
const allTodosCounterEl = document.querySelector('.allTodosCounter');

const incompletedTodosEl = document.querySelector('.incompletedTodos');
const completedTodosEl = document.querySelector('.completedTodos');
const allTodosEl = document.querySelector('.allTodos');

const emptyTodoListEl = document.querySelector('.emptyTodoListContent');
const emptyAllTodoEl = document.querySelector('.emptyAllTodosContent');

addTaskButtonEl.addEventListener('click', onButtonClick);

document.addEventListener('keydown', onEnterKeyClick);

completedTodosEl.addEventListener('click', onListClick);
incompletedTodosEl.addEventListener('click', onListClick);
allTodosEl.addEventListener('click', onListClick);

const todoItemTemplate = `
<li class="todoItem" data-done-status="false">
<input class="completeItemButton" type="checkbox" onclick="onCheckBoxClick(this)">
<p class="todoItemText"></p>
<button class="removeItemButton" type="button" onclick="onRemoveBtnClick(this)">Remove</button>
</li>`

// first render (getting values from local storage or empty value
let todoItemArray = JSON.parse(localStorage.getItem('todos')) || [];

if (todoItemArray.length > 0) {
    
    for (let i = 0; i < todoItemArray.length; i++) {
        renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, allTodoListEl);
        if (todoItemArray[i].isDone) {
            
            renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, completedTodoListEl);
            
            const checkboxEl = completedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.checked = true;
            allTodoListEl.querySelector('.completeItemButton').checked = true;

        } else {

            renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, incompletedTodoListEl);
            
            const checkboxEl = incompletedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.checked = false;
            allTodoListEl.querySelector('.completeItemButton').checked = false;
        } 
    }
    updateTodoCounter();
}

if (todoItemArray.length === 0) {
    completedTodosCounterEl.textContent = 0;
    incompletedTodosCounterEl.textContent = 0;
    allTodosCounterEl.textContent = 0;
}

completedTodoListEl.classList.add('isHidden');
allTodoListEl.classList.add('isHidden');

incompletedTodosCounterEl.parentElement.classList.add('isActive');

renderEmptyTodoListContent(true); 

// event functions
function onButtonClick() {
    const dataIndex = Math.random().toString(36).slice(-6);
    renderTodoItem(dataIndex, inputEl.value, incompletedTodoListEl);
    renderTodoItem(dataIndex, inputEl.value, allTodoListEl);
    setArrayItem(inputEl.value, dataIndex);
    inputEl.value = "";
}

function onEnterKeyClick(e) {
    if (e.code === "Enter") {
        onButtonClick();
    }
}

function onListClick(e) {
    switch (e.currentTarget.className) {
        case 'completedTodos':
            completedTodoListEl.classList.remove('isHidden');
            incompletedTodoListEl.classList.add('isHidden');
            completedTodosCounterEl.parentElement.classList.add('isActive');
            incompletedTodosCounterEl.parentElement.classList.remove('isActive');
            allTodoListEl.classList.add('isHidden');
            allTodosCounterEl.parentElement.classList.remove('isActive');

            renderEmptyTodoListContent(false);
            emptyTodoListEl.classList.remove('isHidden');
            emptyAllTodoEl.classList.add('isHidden');
        break;
        case 'incompletedTodos':
            incompletedTodoListEl.classList.remove('isHidden');
            completedTodoListEl.classList.add('isHidden');
            incompletedTodosCounterEl.parentElement.classList.add('isActive');
            completedTodosCounterEl.parentElement.classList.remove('isActive');
            allTodoListEl.classList.add('isHidden');
            allTodosCounterEl.parentElement.classList.remove('isActive');

            renderEmptyTodoListContent(true);
            emptyTodoListEl.classList.remove('isHidden');
            emptyAllTodoEl.classList.add('isHidden');
        break;
        case 'allTodos':
            allTodoListEl.classList.remove('isHidden');
            allTodosCounterEl.parentElement.classList.add('isActive');
            incompletedTodoListEl.classList.add('isHidden');
            completedTodoListEl.classList.add('isHidden');
            completedTodosCounterEl.parentElement.classList.remove('isActive');
            incompletedTodosCounterEl.parentElement.classList.remove('isActive');

            renderAllTodosContent();
            emptyAllTodoEl.classList.remove('isHidden');
            emptyTodoListEl.classList.add('isHidden');
        break;
    }
}

function onCheckBoxClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');
    const todoTextContent = e.parentElement.querySelector('.todoItemText').textContent;

    // if checkbox is checked, item sets to completedTodoList and removes from incompletedTodoList
    if (e.checked) {
        changeCheckboxValue(itemDataIndex, incompletedTodoListEl, 'true');

        [...allTodoListEl.children].map(item => {
            if (item.getAttribute('data-index') === itemDataIndex) {
                item.querySelector('.completeItemButton').checked = true;
            }
        })
    
        removeFormDom(itemDataIndex, incompletedTodoListEl);
        renderTodoItem(itemDataIndex, todoTextContent, completedTodoListEl);

        const checkboxEl = completedTodoListEl.querySelector('.completeItemButton');
        checkboxEl.checked = true;
        renderEmptyTodoListContent(true);
        
    } else {
        changeCheckboxValue(itemDataIndex, completedTodoListEl, 'false');

        [...allTodoListEl.children].map(item => {
            if (item.getAttribute('data-index') === itemDataIndex) {
                item.querySelector('.completeItemButton').checked = false;
            }
        })

        removeFormDom(itemDataIndex, completedTodoListEl);
        renderTodoItem(itemDataIndex, todoTextContent, incompletedTodoListEl);

        const checkboxEl = incompletedTodoListEl.querySelector('.completeItemButton');
        checkboxEl.checked = false;
        renderEmptyTodoListContent(false);    
    }
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

    if (completedTodoListEl.classList.contains('isHidden')) {
        renderEmptyTodoListContent(true);
    } else {
        renderEmptyTodoListContent(false);
    }
}

// render functions
function renderEmptyTodoListContent(value = false) {
    if(value){
        if (incompletedTodoListEl.children.length === 0) {
            emptyTodoListEl.textContent = 'Here is no incompleted todos';
        } else if (incompletedTodoListEl.children.length > 0) {
            emptyTodoListEl.textContent = '';
        }
    } else {
        if (completedTodoListEl.children.length === 0) {
            emptyTodoListEl.textContent = 'Here is no completed todos';
        } else if (completedTodoListEl.children.length > 0) {
            emptyTodoListEl.textContent = '';
        }
    } 
}

function renderAllTodosContent() {
    if (todoItemArray.length === 0) {
        emptyAllTodoEl.textContent = 'Todos list is empty';
    } else {
        emptyAllTodoEl.textContent = '';
    }
}

function renderTodoItem(dataIndex, text, list) {
    list.insertAdjacentHTML('afterbegin', todoItemTemplate);
    const todoItemTextEl = list.querySelector('.todoItemText');
    todoItemTextEl.textContent = text;
    const todoItemEl = list.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', dataIndex);
    updateTodoCounter();

    if (completedTodoListEl.classList.contains('isHidden')) {
        renderEmptyTodoListContent(true);
    } else {
        renderEmptyTodoListContent(false);
    }
}

// other functions
function setArrayItem(value, dataIndex) {
    const item = {
        "id": dataIndex,
        "item": value,
        "isDone": false,
    }
    todoItemArray.push(item);
    updateTodoCounter();
    localStorage.setItem('todos', JSON.stringify(todoItemArray));
}

function updateTodoCounter() {
    completedTodosCounterEl.textContent = completedTodoListEl.children.length;
    incompletedTodosCounterEl.textContent = incompletedTodoListEl.children.length;
    allTodosCounterEl.textContent = todoItemArray.length;
}

function changeCheckboxValue(index, element, dataDoneStatus) {
    [...element.querySelectorAll('.todoItem')].map(el => {

        if (el.getAttribute('data-index') === index) {
            el.setAttribute('data-done-status', dataDoneStatus);
        }
    })
    
    changeArrayItemStatus(index);
    localStorage.clear();
    localStorage.setItem('todos', JSON.stringify(todoItemArray));
    updateTodoCounter();
}

function removeItem(id) {
    todoItemArray = todoItemArray.filter(item => {
        return item.id !== id;
    });

    renderAllTodosContent();

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