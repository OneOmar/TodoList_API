import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { json } from 'node:stream/consumers'
import { findTodos, createTodo, removeTodo, updateTodo } from './helpers/api/todos.js'
import { URL } from 'node:url'
import { NotFoundError } from './helpers/api/errors.js'

createServer(async (req, res) => {
    try {
        let id = 0
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${req.headers.host}`)
        // console.log(url)
        const endpoint = `${req.method}:${url.pathname}`
        console.log(endpoint)
        switch (endpoint) {
            case 'GET:/':
                res.setHeader('Content-Type', 'text/html')
                createReadStream('index.html').pipe(res)
                return
            case 'GET:/todos':
                const todos = await findTodos()
                res.write(JSON.stringify(todos, null, 2))
                break
            case 'POST:/todos':
                const newTodo = await createTodo(await json(req))
                // console.log(newTodo)
                res.write(JSON.stringify(newTodo, null, 2))
                break
            case 'DELETE:/todos':
                id = parseInt(url.searchParams.get('id'))
                await removeTodo(id)
                res.writeHead(204)
                break
            case 'PUT:/todos':
                id = parseInt(url.searchParams.get('id'))
                await updateTodo(id, await json(req))
                break
            default:
                res.writeHead(404)
        }
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.writeHead(404)
        } else {
            throw e
        }
    }
    res.end()
}).listen(3000)
