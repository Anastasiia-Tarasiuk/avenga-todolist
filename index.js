// addTask elements
const addTaskInputEl = document.querySelector('.addTaskInput');
const addTaskButtonEl = document.querySelector('.addTaskButton');

// filter elements
const filterInputEl = document.querySelector('.filterInput');
const clearFilterInputValueButtonEl = document.querySelector('.clearFilterInputValueButton');

// todos lists
const completedTodoListEl = document.querySelector('.completedTodoList');
const incompletedTodoListEl = document.querySelector('.incompletedTodoList');
const allTodoListEl = document.querySelector('.allTodoList');

// counter values elements
const completedTodosCounterEl = document.querySelector('.completedTodosCounter');
const incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');
const allTodosCounterEl = document.querySelector('.allTodosCounter');

// counter text elements
const incompletedTodosEl = document.querySelector('.incompletedTodos');
const completedTodosEl = document.querySelector('.completedTodos');
const allTodosEl = document.querySelector('.allTodos');

// counter list
const counterListEl = document.querySelector('.counterList');

// list message elements
const emptyTodoListEl = document.querySelector('.emptyTodoListContent');
const emptyAllTodoEl = document.querySelector('.emptyAllTodosContent');

addTaskButtonEl.addEventListener('click', onButtonClick);
document.addEventListener('keydown', onEnterKeyClick);
counterListEl.addEventListener('click', onListClick);
filterInputEl.addEventListener('input', onFilterType);
clearFilterInputValueButtonEl.addEventListener('click', onClearFilterInputValue);
document.addEventListener('DOMContentLoaded', onPageReload);

const todoItemTemplate = `
<li class="todoItem" data-done-status="false">
<input class="completeItemButton" type="checkbox" onclick="onCheckBoxClick(this)">
<p class="todoItemText"></p>
<button class="removeItemButton" type="button" onclick="onRemoveBtnClick(this)">Remove</button>
<button class="editItemButton" type="button" onclick="onEditBtnClick(this)">Edit</button>
</li>`

let editableTextContent = null;

// first render (gets values from local storage or sets empty value)
let todoItemArray = JSON.parse(localStorage.getItem('todos')) || [];

