class Task {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.complete = false;
  }

  changeTitle(title) {
    this.title = title;
  }

  changeDescription(description) {
    this.description = description;
  }

  toggleComplete() {
    this.complete = !this.complete;
  }
}

class TaskList {
  constructor() {
    this.list = [];
  }

  addTaskToList(task) {
    this.list.push(task);
  }

  removeTaskFromList(task) {
    this.list.splice(task, 1);
  }
}
const taskList = new TaskList();

document.addEventListener("DOMContentLoaded", function () {
  const addTaskButton = document.querySelector(".add-task-button");
  const dialog = document.querySelector(".dialog-box");
  const formCancelButton = document.querySelector(".form-cancel-button");
  const formSubmitButton = document.querySelector(".form-submit-button");
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const form = document.querySelector(".form");
  const errorElement = document.querySelector(".error-element");
  const taskListContainer = document.querySelector(".task-list-container");

  addTaskButton.addEventListener("click", () => {
    errorElement.innerText = "";
    title.value = "";
    description.value = "";

    dialog.showModal();
  });

  formCancelButton.addEventListener("click", () => {
    dialog.close();
  });

  formSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const messages = [];

    if (title.value === "" || title.value === null) {
      messages.push("Title is required");
    }

    if (messages.length > 0) {
      errorElement.innerText = messages.join(", ");
    }

    const task = new Task(title.value, description.value);

    taskList.addTaskToList(task);

    const li = document.createElement("li");
    li.innerText = `${task.title}${
      task.description ? `: ${task.description}` : ""
    }`;
    taskListContainer.append(li);

    dialog.close();
  });
});
