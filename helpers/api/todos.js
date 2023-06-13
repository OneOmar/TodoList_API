import { readFile, writeFile } from 'node:fs/promises'
import { NotFoundError } from './errors.js'
const path = 'data/todos.json'

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} task
 * @property {boolean} completed
 */

/**
 * @returns {Promise<Todo[]>}
 */
export async function findTodos() {
    const todos = await readFile(path, 'utf8')
    return JSON.parse(todos)
}

/**
 * @param {string} task
 * @param {boolean} completed 
 * @returns {Promise<Todo>}
 */
export async function createTodo({task, completed = false}) {
    const todo = {id: Date.now(), task, completed}
    const todos = [...await findTodos(), todo]
    await writeFile(path, JSON.stringify(todos, null, 2))
    return todo
}

/**
 * @param {number} id
 * @returns {Promise}
 */
export async function removeTodo(id) {
    const todos = await findTodos()
    const i = todos.findIndex(todo => todo.id === id)
    if (i === -1) {
        throw new NotFoundError()
    }
    const newTodos = todos.filter(todo => todo.id !== id)
    await writeFile(path, JSON.stringify(newTodos, null, 2))
}

/**
 * @param {number} id
 * @param {string} task
 * @param {boolean?} completed
 * @returns {Promise<Todo>}
 */
export async function updateTodo(id, {task, completed = false}) {
    const todos = await findTodos()
    const todo = todos.find(todo => todo.id === id)
    if (todo === undefined) {
        throw new NotFoundError()
    }
    if (task) {
    todo.task = task
    }
    todo.completed = completed
    await writeFile(path, JSON.stringify(todos, null, 2))
    return todo
}
