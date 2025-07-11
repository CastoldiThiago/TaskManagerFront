import React from "react";
import { createContext, useContext, type ReactNode } from "react";
import { useTasks } from "../hooks/useTasks";
import { useLists } from "../hooks/useLists";
import type { Task, TaskList, TaskFilter, CreateTask, Status, TaskListComplete } from "../types";

interface TaskContextType {
  tasks: Task[];
  lists: TaskList[];
  isLoading: boolean;
  error: Error | null;
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void; 
  fetchTasks: (filter?: TaskFilter) => Promise<void>;
  fetchMyDayTasks: () => Promise<void>;
  fetchCalendarTasks: (startDate: Date, endDate: Date) => Promise<void>;
  createTask: (task: CreateTask) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  changeStateTask: (id: string, state: Status) => Promise<Task>;
  fetchLists: () => Promise<void>;
  createList: (list: Partial<TaskList>) => Promise<TaskList>;
  getList: (id: string) => Promise<TaskListComplete>;
  updateList: (id: string, updates: Partial<TaskList>) => Promise<TaskList>;
  deleteList: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    setTasks,
    fetchTasks,
    fetchMyDayTasks,
    fetchCalendarTasks,
    createTask,
    updateTask,
    deleteTask,
    changeStateTask,
  } = useTasks({ autoFetch: false });

  const {
    lists,
    loading: listsLoading,
    error: listsError,
    fetchLists,
    createList,
    getList,
    updateList,
    deleteList,
  } = useLists({ autoFetch: true });

  const isLoading = tasksLoading || listsLoading;
  const error = tasksError || listsError;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        lists,
        isLoading,
        error,
        setTasks,
        fetchTasks,
        fetchMyDayTasks,
        fetchCalendarTasks,
        createTask,
        updateTask,
        deleteTask,
        changeStateTask,
        fetchLists,
        createList,
        updateList,
        getList,
        deleteList,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}