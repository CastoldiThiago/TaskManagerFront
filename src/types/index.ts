// Definición de tipos para la aplicación

export type Status = "TODO" | "IN_PROGRESS" | "DONE"

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: Status;
  dueDate?: string | Date; // Permitir que sea string o Date
  listId?: string;
  createdAt: string | Date; // Permitir que sea string o Date
  updatedAt?: string | Date; // Permitir que sea string o Date
  movedToMyDay?: boolean;
  movedDate?: string;
}

export interface CreateTask {
  title: string;
  description?: string | null;
  status?: Status;
  dueDate?: string | Date | null;
  listId?: string | null;
  movedToMyDay?: boolean;
  movedDate?: string | Date | null;
}
  
export interface TaskList {
  id: string
  name: string
  description?: string
}

export interface TaskListComplete {
  id: string
  name: string
  description?: string
  tasks?: Task[]
  createdAt: Date
  updatedAt: Date
}
  
export interface TaskFilter {
  listId?: string
  dueDate?: Date
  status?: Status
  search?: string
  isMyDay?: boolean
}

export interface User {
  id: string
  username: string
  email: string
}
  