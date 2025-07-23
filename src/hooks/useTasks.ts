import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/api/tasks";
import type { CreateTask, Status, Task, TaskFilter } from "../types";

interface UseTasksOptions {
  initialFilter?: TaskFilter;
  autoFetch?: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasksState] = useState<Task[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<TaskFilter | undefined>(options.initialFilter);
  
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  function setTasks(
    value: Task[] | ((prev: Task[]) => Task[])
  ) {
    if (typeof value === "function") {
      setTasksState(value as (prev: Task[]) => Task[])
    } else {
      setTasksState(value)
    }
  }
  
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

  const getTasksForList = useCallback(async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await taskService.getTasksForList(id);
        return response;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error al obtener las tareas de la lista"));
        console.error("Error fetching tasks for list:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  const changeStateTask = useCallback(async (id: string, state: Status) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskService.changeStateTask(id, state);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
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
    setTasks,
    setFilter,
    fetchTasks,
    fetchMyDayTasks,
    getTasksForList,
    createTask,
    updateTask,
    deleteTask,
    changeStateTask,
  };
}