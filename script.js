const taskArr = [
    {
        taskName: "Complete project report",
        taskCategory: "Work",
        taskId: 1,
        taskStatus: "Pending"
    },
    {
        taskName: "Prepare for JavaScript exam",
        taskCategory: "Study",
        taskId: 2,
        taskStatus: "Pending"
    },
    {
        taskName: "Go grocery shopping",
        taskCategory: "Personal",
        taskId: 3,
        taskStatus: "Completed"
    },
    {
        taskName: "Submit assignment",
        taskCategory: "Urgent",
        taskId: 4,
        taskStatus: "Completed"
    },
    {
        taskName: "Attend team meeting",
        taskCategory: "Work",
        taskId: 5,
        taskStatus: "Completed"
    }
];

const themeBtnEle = document.querySelector('#themeBtn');
const htmlEle = document.querySelector('html')
htmlEle.setAttribute("data-theme", "dark")


const pendingCounterEle = document.querySelector('#pendingCounter');
const completedCounterEle = document.querySelector('#completedCounter')
const formEle = document.querySelector('form');
const formTaskTitleEle = document.querySelector('#taskTitle');
const formTaskCategoryEle = document.querySelector('#taskCategory')
const formTaskStatusEle = document.querySelector('#taskStatus')
const formStatusGroupEle = document.querySelector('.status-group');
const addTaskBtn = document.querySelector('#addTaskBtn')
const taskListEle = document.querySelector('#taskList');

// notification container
const notificationEle = document.querySelector('#notification')
const notificationTextEle = document.querySelector('#notificationText');
const closeNotificationBtnEle = document.querySelector('#closeNotificationBtn')

// filter button selectors
const filterButtonsEle = document.querySelector('.filter-buttons');
const filterPendingEle = document.querySelector('#filterPending');
const filterCompletedEle = document.querySelector('#filterCompleted');
const filterAllEle = document.querySelector('#filterAll');
const filterClearAllTaskEle = document.querySelector('#filterClearAllTask');

// empty state div 
const emptyStateEle = document.querySelector('#emptyState');
const emptySubtitleEle = document.querySelector('.empty-subtitle')

// Storing Variables
let taskId = taskArr[taskArr.length - 1]?.taskId || 0 // For Now i am assuming the array id are in order but if required can change the id creation logic too
let pendingTaskCounter = 0
let completedTaskCounter = 0;
let updateObj;
let updatingTheValue = false;
let filterButtonClickedValue = "All";
let theme = true

themeBtnEle.addEventListener('click', () => {
    if (theme) {
        themeBtnEle.textContent = "Dark"
        htmlEle.setAttribute("data-theme", "light")
        theme = false
    }
    else {
        themeBtnEle.textContent = "Light"
        htmlEle.setAttribute("data-theme", "dark")
        theme = true
    }
})

function updateEmptyStateVisibility(val = taskId) {
    val > 0 ? emptyStateEle.classList.add('hidden') : emptyStateEle.classList.remove('hidden')
}

updateEmptyStateVisibility()

function updatePendingTaskCount() {
    pendingTaskCounter = 0;
    taskArr.forEach((task) => {
        if (task.taskStatus === "Pending") {
            pendingTaskCounter++;
        }
    });

    pendingCounterEle.textContent = pendingTaskCounter;
    completedTaskCounter = taskArr.length - pendingTaskCounter
    completedCounterEle.textContent = completedTaskCounter;
}

function notificationAlert(task, text) {
    notificationEle.classList.remove('hidden')
    notificationTextEle.textContent = `${task.taskName} is ${text} Succesfully`
    setTimeout(() => {
        notificationEle.classList.add('hidden')
    }, 3000)
}

closeNotificationBtnEle.addEventListener('click', () => {
    notificationEle.classList.add('hidden')
})

function renderTasks() {
    taskListEle.innerHTML = "";
    taskArr.forEach((ele) => {
        if (filterButtonClickedValue === "All" || ele.taskStatus === filterButtonClickedValue) {
            creatingTaskItems(ele);
        }
    });

    updatePendingTaskCount();

    // Update empty state dynamically based on what's showing
    if (filterButtonClickedValue === "All") {
        updateEmptyStateVisibility(taskArr.length);
    } else if (filterButtonClickedValue === "Pending") {
        updateEmptyStateVisibility(pendingTaskCounter);
    } else {
        updateEmptyStateVisibility(completedTaskCounter);
    }
}

