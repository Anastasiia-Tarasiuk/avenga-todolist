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
    createIncompletedTodoItem(dataIndex)
    setArrayItem(inputEl.value, dataIndex)
    inputEl.value = "";
    // updateTodoCounter();
}

function createIncompletedTodoItem(dataIndex) {
    incompletedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);
    const todoItemTextEl = incompletedTodoListEl.querySelector('.todoItemText');
    todoItemTextEl.textContent = inputEl.value;
    const todoItemEl = incompletedTodoListEl.querySelector('.todoItem');
    todoItemEl.setAttribute('data-index', dataIndex);
    
}

function setArrayItem(value, dataIndex) {
    const item = {
        "id": dataIndex,
        "item": value,
        "isDone": false,
    }
    
    todoItemArray.push(item);
}


// function updateTodoCounter() {
//     if (completedTodoListEl.children.length > 0) {
//        completedTodosCounterEl.textContent = completedTodoListEl.children.length;
//     } else {
//         completedTodosCounterEl.textContent = 0;
//     }

//     if (incompletedTodoListEl.children.length > 0) {
//         incompletedTodosCounterEl.textContent = incompletedTodoListEl.children.length;
//     } else {
//         completedTodosCounterEl.textContent = 0;
//     }
// }

function onCheckBoxClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');

    if (e.checked) {
        const incompletedTodoItemEls = incompletedTodoListEl.querySelectorAll('.todoItem');

        changeCheckboxValue([...incompletedTodoItemEls], itemDataIndex, incompletedTodoListEl, 'true');
        
        renderCompletedItems(e.parentElement);
    } else {
        const completedTodoItemEls = completedTodoListEl.querySelectorAll('.todoItem');

        changeCheckboxValue([...completedTodoItemEls], itemDataIndex, completedTodoListEl, 'false');
        renderIncompletedItems(e.parentElement);
    }
}

function changeCheckboxValue(array, index, element, dataDoneStatus) {
    array.map(el => {
            if (el.getAttribute('data-index') === index) {
                el.setAttribute('data-done-status', dataDoneStatus);
                
                removeFormDom(index, element);
            }
        })

}

function onRemoveBtnClick(e) {
    const itemDataIndex = e.parentElement.getAttribute('data-index');

    // remove item from array
    removeItem(itemDataIndex);
   
    // remove item from dom in every list
    const allTodoItemEls = document.querySelectorAll('.todoItem');
    [...allTodoItemEls].map(el => {
        if (el.getAttribute('data-index') === itemDataIndex) {
            removeFormDom(itemDataIndex, document);
        }
    });
}

function itemActions(e) {
//     const element = e.target;
//     const item = element.closest('li');
//     const checkbox = element.closest('input');
//     const itemDataIndex = item.getAttribute('data-index');
//
//     const currentListClassName = element.parentElement.parentElement.className;
//     let currentArray = null;
//     let elementToDoAction = null;
//
//     if (currentListClassName === 'todoList') {
//         currentArray = todoItemArray;
//         elementToDoAction = todoListEl;
//     }
//
//     if (currentListClassName === 'completedTodoList') {
//         currentArray = todoCompletedItemArray;
//         elementToDoAction = completedTodoListEl;
//     }
//
//     if (currentListClassName === 'incompletedTodoList') {
//         currentArray = todoIncompletedItemArray;
//         elementToDoAction = incompletedTodoListEl;
//     }
//
//     // ------------
//
//     if (element.className === "removeItemButton") {
//         removeItem(itemDataIndex, currentArray, elementToDoAction);
//     }
//
//     if (element.className === "completeItemButton") {
//         if (checkbox.checked) {
//             todoItemArray.map(el => {
//
//                 if (el.id === item.getAttribute('data-index')) {
//                     el.isDone = true;
//                 }
//             })
//             setItemCompleted(item);
//             removeItem(itemDataIndex, todoIncompletedItemArray, incompletedTodoListEl);
//         } else {
//             unsetItemCompleted(checkbox);
//             removeItem(itemDataIndex, todoCompletedItemArray, completedTodoListEl);
//         }
//     }
}

function removeItem(id) {
    todoItemArray = todoItemArray.filter(item => {
        return item.id !== id;
    });

    // updateTodoCounter();
}


// має бути один метод рендеру!
function renderCompletedItems(element) {

    completedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);

    const todoItemEl = completedTodoListEl.querySelector('.todoItem');
    const todoItemTextEl = completedTodoListEl.querySelector('.todoItemText');
    const completeItemButtonEl = completedTodoListEl.querySelector('.completeItemButton');
    todoItemEl.setAttribute('data-index', element.getAttribute('data-index'));
    todoItemTextEl.textContent = element.querySelector('p').textContent;
    completeItemButtonEl.setAttribute('checked', '');

    // updateTodoCounter();
}

function renderIncompletedItems(element) {
    incompletedTodoListEl.insertAdjacentHTML('afterbegin', todoItemTemplate);

    const todoItemEl = incompletedTodoListEl.querySelector('.todoItem');
    const todoItemTextEl = incompletedTodoListEl.querySelector('.todoItemText');
    const incompleteItemButtonEl = incompletedTodoListEl.querySelector('.completeItemButton');
    todoItemEl.setAttribute('data-index', element.getAttribute('data-index'));
    todoItemTextEl.textContent = element.querySelector('p').textContent;
    incompleteItemButtonEl.removeAttribute('checked');

    // updateTodoCounter();
}


function removeFormDom(id, element) {
    const item = element.querySelector(`[data-index="${id}"]`);
    item.remove();
}