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

const task1 = new Task("Test Title", "This is just a test");
const task2 = new Task("Test Title 2", "This is just another test");
const testList = new TaskList();
