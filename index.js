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

let todoItemArray = [];
    
completedTodosCounterEl.textContent = 0;
incompletedTodosCounterEl.textContent = 0;
    
function onButtonClick() {
    const dataIndex = Math.random().toString(36).slice(-6);
    renderTodoItem(dataIndex, inputEl.value, incompletedTodoListEl)
    setArrayItem(inputEl.value, dataIndex)
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
}

function updateTodoCounter() {
    completedTodosCounterEl.textContent = completedTodoListEl.children.length;
    incompletedTodosCounterEl.textContent = incompletedTodoListEl.children.length;
}

function onCheckBoxClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');
    const todoTextContent = e.parentElement.querySelector('.todoItemText').textContent;

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
            if (el.getAttribute('data-index') === index) {
                el.setAttribute('data-done-status', dataDoneStatus);
                removeFormDom(index, element);
            }
    })
    updateTodoCounter();
}

function onRemoveBtnClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');

    removeItem(itemDataIndex);
    
    const allTodoItemEls = document.querySelectorAll('.todoItem');
    [...allTodoItemEls].map(el => {
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

}

function removeFormDom(id, element) {
    const item = element.querySelector(`[data-index="${id}"]`);
    item.remove();
}

