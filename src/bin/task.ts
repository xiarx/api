import cron from 'node-cron'
import {PrismaClient} from '@prisma/client'

cron.schedule('* * * * *', async () => {
  const prisma = await new PrismaClient

  const tasks = await prisma.task.findMany({
    where: {
      status: 'pending',
      next_execute_date: {
        lte: new Date,
      },
    },
  })

  for (const task of tasks) {
    console.log(task.name)
  }

  await prisma.task.updateMany({
    where: {
      status: 'pending',
      next_execute_date: {
        lte: new Date,
      },
    },
    data: {
      status: 'done',
    },
  })
})
