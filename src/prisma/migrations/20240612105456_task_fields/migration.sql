-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "next_execute_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
