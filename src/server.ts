import express from 'express'
import helmet from 'helmet'
import compression from 'compression'

import type {Express, Request, Response, NextFunction} from 'express'

import router from './router.js'

const server: Express = express()

server.use(compression())
server.use(helmet())
server.disable('x-powered-by')

server.use(express.json({
  inflate: false,
  limit: '100kb',
  strict: true,
  type: 'application/json',
  verify: (request: Request, response: Response, buffer: Buffer, encoding: string) => {
    try {
      JSON.parse(buffer.toString())
    } catch (error: unknown) {
      response.status(400).end('Invalid JSON')
    }
  },
}))

server.use((request: Request, response: Response, next: NextFunction) => {
  if (request.query.url) {
    try {
      if (new URL(request.query.url as string).host === process.env.HOST) {
        response.redirect(request.query.url as string)
      } else {
        response.status(400).end('Invalid redirect')
      }
    } catch (error: unknown) {
      response.status(400).end('Invalid URI')
    }
  } else {
    next()
  }
})

server.use(router)

server.use((request: Request, response: Response, next: NextFunction) => {
  response.status(404).send('Not found')
})

server.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  console.error(error.stack)
  response.status(500).send('Server error')
})

export default server
