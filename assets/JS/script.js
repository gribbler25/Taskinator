var taskIdCounter = 0;
var formEl = document.querySelector("#task-form")
var tasksToDoEl = document.querySelector("#tasks-to-do");


var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name= 'task-name']").value;
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("First first fill out the task form!");
        return false;
    }
    formEl.reset();

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    createTaskEl(taskDataObj);
};


var createTaskEl = function (taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //custom data-task-id attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    //add html content to the div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span >"
    // listItemEl.textContent = taskNameInput;
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};
var createTaskActions = function (taskId) {

    var actionContainerElement = document.createElement("div");
    actionContainerElement.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn"
    editButtonEl.setAttribute("data-task-id", taskId)

    actionContainerElement.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerElement.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "change-status")
    statusSelectEl.setAttribute("data-task-id", taskId)

    actionContainerElement.appendChild(statusSelectEl);

    var statusChoices = ["To-do", "In-progress", "Completed"];

    for (i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerElement;
};



formEl.addEventListener("submit", taskFormHandler);