function creatingTaskItems(eachTask) {
    if (eachTask.taskName.trim() === "" || eachTask.taskCategory.trim() === "") return

    const taskItem = document.createElement('div');
    // can use set attribute,dataset to add the attributes but dataset is used only to add the data attributs whereas setAttritbe can be used to add any attribute
    taskItem.setAttribute("data-id", eachTask.taskId); // setting the data-id using setAttritbute
    taskItem.dataset.taskCategory = eachTask.taskCategory // setting the data-id using dataset
    taskItem.dataset.taskStatus = eachTask.taskStatus

    if (eachTask.taskStatus === "Completed") {
        taskItem.classList.add("completed")
    }

    taskItem.classList.add('task-item')

    const taskContentWrapperEle = document.createElement('div');
    taskContentWrapperEle.classList.add('task-content-wrapper');

    const taskStatusBtn = document.createElement('button');
    taskStatusBtn.classList.add('task-status-btn')

    taskStatusBtn.addEventListener('click', (event) => {
        console.log(event, eachTask)
        const isChecked = taskStatusBtn.classList.toggle('checked');
        const status = isChecked ? "Completed" : "Pending";
        taskItem.dataset.taskStatus = status;

        const foundTask = taskArr.find((task) => task.taskId === eachTask.taskId);

        if (foundTask) {
            foundTask.taskStatus = status;
        }

        renderTasks()

        if (status === "Completed" && filterButtonClickedValue !== "All") {
            notificationAlert(eachTask, `Moved To ${status}`);
        } else if (status === "Pending" && filterButtonClickedValue !== "All") {
            notificationAlert(eachTask, `Moved To ${status}`);
        }

    });


    if (taskItem.getAttribute('data-task-status') === "Completed") {
        taskStatusBtn.classList.add('checked')
    }

    // status icon
    const taskStatusIcon = document.createElement('i');
    taskStatusIcon.classList.add('fa-solid', 'fa-check');

    taskStatusBtn.appendChild(taskStatusIcon) // use of appendChild -- it only accept one element

    // task-details
    const taskDetailsEle = document.createElement('div');
    taskDetailsEle.classList.add('task-details');

    // task title
    const taskTitleEle = document.createElement('span');
    taskTitleEle.classList.add('task-title');
    const taskTitleEleText = document.createTextNode(`${eachTask.taskName}`)

    taskTitleEle.append(taskTitleEleText)
    // task category
    const taskCategoryEle = document.createElement('span');
    taskCategoryEle.classList.add('task-category-badge');
    taskCategoryEle.textContent = `${eachTask.taskCategory}`


    taskDetailsEle.append(taskTitleEle, taskCategoryEle); // use of append -- it only accept mulitple elements
    taskContentWrapperEle.append(taskStatusBtn);
    taskStatusBtn.after(taskDetailsEle); // use of after
    /*before() works similarly to after(), but the difference is where the element is inserted
            before() adds the new element before the existing element as its sibling.
            after() adds the new element after the existing element as its sibling.*/

    taskItem.append(taskContentWrapperEle)

    // right section - task action

    const taskActionEle = document.createElement('div');
    taskActionEle.classList.add('task-actions');

    // edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("task-action-btn", "edit-btn");
    editBtn.title = "Edit Task";
    editBtn.addEventListener('click', () => {
        updateObj = taskArr.find((task) => task.taskId === eachTask.taskId)
        if (updateObj !== undefined) {
            formStatusGroupEle.style.display = "flex";
            formTaskTitleEle.focus()
            formTaskTitleEle.value = updateObj.taskName
            formTaskCategoryEle.value = updateObj.taskCategory
            formTaskStatusEle.value = updateObj.taskStatus
            addTaskBtn.querySelector('span').textContent = "Update"
            addTaskBtn.querySelector('i').classList.remove('fa-plus')
            addTaskBtn.querySelector('i').classList.add('fa-pen');
            updatingTheValue = true
        }
    })

    // edit icon
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen");

    editBtn.append(editIcon);

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("task-action-btn", "delete-btn");
    deleteBtn.title = "Delete Task";

    deleteBtn.addEventListener('click', () => {
        let deleteIndex = taskArr.findIndex((task) => task.taskId === eachTask.taskId)

        if (deleteIndex === -1) return

        notificationAlert(taskArr[deleteIndex], "Deleted");
        taskArr.splice(deleteIndex, 1)
        renderTasks()
        if (updatingTheValue && updateObj.taskId === eachTask.taskId) {
            formStatusGroupEle.style.display = "none";
            updatingTheValue = false
            formEle.reset()
            addTaskBtn.querySelector('span').textContent = "Add Task"
            addTaskBtn.querySelector('i').classList.add('fa-plus')
            addTaskBtn.querySelector('i').classList.remove('fa-pen');
        }
    })

    // delete icons
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");

    deleteBtn.append(deleteIcon);

    taskActionEle.append(deleteBtn);
    deleteBtn.before(editBtn) //  use of before
    /* before() works similarly to append(), but the difference is where the element is inserted
            append() adds the new element inside the parent, at the end.
            before() adds the new element before the existing element as its sibling. */
    taskItem.append(taskActionEle)
    taskListEle.append(taskItem)
}

