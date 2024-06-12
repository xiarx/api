import { PrismaClient } from "@prisma/client";

import type { Request, Response } from "express";

import type { Task } from "../types.js";

/**
 * @openapi
 * /users/{id}/tasks:
 *   get:
 *     description: Get all tasks for a given user
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *     responses:
 *       200:
 *         description: An array of tasks
 */
export const get = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient();

  const tasks: Task[] = await prisma.task.findMany({
    where: {
      user_id: request.params.id,
    },
  });

  response.status(200).json(JSON.stringify(tasks));
};

/**
 * @openapi
 * /users/{id}/tasks/{taskId}:
 *   get:
 *     description: Get a specific task by ID
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *         taskId: Task UUID string
 *     responses:
 *       200:
 *         description: A task object
 */
export const getById = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient();

  const task: Task = await prisma.task.findUnique({
    where: {
      user_id: request.params.id,
      id: request.params.taskId,
    },
  });

  response.status(200).json(JSON.stringify(task));
};

export interface Post {
  name: string;
  description: string;
  date_time: string;
}

/**
 * @openapi
 * /users/{id}/tasks:
 *   post:
 *     description: Create a new task for a given user
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *       - in: body
 *         schema:
 *           required:
 *             - name
 *             - description
 *             - date_time
 *           properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              date_time:
 *                type: string
 *     responses:
 *       200:
 *         description: A new task ID
 */
export const post = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient();

  // request should contain all values
  if (
    !request.body.name ||
    !request.body.description ||
    !request.body.date_time
  ) {
    response.status(400).send("Bad request");
  }

  let date: Date;

  try {
    date = new Date(request.body.date_time);
  } catch (error: unknown) {
    response.status(400).send("Bad request");
  }

  let task: Task;

  try {
    task = await prisma.task.create({
      data: {
        name: request.body.name,
        description: request.body.description,
        date_time: date,
        user_id: request.params.id,
      },
    });
  } catch (error: unknown) {
    response.status(400).send("Request failed");
  }

  response.status(200).json(JSON.stringify({ id: task.id }));
};

export interface Put {
  name?: string;
  description?: string;
  date_time?: Date;
}

/**
 * @openapi
 * /users/{id}/tasks/{taskId}:
 *   put:
 *     description: Update an existing task
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *         taskId: Task UUID string
 *       - in: body
 *         schema:
 *           properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              date_time:
 *                type: string
 *     responses:
 *       200:
 *         description: A new task ID
 */
export const put = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient();

  // request should at least contain one thing
  if (
    !request.body.name &&
    !request.body.description &&
    !request.body.date_time
  ) {
    response.status(400).send("Bad request");
  }

  const data = {} as Put;

  if (request.body.name) {
    data.name = request.body.name;
  }

  if (request.body.description) {
    data.description = request.body.description;
  }

  // if invalid date given
  if (request.body.date_time) {
    try {
      data.date_time = new Date(request.body.date_time);
    } catch (error: unknown) {
      response.status(400).send("Bad request");
    }
  }

  // if invalid user_id or task_id
  try {
    await prisma.task.update({
      where: {
        user_id: request.params.id,
        id: request.params.taskId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (error: unknown) {
    response.status(400).send("Request failed");
  }

  response.status(200).end();
};

/**
 * @openapi
 * /users/{id}/tasks/{taskId}:
 *   delete:
 *     description: Delete a task
 *     parameters:
 *       - in: path
 *         id: User UUID string
 *         taskId: Task UUID string
 *     responses:
 *       200:
 *         description: Empty
 */
export const remove = async (request: Request, response: Response) => {
  const prisma = await new PrismaClient();

  // if invalid task_id
  try {
    await prisma.task.delete({
      where: {
        id: request.params.taskId,
        user_id: request.params.id,
      },
    });
  } catch (error: unknown) {
    response.status(400).send("Request failed");
  }

  response.status(200).end();
};

export default {
  get,
  getById,
  post,
  put,
  remove,
};
