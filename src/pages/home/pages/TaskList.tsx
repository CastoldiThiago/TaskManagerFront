import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, TextField, IconButton, Stack, Divider, Alert } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import TaskItem from "../../../components/TaskItem"
import { useTaskContext } from "../../../context/TaskContext"
import { Task, TaskListComplete } from "../../../types"
import DropdownTasks from "../../../components/DropdownTasks"
import { useTitle } from "../../../context/TitleContext"
import AddTask from "../../../components/AddTask"
import EditTask from "../../../components/EditTask"

const TaskList: React.FC = () => {
  const { id } = useParams()
  const { lists, tasks, updateList, getList, error } = useTaskContext()
  const [loading, setLoading] = useState(false)

  // Estado local para la lista actual
  const [list, setList] = useState<TaskListComplete>()
  const [name, setName] = useState(list?.name || "")
  const [description, setDescription] = useState(list?.description || "")
  const [editMode, setEditMode] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const { setTitle } = useTitle()

  const fetchList = async () => {
      setLoading(true)
      try {
        if (!id) return
        const fetchedList = await getList(id)
        if (fetchedList) {
          setList(fetchedList)
          setName(fetchedList.name || "")
          setDescription(fetchedList.description || "")
        }
      } finally {
        setLoading(false)
      }
    }
  // Cargar la lista y sus tareas al montar o cambiar id
  useEffect(() => {
    fetchList()
  }, [id, getList])

  if (loading) return <Typography variant="h6">Cargando...</Typography>
  if (!list) return <Typography variant="h6">Lista no encontrada</Typography>

  const handleSave = async () => {
    await updateList(list.id, { name, description })
    setEditMode(false)
    fetchList() // Refrescar la lista después de guardar
  }

    const handleOpenEdit = (task: Task) => {
      setSelectedTask(task)
      setEditOpen(true)
    }
    const handleCloseEdit = () => {
      setEditOpen(false)
      setSelectedTask(null)
    }

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 4, p: 2, overflowY: "auto" }}>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        {editMode ? (
          <>
            <TextField
              value={name}
              onChange={e => setName(e.target.value)}
              variant="standard"
              sx={{ flex: 1 }}
              inputProps={{ style: { fontSize: 28, fontWeight: 700 } }}
            />
            <IconButton color="primary" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4" fontWeight={700}>
              {list.name}
            </Typography>
            <IconButton onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
      <Box mt={1} mb={2}>
        {editMode ? (
          <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
            variant="standard"
            fullWidth
            multiline
            placeholder="Descripción"
          />
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            {list.description || "Sin descripción"}
          </Typography>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      {/* Lista de tareas scrollable */}
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
      
              <Box>
                {tasks.filter(t => t.status !== "DONE").map((task) => (
                  <TaskItem key={task.id} task={task} onOpenModal={handleOpenEdit}/>
                ))}
              </Box>
              <DropdownTasks
                tasks={tasks.filter(t => t.status === "DONE")}
                title="Completed"
                onOpenModal={handleOpenEdit}
                noTasks="No completed tasks yet."
              />
              
            </Box>
      
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
            <EditTask open={editOpen} onClose={handleCloseEdit} task={selectedTask} />
    </Box>
  )
}

export default TaskList