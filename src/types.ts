export interface User {
  id: string
  createdAt: Date
  updatedAt: Date
  username: string
  first_name: string
  last_name: string
}

export interface Task {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  date_time: Date
  status: string
  next_execute_date: Date
  user_id: string
}
