import {PrismaClient} from '@prisma/client'

import type {Request, Response} from 'express'

export const get = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const tasks = await prisma.task.findMany({
    where: {
      user_id: request.params.id,
    },
  })

  response.status(200).json(JSON.stringify(tasks))
}

export const getById = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  const task = await prisma.task.findUnique({
    where: {
      user_id: request.params.id,
      id: request.params.taskId,
    },
  })

  response.status(200).json(JSON.stringify(task))
}

export interface Post {
  name: string
  description: string
  date_time: string
}

export const post = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  if (!request.body.name || !request.body.description || !request.body.date_time) {
    response.status(400).send('Bad request')
  }

  let date: Date

  try {
    date = new Date(request.body.date_time)
  } catch (error: unknown) {
    response.status(400).send('Bad request')
  }

  let task

  try {
    task = await prisma.task.create({
      data: {
        name: request.body.name,
        description: request.body.description,
        date_time: date,
        user_id: request.params.id,
      },
    })
  } catch (error: unknown) {
    response.status(400).send('Request failed')
  }

  response.status(200).json(JSON.stringify({id: task.id}))
}

export interface Put {
  name?: string
  description?: string
  date_time?: Date
}

export const put = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  if (!request.body.name && !request.body.description && !request.body.date_time) {
    response.status(400).send('Bad request')
  }

  const data = {} as Put

  if (request.body.name) {
    data.name = request.body.name
  }

  if (request.body.description) {
    data.description = request.body.description
  }

  if (request.body.date_time) {
    try {
      data.date_time = new Date(request.body.date_time)
    } catch (error: unknown) {
      response.status(400).send('Bad request')
    }
  }

  try {
    const task = await prisma.task.update({
      where: {
        user_id: request.params.id,
        id: request.params.taskId,
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

export const remove = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient

  try {
    await prisma.task.delete({
      where: {
        id: request.params.taskId,
        user_id: request.params.id,
      },
    })
  } catch (error: unknown) {
    response.status(400).send('Request failed')
  }

  response.status(200).end()
}

export default {
  get, getById, post, put, remove
}