if (todoItemArray.length > 0) {    
    for (let i = 0; i < todoItemArray.length; i++) {
        // array items renders to allTodoList
        renderTodoItem(todoItemArray[i].id, todoItemArray[i].item, allTodoListEl);
        // according to isDone status renders to completedTodoList or incompletedTodoList
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

// if array is empty sets default counter values
if (todoItemArray.length === 0) {
    completedTodosCounterEl.textContent = 0;
    incompletedTodosCounterEl.textContent = 0;
    allTodosCounterEl.textContent = 0;
}

renderEmptyTodoListContent(true); 

// event functions
function onButtonClick() {
    // doesn't let add tasks with no text
    if (addTaskInputEl.value.trim() !== "") {
        const dataIndex = Math.random().toString(36).slice(-6);
        renderTodoItem(dataIndex, addTaskInputEl.value, incompletedTodoListEl);
        renderTodoItem(dataIndex, addTaskInputEl.value, allTodoListEl);
        setArrayItem(addTaskInputEl.value, dataIndex);
        addTaskInputEl.value = "";        
    }

    renderAllTodosContent()
}

function onFilterType(e) {
    getActiveListForFolterUsage(e.currentTarget.value);
}

function onClearFilterInputValue(e) {
    e.target.previousElementSibling.value = "";

    getActiveListForFolterUsage(e.target.previousElementSibling.value);
}


function getActiveListForFolterUsage(value) {
    if (!allTodoListEl.classList.contains('isHidden')) {        
        hideTodoListElements(allTodoListEl, value);        
    }

    if (!incompletedTodoListEl.classList.contains('isHidden')) {        
        hideTodoListElements(incompletedTodoListEl, value);        
    }

    if (!completedTodoListEl.classList.contains('isHidden')) {        
        hideTodoListElements(completedTodoListEl, value);        
    }
}

function onEnterKeyClick(e) {
    if (e.code === "Enter") {
        onButtonClick();
    }
}

function onPageReload() {
    const activePage = sessionStorage.getItem("isActive");
    switch (activePage) {
        case 'completed':
            makeCompletedTodoListActive();
            break;
        case 'incompleted':
            makeIncompletedTodoListActive();
            break;
        case 'all':
            makeAllTodoListActive();
            break;
        default:
            completedTodoListEl.classList.add('isHidden');
            allTodoListEl.classList.add('isHidden');
            incompletedTodosCounterEl.parentElement.classList.add('isActive');
    }
}

function onListClick(e) {
    // makes one todos list active
    switch (e.target.getAttribute('data-type')) {
        case 'completed':
            makeCompletedTodoListActive();
            sessionStorage.setItem("isActive", 'completed');
            break;
        case 'incompleted':
            makeIncompletedTodoListActive();
            sessionStorage.setItem("isActive", 'incompleted');
            break;
        case 'all':            
            makeAllTodoListActive()
            sessionStorage.setItem("isActive", 'all');
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
        // removes item from DOM if dataIndex of item is the same as choosen item has
        if (el.getAttribute('data-index') === itemDataIndex) {
            removeFormDom(itemDataIndex, document);
        }
    });

    updateTodoCounter();

    // checks which todos list is active
    if (completedTodoListEl.classList.contains('isHidden')) {
        renderEmptyTodoListContent(true);
    } else if (incompletedTodoListEl.classList.contains('isHidden')) {
        renderEmptyTodoListContent(false);
    }
    
    if (!allTodoListEl.classList.contains('isHidden')) {
        renderAllTodosContent();
    }
}

function onEditBtnClick(e) {
    [...e.parentElement.children].map(item => {
        if (item.className === 'todoItemText') {
            editableTextContent = item.textContent;
            item.contentEditable = true;
            item.classList.add('isEditable');
            item.addEventListener('keydown', onTodoKeydown);
        }
    })
}

function onTodoKeydown(e) {
    if (e.code === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        
        const arrayFromLocalStorage = JSON.parse(localStorage.getItem('todos'));
        localStorage.clear();
        
        // looks for item with edited value and sets new value
        arrayFromLocalStorage.map(el => {
            if (el.item === editableTextContent) {
                el.item = e.currentTarget.textContent;
            }
        })

        localStorage.setItem('todos', JSON.stringify(arrayFromLocalStorage));

        e.currentTarget.contentEditable = false;
        e.currentTarget.classList.remove('isEditable');
    }
}

// render functions
function renderEmptyTodoListContent(value = false) {
    // renders message according to active list
    if (value){
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
    // renders message for all todos list if it is active
    if (todoItemArray.length === 0) {
        emptyAllTodoEl.textContent = 'Todos list is empty';
    }
    if (todoItemArray.length > 0) {
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

    // renders message according to active list
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

        // sets done stutus to items in array
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

function hideTodoListElements(array, value) {
    const itemsArray = [...array.children];
        itemsArray.map(item => {
            [...item.children].map(el => {
                // looks for text element in DOM item
                if (el.className === "todoItemText") {
                    // hides items if text element value doesn't containe filter value
                    if (!el.textContent.includes(value)) {
                        el.parentElement.classList.add('isHidden');
                    } else {
                        el.parentElement.classList.remove('isHidden');
                    }
                }
            })
        })
}

function makeIncompletedTodoListActive() {
    incompletedTodoListEl.classList.remove('isHidden');
    completedTodoListEl.classList.add('isHidden');
    incompletedTodosCounterEl.parentElement.classList.add('isActive');
    completedTodosCounterEl.parentElement.classList.remove('isActive');
    allTodoListEl.classList.add('isHidden');
    allTodosCounterEl.parentElement.classList.remove('isActive');
    emptyTodoListEl.classList.remove('isHidden');
    emptyAllTodoEl.classList.add('isHidden');

    renderEmptyTodoListContent(true);
}

function makeAllTodoListActive() {
    allTodoListEl.classList.remove('isHidden');
    allTodosCounterEl.parentElement.classList.add('isActive');
    incompletedTodoListEl.classList.add('isHidden');
    completedTodoListEl.classList.add('isHidden');
    completedTodosCounterEl.parentElement.classList.remove('isActive');
    incompletedTodosCounterEl.parentElement.classList.remove('isActive');
    emptyAllTodoEl.classList.remove('isHidden');
    emptyTodoListEl.classList.add('isHidden');

    renderAllTodosContent();
}

function makeCompletedTodoListActive() {
    completedTodoListEl.classList.remove('isHidden');
    incompletedTodoListEl.classList.add('isHidden');
    completedTodosCounterEl.parentElement.classList.add('isActive');
    incompletedTodosCounterEl.parentElement.classList.remove('isActive');
    allTodoListEl.classList.add('isHidden');
    allTodosCounterEl.parentElement.classList.remove('isActive');
    emptyTodoListEl.classList.remove('isHidden');
    emptyAllTodoEl.classList.add('isHidden');

    renderEmptyTodoListContent(false);    
}