import express from 'express'
import swaggerUI from 'swagger-ui-express'

import type {Router} from 'express'

import swaggerDoc from './swagger.js'
import users from './routes/users.js'
import tasks from './routes/tasks.js'

const router: Router = express.Router()

router.use('/v1', swaggerUI.serve)
router.get('/v1', swaggerUI.setup(swaggerDoc, {explorer: true}))

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
