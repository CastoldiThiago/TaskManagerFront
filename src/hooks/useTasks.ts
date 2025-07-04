import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/api/tasks";
import type { CreateTask, Status, Task, TaskFilter } from "../types";

interface UseTasksOptions {
  initialFilter?: TaskFilter;
  autoFetch?: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<TaskFilter | undefined>(options.initialFilter);

  const fetchTasks = useCallback(
    async (currentFilter?: TaskFilter) => {
      try {
        setLoading(true);
        setError(null);
        const filterToUse = currentFilter || filter;
        const tasks = await taskService.getTasks(filterToUse);
        setTasks(tasks);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error al cargar las tareas"));
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  const fetchMyDayTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await taskService.getMyDayTasks();
      setTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar las tareas del día"));
      console.error("Error fetching my day tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendarTasks = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await taskService.getCalendarTasks(startDate, endDate);
      setTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar las tareas del calendario"));
      console.error("Error fetching calendar tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: CreateTask) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskService.createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al crear la tarea"));
      console.error("Error creating task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al actualizar la tarea"));
      console.error("Error updating task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al eliminar la tarea"));
      console.error("Error deleting task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStateTask = useCallback(async (id: string, state: Status) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Changing task state:", id, state);
      const updatedTask = await taskService.changeStateTask(id, state);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      console.log("Task state changed successfully:", updatedTask);
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cambiar el estado de la tarea"));
      console.error("Error changing task state:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchTasks();
    }
  }, [fetchTasks, options.autoFetch]);

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    fetchTasks,
    fetchMyDayTasks,
    fetchCalendarTasks,
    createTask,
    updateTask,
    deleteTask,
    changeStateTask,
  };
}