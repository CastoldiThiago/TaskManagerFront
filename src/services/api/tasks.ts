// Servicios específicos para tareas
import apiClient from "./client"
import type { Task, TaskFilter } from "../../types"

// Tipos de respuesta para las funciones
interface ApiResponse<T> {
  data: T
  message?: string
}

// Funciones para operaciones con tareas
export const taskService = {
  // Obtener todas las tareas con filtros opcionales
  async getTasks(filters?: TaskFilter): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.listId) params.append("listId", filters.listId.toString())
      if (filters.dueDate) params.append("dueDate", filters.dueDate.toISOString())
      if (filters.completed !== undefined) params.append("completed", filters.completed.toString())
    }

    const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`)
    return response.data
  },

  // Obtener tareas para "Mi Día"
  async getMyDayTasks(): Promise<ApiResponse<Task[]>> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks/my-day")
    return response.data
  },

  // Obtener una tarea específica
  async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`)
    return response.data
  },

  // Crear una nueva tarea
  async createTask(task: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", task)
    return response.data
  },

  // Actualizar una tarea existente
  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, updates)
    return response.data
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`)
    return response.data
  },

  // Marcar una tarea como completada
  async completeTask(id: string, completed = true): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/complete`, { completed })
    return response.data
  },

  // Obtener tareas para la vista de calendario
  async getCalendarTasks(startDate: Date, endDate: Date): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })

    const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks/calendar?${params.toString()}`)
    return response.data
  },
}
