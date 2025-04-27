import React from "react"
// Servicios específicos para listas de tareas
import apiClient from "./client"
import type { TaskList } from "../../types"

interface ApiResponse<T> {
  data: T
  message?: string
}

export const listService = {
  // Obtener todas las listas
  async getLists(): Promise<ApiResponse<TaskList[]>> {
    const response = await apiClient.get<ApiResponse<TaskList[]>>("/lists")
    return response.data
  },

  // Obtener una lista específica con sus tareas
  async getList(id: string): Promise<ApiResponse<TaskList>> {
    const response = await apiClient.get<ApiResponse<TaskList>>(`/lists/${id}`)
    return response.data
  },

  // Crear una nueva lista
  async createList(list: Partial<TaskList>): Promise<ApiResponse<TaskList>> {
    const response = await apiClient.post<ApiResponse<TaskList>>("/lists", list)
    return response.data
  },

  // Actualizar una lista existente
  async updateList(id: string, updates: Partial<TaskList>): Promise<ApiResponse<TaskList>> {
    const response = await apiClient.patch<ApiResponse<TaskList>>(`/lists/${id}`, updates)
    return response.data
  },

  // Eliminar una lista
  async deleteList(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/lists/${id}`)
    return response.data
  },
}
