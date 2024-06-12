import {PrismaClient} from '@prisma/client'

import type {Request, Response} from 'express'

import type {User} from '../types.js'

/**
 * @openapi
 * /users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: An array of all users
 */
export const get = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const users: User[] = await prisma.user.findMany()

  response.status(200).json(JSON.stringify(users))
}

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *     responses:
 *       200:
 *         description: A User object
 */
export const getById = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const user: User = await prisma.user.findUnique({
    where: {
      id: request.params.id,
    },
  })

  response.status(200).json(JSON.stringify(user))
}

export interface Post {
  username: string
  first_name: string
  last_name: string
}

/**
 * @openapi
 * /users:
 *   post:
 *     description: Create a new user
 *     parameters:
 *       - in: body
 *         schema:
 *           required:
 *             - username
 *             - first_name
 *             - last_name
 *           properties:
*              username:
*                type: string
*              first_name:
*                type: string
*              last_name:
*                type: string
 *     responses:
 *       200:
 *         description: Empty
 */
export const post = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  // request should contain all values
  if (!request.body.username || !request.body.first_name || !request.body.last_name) {
    response.status(400).send('Bad request')
  }

  let user: User

  try {
    user = await prisma.user.create({
      data: {
        username: request.body.username,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
      },
    })
  } catch (error: unknown) {
    response.status(400).send('Request failed')
  }

  response.status(200).json(JSON.stringify({id: user.id}))
}

export interface Put {
  username?: string
  first_name?: string
  last_name?: string
}

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     description: Update an existing user
 *     parameters:
 *       - in: path
 *         id: A user UUID string
 *       - in: body
 *         schema:
 *           properties:
*              username:
*                type: string
*              first_name:
*                type: string
*              last_name:
*                type: string
 *     responses:
 *       200:
 *         description: Empty
 */
export const put = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  // request should contain at least 1 value
  if (!request.body.username && !request.body.first_name && !request.body.last_name) {
    response.status(400).send('Bad request')
  }

  const data = {} as Put

  if (request.body.username) {
    data.username = request.body.username
  }

  if (request.body.first_name) {
    data.first_name = request.body.first_name
  }

  if (request.body.last_name) {
    data.last_name = request.body.last_name
  }

  // if invalid user_id
  try {
    await prisma.user.update({
      where: {
        id: request.params.id,
      },
      data: {
        ...data,
        updatedAt: new Date,
      },
    })
  } catch (error: unknown) {
    response.status(400).send('Request failed')
  }

  response.status(200).end()
}

export default {
  get, getById, post, put
}
