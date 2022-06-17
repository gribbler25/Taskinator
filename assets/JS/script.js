var taskIdCounter = 0; //initial counter value, used to unique-id tasks as they're created
var formEl = document.querySelector("#task-form")//<form> element js var
var tasksToDoEl = document.querySelector("#tasks-to-do");//<ul> element in todo section js var
var pageContentEl = document.querySelector("#page-content");//<main> section set to a js var
var tasksInProgressEl = document.querySelector("#tasks-in-progress");//<ul> element in progress setion js var
var tasksCompletedEl = document.querySelector("#tasks-completed");//<ul> element in completed section js var

var tasks = [];

//run this when submit button pushed...
var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name= 'task-name']").value;
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("First first fill out the task form!");
        return false;
    }
    //formEl.reset();

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    var isEdit = formEl.hasAttribute("data-task-id");

    //handle edit content in the form
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //handle if new list item
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        console.log(taskDataObj);
        console.log(taskDataObj.status);

        createTaskEl(taskDataObj);
    }
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
    listItemEl.appendChild(taskInfoEl);

    //add .id property:value to the dataObject in formHandler/push to the cooresponding 'tasks' array of objects..it's a dynamic value, though..
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    //create the task action buttons for task..
    var taskActionsEl = createTaskActions(taskIdCounter);  //createTaskActions function over the current taskIdCountervalue..returns as <div>
    listItemEl.appendChild(taskActionsEl);//append the <div> with the buttons created to the <li>
    tasksToDoEl.appendChild(listItemEl);//append the <li> to the tasks-to-do <ul>

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
    //a container to hol elements..
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button..
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn"
    editButtonEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(editButtonEl);

    //create delete button..
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    //create status change dropdown <select>
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "change-status")
    statusSelectEl.setAttribute("data-task-id", taskId)
    actionContainerEl.appendChild(statusSelectEl);

    //for loop over an array to finish creating the <option> choices
    var statusChoices = ["To-do", "In-progress", "Completed"];

    for (i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};


var taskButtonHandler = function (event) {
    targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);

    }
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//complete edited task, put back onto list
var completeEditTask = function (taskName, taskType, taskId) {
    //find task list item with taskId value..
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values..
    taskSelected.querySelector("span.task-type").textContent = taskType;
    taskSelected.querySelector("h3.task-name").textContent = taskName;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("task updated!");
    //remove data attribute from the form
    formEl.removeAttribute("data-task-id");
    //update form button to go back to reading'Add Task'.
    document.querySelector("#save-task").textContent = "Add Task";

};

//function to delete task
var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskId + "']");
    taskSelected.remove();
    //create new array to hold updated list of tasks..
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be thne same as updatedArr(which doesn't include deleted Obj anymore)
    tasks = updatedTaskArr;
};
//function to edit task
var editTask = function (taskId) {
    console.log(taskId);
    //get task list item element 
    var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskId + "']");
    //get content from task name and type below..
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);
    //write value to teh form to be edited
    document.querySelector("input[name='task-name']").value = taskName;


    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);
    //write value to the form to be edited..
    document.querySelector("select[name='task-type']").value = taskType;
    //**set data attribute to the form with task id vaue so it knows which one is being edited(used also as a boolean later..) */
    formEl.setAttribute("data-task-id", taskId);
    //update form button to reflect editing task with "Save"(instead of add task)
    formEl.querySelector("#save-task").textContent = "Save Task";

};

//debugger;
var taskStatusChangeHandler = function (event) {

    console.log(event.target.value);

    // get the task list item's id based on the .target's data-task-id attr
    var taskId = event.target.getAttribute("data-task-id");

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    if (statusValue === "to-do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in-progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
};

formEl.addEventListener("submit", taskFormHandler);//event handler, listens for the submit button or enter on the form element key to run taskFormHandler function
pageContentEl.addEventListener("click", taskButtonHandler);//listens for a 'click' on the ,<main> section to run the fxn
pageContentEl.addEventListener("change", taskStatusChangeHandler);//listens for any change to elements in <main> section to run the fxn