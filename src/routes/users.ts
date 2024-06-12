import {PrismaClient} from '@prisma/client'

import type {Request, Response} from 'express'

export const get = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const users = await prisma.user.findMany()

  response.status(200).json(JSON.stringify(users))
}

export const getById = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const user = await prisma.user.findUnique({
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

export const post = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  if (!request.body.username || !request.body.first_name || !request.body.last_name) {
    response.status(400).send('Bad request')
  }

  let user

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

export const put = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

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