taskArr.forEach((task) => {
    creatingTaskItems(task)
})

updatePendingTaskCount()

formEle.addEventListener('submit', (event) => {
    event.preventDefault()
    let taskName = event.target[0].value;
    /*
    getting the value from getAttribute
        let taskNaam =  event.target[0].getAttribute('value') 
        it gives empty "" as the value is picked from the tag not the user entered value 
        console.log(taskNaam)
    */
    let taskCategory = event.target[1].value

    if (taskName.trim() === "" || taskCategory.trim() === "") {
        alert('Title Cant be Empty')
        event.target[0].value = "";
        return
    }

    if (!updatingTheValue) {
        taskId++
        let taskStatus = "Pending"
        let obj = {
            taskName,
            taskCategory,
            taskStatus,
            taskId
        }
        taskArr.push(obj)
        creatingTaskItems(obj);
        filterAllEle.click()
        updatePendingTaskCount()
        notificationAlert(obj, "Added")
    } else {
        let findTask = taskArr.find((task) => task.taskId === updateObj.taskId);
        let taskStatus = event.target[2].value

        if (findTask) {
            findTask.taskName = taskName;
            findTask.taskCategory = taskCategory;
            findTask.taskStatus = taskStatus;
            findTask.taskId = updateObj.taskId;
            notificationAlert(findTask, "Updated")
        }

        updatingTheValue = false
        formStatusGroupEle.style.display = "none";
        addTaskBtn.querySelector('span').textContent = "Add Task"
        addTaskBtn.querySelector('i').classList.add('fa-plus')
        addTaskBtn.querySelector('i').classList.remove('fa-pen');
        renderTasks()

    }
    formEle.reset()
})

function filterTasksByStatus(status) {
    taskListEle.innerHTML = ""
    taskArr.forEach((ele) => {
        if (ele.taskStatus === status) {
            creatingTaskItems(ele)
        }
        else if (status === "All") {
            creatingTaskItems(ele)
        }
    })
}


// Event Delegation is used here
filterButtonsEle.addEventListener('click', (event) => {
    if (event.target !== filterAllEle && event.target !== filterPendingEle && event.target !== filterCompletedEle && event.target !== filterClearAllTaskEle) return
    filterButtonClickedValue = event.target.textContent.trim();
    if (filterButtonClickedValue === "All") {
        updateEmptyStateVisibility(taskArr.length);
    } else if (filterButtonClickedValue === "Pending") {
        updateEmptyStateVisibility(pendingTaskCounter);
    } else if (filterButtonClickedValue === "Clear Task") {
        formEle.reset();
        if (updatingTheValue) {
            formStatusGroupEle.style.display = "none";
            updatingTheValue = false
            addTaskBtn.querySelector('span').textContent = "Add Task"
            addTaskBtn.querySelector('i').classList.add('fa-plus')
            addTaskBtn.querySelector('i').classList.remove('fa-pen');
        }
        taskArr.length = 0
        renderTasks()
    }
    else {
        updateEmptyStateVisibility(completedTaskCounter);
    }

    filterButtonsEle.querySelectorAll('button').forEach((button) => {
        button.classList.remove('active');
    });

    event.target.classList.add('active');
    filterTasksByStatus(filterButtonClickedValue);
});

/*

----------event bubbling and capturing

const eventGrandParentEle = document.querySelector('#eventGrandParent')
const eventParentEle = document.querySelector('#eventParent');
const eventChildEle = document.querySelector('#eventChild')


eventGrandParentEle.addEventListener('click', () => {
    console.log('Grand Parent Triggered')
})

eventParentEle.addEventListener('click', () => {
    console.log('Parent Triggered')
})

eventChildEle.addEventListener('click', () => {
    console.log('*******Event Bubbling**********')
    console.log('Child Triggered')
})


----------event capturing is opposite of this where we need to pass true as the third argument

eventGrandParentEle.addEventListener('click', () => {
    console.log('*****Event Capturing***********')

    console.log('Grand Parent Triggered')
}, true)

eventParentEle.addEventListener('click', () => {
    console.log('Parent Triggered')
}, true)

eventChildEle.addEventListener('click', () => {
    console.log('Child Triggered')
}, true)

*/