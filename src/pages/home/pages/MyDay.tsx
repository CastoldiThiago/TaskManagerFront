import React from "react"
import { useEffect } from "react"
import { useTaskContext } from "../../../context/TaskContext"
import AddTask from "../../../components/AddTask"
import TaskItem from "../../../components/TaskItem"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"

export default function MyDayPage() {
  const { tasks, isLoading, error, fetchMyDayTasks } = useTaskContext()

  useEffect(() => {
    fetchMyDayTasks()
  }, [fetchMyDayTasks])

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Mi Día
      </Typography>

      <AddTask />

      {isLoading && <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error.message}
        </Alert>
      )}

      {!isLoading && tasks.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          No hay tareas para hoy. ¡Añade una nueva tarea!
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Box>
    </Box>
  )
}
