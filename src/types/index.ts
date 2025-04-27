// Definición de tipos para la aplicación

export interface Task {
    id: string
    title: string
    description?: string
    completed: boolean
    dueDate?: Date
    listId?: string
    createdAt: Date
    updatedAt: Date
    isImportant?: boolean
    isMyDay?: boolean
    notes?: string
    subtasks?: SubTask[]
  }
  
  export interface SubTask {
    id: string
    title: string
    completed: boolean
  }
  
  export interface TaskList {
    id: string
    name: string
    color?: string
    icon?: string
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
    name: string
    email: string
    avatar?: string
  }
  