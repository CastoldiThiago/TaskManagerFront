import React, { useState } from "react"
import { useEffect } from "react"
import { useTaskContext } from "../../../context/TaskContext"
import AddTask from "../../../components/AddTask"
import TaskItem from "../../../components/TaskItem"
import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material"
import { useTitle } from "../../../context/TitleContext"
import DropdownTasks from "../../../components/DropdownTasks"
import { Task } from "../../../types"
import EditTask from "../../../components/EditTask"
import { is } from "date-fns/locale"

export default function MyDayPage() {
  const { tasks, isLoading, error, fetchMyDayTasks, setTasks, deleteTask, lists} = useTaskContext()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const { setTitle } = useTitle()

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task)
    setEditOpen(true)
  }
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id)
    await fetchMyDayTasks()
  }

  useEffect(() => {
    console.log("Cargando tareas del día")
    setTasks([])
    setTitle("My Day")
    fetchMyDayTasks()
  }, [fetchMyDayTasks, lists])

  // Refresca tareas cuando se edita una tarea (por ejemplo, se quita de My Day)
  const handleTaskUpdated = async () => {
    await fetchMyDayTasks();
  }

  // Ejemplo de presentación de la fecha de hoy
  const today = new Date()
  const dayOfWeek = today.toLocaleString("default", { weekday: "long" })
  const day = today.getDate()
  const month = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Fecha y presentación arriba */}
      <Box sx={{ py: 3, px: 2 }}>
          <Typography variant="h4" fontWeight={700} textAlign={"center"}>
            {dayOfWeek}, {day} de {month.charAt(0).toUpperCase() + month.slice(1)}
          </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <CircularProgress />
        </Box>
      )   :  (
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          pb:8,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
        }}
      >

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

        <Box>
          {tasks.filter(t => t.status !== "DONE").map((task) => (
            <TaskItem key={task.id} task={task} onOpenModal={handleOpenEdit} onDelete={handleDeleteTask}/>
          ))}
        </Box>
        {(!isLoading && tasks.length != 0) && (
          <DropdownTasks
            tasks={tasks.filter(t => t.status === "DONE")}
            title="Completed"
            onOpenModal={handleOpenEdit}
            noTasks="No completed tasks yet."
            onDelete={handleDeleteTask}
            initialOpen
          />
        )}
        
      </Box>
        
      )}

      {/* AddTask fijo abajo */}
      <Box
        className="scrollable-tasks"
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          width: "100%",
          py: 2,
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
          <AddTask isInMyDay />
        </Box>
      </Box>
      {/* EditTask modal */}
      <EditTask open={editOpen} onClose={handleCloseEdit} task={selectedTask} onTaskUpdated={handleTaskUpdated} />
    </Box>
  )
}