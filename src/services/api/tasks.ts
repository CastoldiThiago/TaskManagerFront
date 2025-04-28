import apiClient from "./client";
import type { Status, Task, TaskFilter } from "../../types";

export const taskService = {
  // Obtener todas las tareas con filtros opcionales
  async getTasks(filters?: TaskFilter): Promise<Task[]> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.listId) params.append("listId", filters.listId.toString());
      if (filters.dueDate) params.append("dueDate", filters.dueDate.toISOString());
      if (filters.completed !== undefined) params.append("completed", filters.completed.toString());
    }

    const response = await apiClient.get<Task[]>(`/tasks?${params.toString()}`);
    return response.data; // Devuelve directamente el array de tareas
  },

  // Obtener tareas para "Mi Día"
  async getMyDayTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>("/tasks/my-day");
    return response.data; // Devuelve directamente el array de tareas
  },

  // Obtener una tarea específica
  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data; // Devuelve directamente la tarea
  },

  // Crear una nueva tarea
  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await apiClient.post<Task>("/tasks", task);
    return response.data; // Devuelve directamente la tarea creada
  },

  // Actualizar una tarea existente
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, updates);
    return response.data; // Devuelve directamente la tarea actualizada
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete<void>(`/tasks/${id}`);
  },

  // Cambiar el estado de una tarea
  async changeStateTask(id: string, state: Status): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}/state`, { state });
    return response.data; // Devuelve directamente la tarea actualizada
  },

  // Obtener tareas para la vista de calendario
  async getCalendarTasks(startDate: Date, endDate: Date): Promise<Task[]> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await apiClient.get<Task[]>(`/tasks/calendar?${params.toString()}`);
    return response.data; // Devuelve directamente el array de tareas
  },
};