import React from "react"
// Servicios específicos para listas de tareas
import apiClient from "./client"
import type { TaskList, TaskListComplete } from "../../types"

interface ApiResponse<T> {
  data: T
  message?: string
}

export const listService = {
  // Obtener todas las listas
  async getLists(): Promise<TaskList[]> {
    const response = await apiClient.get<TaskList[]>("/task-lists")
    return response.data
  },

  // Obtener una lista específica con sus tareas
  async getList(id: string | undefined): Promise<TaskListComplete> {
    const response = await apiClient.get<TaskListComplete>(`/task-lists/${id}`)
    return response.data
  },

  // Crear una nueva lista
  async createList(list: Partial<TaskList>): Promise<TaskList> {
    const response = await apiClient.post<TaskList>("/task-lists", list)
    return response.data
  },

  // Actualizar una lista existente
  async updateList(id: string, updates: Partial<TaskList>): Promise<TaskList> {
    const response = await apiClient.patch<TaskList>(`/task-lists/${id}`, updates)
    return response.data
  },

  // Eliminar una lista
  async deleteList(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/task-lists/${id}`)
    return response.data
  },
}
