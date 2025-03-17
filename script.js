function saveData() {
  localStorage.setItem("todoLists", JSON.stringify(lists));
  localStorage.setItem("currentListId", currentListId);
}

function loadData() {
  const savedLists = localStorage.getItem("todoLists");
  const savedCurrentListId = localStorage.getItem("currentListId");

  if (savedLists) {
    lists = JSON.parse(savedLists);
  }

  if (savedCurrentListId && savedCurrentListId !== "null") {
    currentListId = parseInt(savedCurrentListId);
    todoListElement.classList.remove("hide");
    todoListElement.style.visibility = "visible";
  }
}

let lists = [];

let currentListId = null;

const listContainer = document.querySelector(".list-container");
const listItem = document.querySelector(".list-item");
const listForm = document.querySelector(".list-form");
const listInput = document.querySelector(".list-text-input");
const todoListTitle = document.querySelector(".todo-list-title");
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".new-task-input");
const taskContainer = document.querySelector(".todo");
const finishedTaskContainer = document.querySelector(".done");
const finishedTaskHeader = document.querySelector(".done-header");
const clearFinishedTasksButton = document.querySelector(".clear-button");
const deleteListButton = document.querySelector(".delete-button");
const todoListElement = document.querySelector(".todo-list");

(function () {
  const style = document.createElement("style");
  style.textContent = "body { visibility: hidden; }";
  document.head.appendChild(style);
})();

listContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("list-item")) {
    document.querySelectorAll(".list-item").forEach((item) => {
      item.classList.remove("active-list-item");
    });
    e.target.classList.add("active-list-item");

    const listId = parseInt(e.target.dataset.listId);
    currentListId = listId;

    const selectedList = lists.find((list) => list.id === listId);
    todoListTitle.innerText = selectedList.name;

    taskInput.value = "";

    renderTasks();
    updateTaskCount();
    saveData();
  }
});

function render() {
  listContainer.innerHTML = "";

  lists.forEach((list) => {
    const listItem = document.createElement("li");
    listItem.innerText = list.name;
    listItem.classList.add("list-item");
    listItem.dataset.listId = list.id;
    if (list.id === currentListId) {
      listItem.classList.add("active-list-item");
    }
    listContainer.appendChild(listItem);
  });
}

function renderTasks() {
  if (currentListId === null) return;

  const currentList = lists.find((list) => list.id === currentListId);

  taskContainer.innerHTML = "";
  finishedTaskContainer.innerHTML = "";

  currentList.tasks.forEach((task) => {
    const newTaskContainer = document.createElement("div");
    const newCheckbox = document.createElement("input");
    const newTitle = document.createElement("label");

    newTaskContainer.classList.add("task");
    newCheckbox.classList.add("todo-checkbox");
    newCheckbox.setAttribute("type", "checkbox");
    newCheckbox.id = task.id;
    newTitle.innerText = ` ${task.text}`;
    newTitle.htmlFor = task.id;

    newTaskContainer.append(newCheckbox);
    newTaskContainer.append(newTitle);
    taskContainer.append(newTaskContainer);
  });

  currentList.completedTasks.forEach((task) => {
    const taskElement = document.createElement("div");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    taskElement.classList.add("done-task");
    checkbox.classList.add("done-checkbox");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = true;
    checkbox.id = task.id;

    label.innerText = task.text;
    label.htmlFor = task.id;
    label.classList.add("done-task-title");

    taskElement.append(checkbox);
    taskElement.append(label);
    finishedTaskContainer.append(taskElement);
  });

  updateFinishedTaskHeader();
}

function updateFinishedTaskHeader() {
  if (currentListId === null) return;

  const currentList = lists.find((list) => list.id === currentListId);
  const finishedTaskCount = currentList.completedTasks.length;

  if (finishedTaskCount === 0) {
    finishedTaskHeader.classList.add("hide");
  } else {
    finishedTaskHeader.classList.remove("hide");
  }
}

listForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (listInput.value === null || listInput.value.trim() === "") {
    return;
  }

  const newId =
    lists.length > 0 ? Math.max(...lists.map((list) => list.id)) + 1 : 1;
  const newList = {
    id: newId,
    name: listInput.value,
    tasks: [],
    completedTasks: [],
  };

  lists.push(newList);
  listInput.value = "";

  currentListId = newId;

  todoListElement.style.visibility = "visible";
  todoListElement.classList.remove("hide");

  todoListTitle.innerText = newList.name;

  render();
  renderTasks();
  updateTaskCount();
  saveData();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (taskInput.value === null || taskInput.value.trim() === "") {
    return;
  }

  if (currentListId === null) return;

  const currentList = lists.find((list) => list.id === currentListId);

  const id = Date.now().toString();
  const newTask = {
    id: id,
    text: taskInput.value,
  };

  currentList.tasks.push(newTask);

  const newTaskContainer = document.createElement("div");
  const newCheckbox = document.createElement("input");
  const newTitle = document.createElement("label");

  newTaskContainer.classList.add("task");
  newCheckbox.classList.add("todo-checkbox");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.id = id;
  newTitle.innerText = ` ${taskInput.value}`;
  newTitle.htmlFor = id;

  newTaskContainer.append(newCheckbox);
  newTaskContainer.append(newTitle);
  taskContainer.append(newTaskContainer);

  taskInput.value = "";
  updateTaskCount();
  saveData();
});

taskContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("todo-checkbox") && e.target.checked) {
    const taskElement = e.target.closest(".task");
    const taskId = e.target.id;
    const label = taskElement.querySelector("label");
    const taskText = label.innerText.trim();

    const currentList = lists.find((list) => list.id === currentListId);

    const taskIndex = currentList.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      currentList.tasks.splice(taskIndex, 1);

      currentList.completedTasks.push({
        id: taskId,
        text: taskText,
      });

      renderTasks();
      updateTaskCount();
      saveData();
    }
  }
});

finishedTaskContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("done-checkbox") && !e.target.checked) {
    const taskElement = e.target.closest(".done-task");
    const taskId = e.target.id;
    const label = taskElement.querySelector("label");
    const taskText = label.innerText.trim();

    const currentList = lists.find((list) => list.id === currentListId);

    const taskIndex = currentList.completedTasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex !== -1) {
      currentList.completedTasks.splice(taskIndex, 1);

      currentList.tasks.push({
        id: taskId,
        text: taskText,
      });

      renderTasks();
      updateTaskCount();
      saveData();
    }
  }
});

function updateTaskCount() {
  const taskCounterElement = document.querySelector(".todo-list-header p");

  if (currentListId === null) {
    taskCounterElement.innerText = "0 Tasks";
    return;
  }

  const currentList = lists.find((list) => list.id === currentListId);
  const taskCount = currentList.tasks.length;
  taskCounterElement.innerText = `${taskCount} Task${
    taskCount !== 1 ? "s" : ""
  }`;
}

clearFinishedTasksButton.addEventListener("click", () => {
  if (currentListId === null) return;

  const currentList = lists.find((list) => list.id === currentListId);
  currentList.completedTasks = [];
  renderTasks();
  updateFinishedTaskHeader();
  saveData();
});

deleteListButton.addEventListener("click", () => {
  if (currentListId === null) return;

  const listIndex = lists.findIndex((list) => list.id === currentListId);
  if (listIndex !== -1) {
    lists.splice(listIndex, 1);
  }

  if (lists.length > 0) {
    currentListId = lists[0].id;
    todoListTitle.innerText = lists[0].name;

    render();
    renderTasks();
    updateTaskCount();
  } else {
    currentListId = null;
    todoListElement.style.visibility = "hidden";
    listContainer.innerHTML = "";
  }
  saveData();
});

function initializeApp() {
  loadData();

  if (lists.length > 0 && currentListId) {
    const currentList = lists.find((list) => list.id === currentListId);
    if (currentList) {
      todoListTitle.innerText = currentList.name;
    }
  }

  render();
  renderTasks();
  updateTaskCount();

  document.body.style.visibility = "visible";
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initializeApp, 50);
});
