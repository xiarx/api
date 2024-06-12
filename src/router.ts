import express from 'express'

import type {Router, Request, Response} from 'express'

import users from './routes/users.js'
import tasks from './routes/tasks.js'

const router: Router = express.Router()

// User
router.get('/users', users.get)
router.get('/users/:id', users.getById)
router.post('/users', users.post)
router.put('/users/:id', users.put)

// Task
router.get('/users/:id/tasks', tasks.get)
router.get('/users/:id/tasks/:taskId', tasks.getById)
router.post('/users/:id/tasks', tasks.post)
router.put('/users/:id/tasks/:taskId', tasks.put)
router.delete('/users/:id/tasks/:taskId', tasks.remove)

export default router
