import { useState, useEffect, useCallback } from "react";
import { listService } from "../services/api/lists";
import type { TaskList } from "../types";

interface UseListsOptions {
  autoFetch?: boolean;
}

export function useLists(options: UseListsOptions = {}) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listService.getLists();
      setLists(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar las listas"));
      console.error("Error fetching lists:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createList = useCallback(async (list: Partial<TaskList>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await listService.createList(list);
      setLists((prevLists) => [...prevLists, response]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al crear la lista"));
      console.error("Error creating list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getList = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await listService.getList(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al obtener la lista"));
      console.error("Error fetching list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateList = useCallback(async (id: string, updates: Partial<TaskList>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await listService.updateList(id, updates);
      setLists((prevLists) => prevLists.map((list) => (list.id === id ? response : list)));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al actualizar la lista"));
      console.error("Error updating list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteList = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await listService.deleteList(id);
      setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al eliminar la lista"));
      console.error("Error deleting list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchLists();
    }
  }, [fetchLists, options.autoFetch]);

  return {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    getList,
  };
}