// Definición de tipos para la aplicación

export type Status = "TODO" | "INPROGRESS" | "DONE"

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: Status;
  dueDate?: string | Date; // Permitir que sea string o Date
  listId?: string;
  createdAt: string | Date; // Permitir que sea string o Date
  updatedAt: string | Date; // Permitir que sea string o Date
  isImportant?: boolean;
  isMyDay?: boolean;
  notes?: string;
  subtasks?: SubTask[];
}
  
  export interface SubTask {
    id: string
    title: string
    completed: boolean
  }
  
  export interface TaskList {
    id: string
    name: string
    description?: string
    owner: User
    tasks?: Task[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface TaskFilter {
    listId?: string
    dueDate?: Date
    completed?: boolean
    search?: string
    isImportant?: boolean
    isMyDay?: boolean
  }
  
  export interface User {
    id: string
    username: string
    email: string
  }
  