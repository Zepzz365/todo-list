import { addTodoToLocal, createTodoObj, updateTodo, getTodosByProject, deleteTodo } from "./data";

const content = document.querySelector("#content")
const projectButtons = document.querySelector("#projectButtons")

const form = document.querySelector("form")
const formProj = form.querySelector("#todo-proj");
const formTitle = form.querySelector("#todo-name");
const formDesc = form.querySelector("#todo-desc");
const formPri = form.querySelector("#todo-pri");
const formDue = form.querySelector("#todo-date");

const newProj = document.querySelector("#new-project")
const newTodo = form.querySelector("#send-todo")
const cancelForm = form.querySelector("#cancel-todo")

const template = document.querySelector("#template-todo");
const editForm = document.querySelector("#edit-form")
const editProj = editForm.querySelector("#edit-todo-proj");
const editTitle = editForm.querySelector("#edit-todo-name");
const editDesc = editForm.querySelector("#edit-todo-desc");
const editPri = editForm.querySelector("#edit-todo-pri");
const editDue = editForm.querySelector("#edit-todo-date");
const sendEdit = editForm.querySelector("#send-edit");
const cancelEdit = editForm.querySelector("#cancel-edit");

const SYSTEM_PROJECTS = ["today", "tomorrow", "week", "completed"];

//adds todo to page, adds event listener to checkbox, edit, delete
export function addTodoToPage(todo, beforeNode = null){
    const clonetemp = template.content.cloneNode(true);
    const clone = clonetemp.querySelector(".todo"); 
    clone.id = todo.id


    clone.querySelector(".todo-name").textContent = todo.title;
    clone.querySelector(".todo-pri").textContent = todo.pri;
    clone.querySelector(".todo-due").textContent = todo.due;
    clone.querySelector(".todo-desc").textContent = todo.desc;

    if (!beforeNode) beforeNode = content.firstChild; 
    content.insertBefore(clone, beforeNode);

    const cloneCheckbox = clone.querySelector('input[type="checkbox"]');
    cloneCheckbox.checked = todo.completed;
    cloneCheckbox.addEventListener("change", () => {
        const updatedTodo = { ...todo, completed: !todo.completed }
        updateTodo(todo.id, updatedTodo)
        projectButtons.querySelector(`#${todo.proj}`).click()
    });

    const editButton = clone.querySelector(".todo-edit")
    editButton.addEventListener("click", ()=>{
        openEditForm(todo)
    })

    const delButton = clone.querySelector(".todo-del")
    delButton.addEventListener("click", ()=>{
        clone.remove()
        deleteTodo(todo.id)
    })
}


let currentTodo = null;


newTodo.addEventListener("click" , ()=>{
    const proj = formProj.value
    const title = formTitle.value
    const desc = formDesc.value
    const pri = formPri.value
    const due = formDue .value
    const todo = createTodoObj(proj,title, desc, pri, due)
    addTodoToLocal(todo)
    projectButtons.querySelector(`[id='${proj}']`).click()
})

//if cancel edit is clicked, forgets about old todo, and clears input, hides edit form
cancelEdit.addEventListener("click", () => {
    editForm.classList.add("hidden");
    document.body.style.pointerEvents = "auto"; 
    editForm.style.pointerEvents = "none"; 
    editProj.value = "all";
    editTitle.value = "";
    editDesc.value = "";
    editPri.value = "";
    editDue.value = "";
    currentTodo = null;
});


//if clicked, updates todo, and hides edit form
sendEdit.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.style.pointerEvents = "auto"; 
    editForm.style.pointerEvents = "none"; 
    if (!currentTodo) return;
    const updatedTodo = {
        ...currentTodo,
        proj: editProj.value,
        title: editTitle.value,
        desc: editDesc.value,
        pri: editPri.value,
        due: editDue.value
    };
    updateTodo(currentTodo.id, updatedTodo);

    const oldNode = document.querySelector(`[id='${currentTodo.id}']`);
    const prevNode = oldNode.previousSibling;
    oldNode.remove();
    addTodoToPage(updatedTodo, prevNode?.nextSibling);
    editForm.classList.add("hidden");
    currentTodo = null;
    projectButtons.querySelector(`#${updatedTodo.proj}`).click()


});


//shows edit form and fills with todos properties
export function openEditForm(todo){
    currentTodo = todo;
    editForm.classList.remove("hidden")
    editProj.value = todo.proj;
    editTitle.value = todo.title;
    editDesc.value = todo.desc;
    editPri.value = todo.pri;
    editDue.value = todo.due;
    document.body.style.pointerEvents = "none"; 
    editForm.style.pointerEvents = "auto"; 
}


//clears the main form
cancelForm.addEventListener("click", () => {
    formProj.value = "all";
    formTitle.value = "";
    formDesc.value = "";
    formPri.value = "p1"; // default
    formDue.value = "";
    
})


//adds project to project options
const newProjectName = document.querySelector("#new-project-name")
newProj.addEventListener("click" , (e)=>{
    const project_name = newProjectName.value
    addProjectOption(project_name)
    addProjectObject(project_name)
})
 //adds project to project inputs options
export function addProjectOption(project_name){
    if(SYSTEM_PROJECTS.includes(project_name)) {
        return}

    const newProj = document.createElement("option")
    newProj.textContent = project_name
    newProj.value = project_name
    newProj.id = project_name
    formProj.append(newProj)
    const editOption = document.createElement("option")
    editOption.textContent = project_name
    editOption.value = project_name
    editOption.id = project_name
    editProj.append(editOption)
}
 //adds project to project buttons
export function addProjectObject(project_name){
    const newProjObj = document.createElement("button")
    newProjObj.textContent = project_name
    newProjObj.value = project_name
    newProjObj.id = project_name
    newProjObj.type = "button"
    const newDel = document.createElement("button")
    newDel.type = "button"
    newDel.textContent = "x"
    const newProjDiv = document.createElement("div")
    if(SYSTEM_PROJECTS.includes(project_name) || project_name == "all"){
        newProjDiv.append(newProjObj)
        projectButtons.append(newProjDiv)
        return
    }
    newProjDiv.append(newProjObj, newDel)
    newDel.addEventListener("click" , ()=>{
        delProjectOption(project_name)
        delProjectButton(project_name)
    })
    projectButtons.append(newProjDiv)
}
//deletes a project object with id/name
export function delProjectOption(project_name) {
    const delObj = formProj.querySelector(`option[value='${project_name}']`);
    if (delObj) delObj.remove();

    const editObj = editProj.querySelector(`option[value='${project_name}']`);
    if (editObj) editObj.remove();
}
//deletes a project button with id/name
export function delProjectButton(project_name){
    const delObj = projectButtons.querySelector(`[value='${project_name}']`);
    const div = delObj.closest("div")
    div.remove()
}


const activeproj = document.querySelector("#active-project")
//if a project button is pushed, changes content, changes form projects value
projectButtons.addEventListener("click", (e)=>{
    const button = e.target.closest("button"); // closest ile butonu bul
    if (!button) return; // eğer button yoksa çık
    const project_name = button.value; // value kullan

    content.textContent = ""
    const todosList = getTodosByProject(project_name)
    for(const todo of todosList){
        addTodoToPage(todo)
    }
    activeproj.textContent = project_name

    if (SYSTEM_PROJECTS.includes(project_name)) {
        formProj.value = "all"; 
    } else {
        formProj.value = project_name; 
    }

    const allProjectDivs = projectButtons.querySelectorAll("button");
    allProjectDivs.forEach(div => div.style.border = "2px solid transparent");
    button.style.border = "2px solid black";

})

