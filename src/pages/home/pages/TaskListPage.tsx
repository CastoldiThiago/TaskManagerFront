import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography, TextField, IconButton, Stack, Divider, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import TaskItem from "../../../components/TaskItem"
import { useTaskContext } from "../../../context/TaskContext"
import { Task, TaskList } from "../../../types"
import DropdownTasks from "../../../components/DropdownTasks"
import { useTitle } from "../../../context/TitleContext"
import AddTask from "../../../components/AddTask"
import EditTask from "../../../components/EditTask"
import { set } from "date-fns"
import DeleteItemModal from "../../../components/DeleteItemModal"
import { DeleteIcon, TrashIcon } from "lucide-react"

const orderOptions = [
  { value: "dueDate", label: "Due date" },
  { value: "title", label: "Title" },
]

const TaskListPage: React.FC = () => {
  const { id } = useParams()
  const { updateList, error, deleteList, fetchLists, deleteTask, lists, getTasksForList} = useTaskContext()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Estado local para la lista actual
  const [list, setList] = useState<TaskList>()
  const [listTasks, setListTasks] = useState<Task[]>([])
  const [name, setName] = useState(list?.name || "")
  const [description, setDescription] = useState(list?.description || "")
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const { setTitle } = useTitle()
  const [order, setOrder] = useState<string>("dueDate")

  // Estados para el modal de eliminación
  const [modalOpen, setModalOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  
  const handleOpenModal = (name: string) => {
    setItemName(name)
    setModalOpen(true)
  }
  const handleClose = () => {
    setModalOpen(false)
    setItemName("")
  }
  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteList(id)
      await fetchLists() // Refrescar la lista de listas
      navigate("/home")
    } catch (error) {
      console.error("Error deleting list:", error)
    } finally {
      handleClose()
    }
  }

  const onCompleteTask = (taskCompleted:Task) => {
    setListTasks((prev) => prev.map(t => t.id === taskCompleted.id ? taskCompleted : t))
  }

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id)
    setListTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  // carga la lista y sus tareas
  const loadList = async () => {
      setLoading(true)
      try {
        const currentList = lists.find((l) => l.id == id)
        if (currentList) {
          setList(currentList)
          setName(currentList.name || "")
          setDescription(currentList.description || "")
          const tasks = await getTasksForList(currentList.id)
          setListTasks(tasks)
        }
      } catch (error) {
        console.error("Error loading list:", error)
        setList(undefined)
        setListTasks([])
        setName("")
        setDescription("")

      } finally {
        setLoading(false)
      }
    }
  // Cargar la lista y sus tareas al montar o cambiar id
  useEffect(() => {
    console.log("Cargando lista con id:", id)
    fetchLists()
    loadList()
    setTitle("My Lists")
  }, [id])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
      <CircularProgress />
    </Box>)
  if (!list) return <Typography variant="h6">Lista no encontrada</Typography>

  const orderedTasks = [...listTasks].sort((a, b) => {
    if (order === "title") return a.title.localeCompare(b.title)
    if (order === "dueDate") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  const handleSave = async () => {
    await updateList(list.id, { name, description })
  }


  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task)
    setEditOpen(true)
  }
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSelectedTask(null)
  }

  const handleTaskCreated = (task: Task) => {
    if (task.listId == list.id) {
    setListTasks(prev => [...prev, task])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditingName(false)
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      setEditingName(false)
      setName(list.name || "")
    }
  }

  return (
    <Box sx={
      { 
        width: "100%", 
        height: "100vh", 
        display: "flex", 
        flexDirection:"column", 
        mx: "auto", 
        px: 4, 
        py: 2,
        overflowY: "auto" }
      }>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        {editingName ? (
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              handleSave();
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            onFocus={(e) => e.target.select()}
            variant="standard"
            fullWidth
            inputProps={{
              style: { fontSize: 28, fontWeight: 700 },
            }}
          />
        ) : (
          <>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                flex: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: "background.light" },
                px: 1,
                borderRadius: 1,
              }}
              onClick={() => setEditingName(true)}
            >
              {name}
            </Typography>
            <IconButton onClick={()=>handleOpenModal(list.name)} color="primary" sx={{ ml: 1 }}>
              <TrashIcon/>
            </IconButton>
          </>
        )}
      </Stack>

      <Box mt={1} mb={2}>
        {editingDescription ? (
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              setEditingDescription(false);
              handleSave();
            }}
            autoFocus
            variant="standard"
            fullWidth
            multiline
            placeholder="Description"
          />
        ) : (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: "background.light" },
              px: 1,
              borderRadius: 1,
            }}
            onClick={() => setEditingDescription(true)}
          >
            {description || 'No description'}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />
      <FormControl size="small" sx={{ minWidth: 180, maxWidth: 300, mb: 2 }}>
          <InputLabel>Order by</InputLabel>
          <Select
            value={order}
            label="Order by"
            onChange={e => setOrder(e.target.value)}
          >
            {orderOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      {/* Lista de tareas scrollable */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                pb:8,
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
                {orderedTasks.filter(t => t.status !== "DONE").map((task) => (
                  <TaskItem key={task.id} task={task} onOpenModal={handleOpenEdit} onDelete={handleDeleteTask} onComplete={onCompleteTask}/>
                ))}
              </Box>
              {orderedTasks.length > 0 ? (
              <DropdownTasks
                tasks={orderedTasks.filter(t => t.status === "DONE")}
                title="Completed"
                onOpenModal={handleOpenEdit}
                noTasks="No completed tasks yet."
                initialOpen
                onDelete={handleDeleteTask}
                onComplete={onCompleteTask}
              />
              ): (
                <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                  There are no tasks in this list. Add a new task!
                </Typography>
              )}
              
            </Box>
      
            {/* AddTask fijo abajo */}
            <Box
              className="scrollable-tasks"
              sx={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                pt: 2,
              }}
            >
              <Box sx={{ margin: "0 auto" }}>
                <AddTask isInMyDay handleTaskCreated={handleTaskCreated} taskList={list} />
              </Box>
            </Box>
            {/* EditTask modal */}
            <EditTask open={editOpen} onClose={handleCloseEdit} task={selectedTask} />
            {/* Delete modal */}
            <DeleteItemModal
              open={modalOpen}
              onClose={handleClose}
              onConfirm={handleDelete}
              type="list"
              name={itemName}
            />
    </Box>
  )
}

export default TaskListPage