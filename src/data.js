import { parseISO, isSameDay, isWithinInterval, addDays, startOfDay } from 'date-fns';
import { addProjectObject, addProjectOption } from './ui';

const PROJECTS_KEY = 'projects';
const TODOS_KEY = 'allTodo';

// data.js
localStorage.clear()

document.addEventListener("DOMContentLoaded", () => {
    // localStorage temizle test için
    localStorage.clear();

    const PROJECTS_KEY = 'projects';
    const TODOS_KEY = 'allTodo';

    let projects;
    if (!localStorage.getItem(PROJECTS_KEY)) {
        projects = ["all", "proj", "today","tomorrow", "week", "completed"];
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

    projects = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    for (const project of projects) {
        console.log("eklendi:", project);
        addProjectObject(project);
        addProjectOption(project);
    }

    const allButton = document.querySelector("#projectButtons  #all");
    if (allButton) allButton.click();

    if (!localStorage.getItem(TODOS_KEY)) {
        localStorage.setItem(TODOS_KEY, JSON.stringify([]));
    }
});


//return an array of projects
export function getProjects(){
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []
}

//return an array of all todos
export function getAllTodos(){
    return JSON.parse(localStorage.getItem(TODOS_KEY)) || []
}

//return an array of todos with a specific project 
export function getTodosByProject(project_name){
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const weekEnd = addDays(today, 6);
    const allTodo = getAllTodos();
    let todosList
    if(project_name === "today"){
        todosList = allTodo.filter(task => isSameDay(parseISO(task.due), today) && !task.completed);
    } else if(project_name === "tomorrow") {
        todosList = allTodo.filter(task => isSameDay(parseISO(task.due), tomorrow) && !task.completed);
    } else if(project_name === "week") {
        todosList = allTodo.filter(task => {
            const due = parseISO(task.due);
            return isWithinInterval(due, { start: today, end: weekEnd }) && !task.completed;
        });
    } else if (project_name === "all"){
        todosList = allTodo.filter(task => !task.completed)
    }else if (project_name === "completed"){
        todosList = allTodo.filter(task => task.completed);
    } else {
        todosList = allTodo.filter(task => task.proj === project_name && !task.completed);
    }
    return todosList
}

//creates todo object
export function createTodoObj(proj,title, desc, pri, due){
    const id = crypto.randomUUID();
    return {id,proj,title, desc, pri, due, completed:false}
}

//add todo obj to local storage
export function addTodoToLocal(todo){
    const todosList = JSON.parse(localStorage.getItem(TODOS_KEY));
    todosList.push(todo);
    localStorage.setItem(TODOS_KEY, JSON.stringify(todosList));
}

//add project name to local storage
export function createProjObj(project_name){
    if(projectExists(project_name)) return
    const projList = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    projList.push(project_name);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projList));
}


//delete todo by id
export function deleteTodo(id){
    var todosList = getAllTodos()
    todosList = todosList.filter(todo => todo.id !== id)
    localStorage.setItem(TODOS_KEY, JSON.stringify(todosList))
}

//delete project by name
export function deleteProj(project_name){
    if(!projectExists(project_name)) return;
    const projectList = getProjects().filter(project => project !== project_name)
    const todoList = getAllTodos().filter(todo => todo.proj !== project_name)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectList))
    localStorage.setItem(TODOS_KEY, JSON.stringify(todoList))
}

//check if the project exists
export function projectExists(name){
    const projects = getProjects();
    return projects.includes(name);
}

//update todo 
export function updateTodo(id, updatedTodo){
    const todos = getAllTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if(index === -1) return null;

    todos[index] = updatedTodo; 
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

