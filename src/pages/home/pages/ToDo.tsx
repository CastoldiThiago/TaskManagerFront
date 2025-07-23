import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { useTaskContext } from "../../../context/TaskContext"
import type { Task, Status, TaskList } from "../../../types"
import TaskItem from "../../../components/TaskItem"
import EditTask from "../../../components/EditTask"
import { useTitle } from "../../../context/TitleContext"
import AddTask from "../../../components/AddTask"

const statusPanels: { key: Status; label: string }[] = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
]
const orderOptions = [
  { value: "custom", label: "Custom" },
  { value: "dueDate", label: "Due date" },
  { value: "title", label: "Title" },
]

export default function ToDo() {
  const { tasks, lists, changeStateTask, fetchTasks, setTasks, isLoading, deleteTask } = useTaskContext()
  const [selectedList, setSelectedList] = useState<TaskList>()
  const [editOpen, setEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const {setTitle} = useTitle();
  const [orderBy, setOrderBy] = useState<"custom" | "dueDate" | "title">("custom")

  useEffect(() => {
    fetchTasks()
    setTitle("To Do Board")
    // Si la lista seleccionada fue borrada, limpiar filtro
    if (selectedList && !lists.find(l => l.id === selectedList.id)) {
      setSelectedList(undefined);
    }
  }, [fetchTasks, lists])

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
    await fetchTasks()
  }

  // Filtrar tareas por lista seleccionada
  const filteredTasks = useMemo(
    () =>
      selectedList
        ? tasks.filter((t) => t.listId === selectedList.id)
        : tasks,
    [tasks, selectedList]
  )

  // Agrupar y ordenar tareas por estado
  const tasksByStatus = useMemo(() => {
    const groups: Record<Status, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] }
    filteredTasks.forEach((task) => {
      const status = task.status ?? "TODO"
      groups[status].push(task)
    })
    // Solo ordenar si no es manual
    if (orderBy !== "custom") {
      Object.keys(groups).forEach((status) => {
        groups[status as Status] = [...groups[status as Status]].sort((a, b) => {
          if (orderBy === "title") return a.title.localeCompare(b.title)
          if (orderBy === "dueDate") {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          }
          return 0
        })
      })
    }
    return groups
  }, [filteredTasks, orderBy])

  // Drag & drop handler
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    const sourceStatus = source.droppableId as Status
    const destStatus = destination.droppableId as Status

    // Si es manual y el drag es dentro del mismo panel, reordenar localmente
    if (orderBy === "custom" && sourceStatus === destStatus) {
      setTasks((prevTasks: Task[]) => {
        // Filtra las tareas del panel
        const panelTasks = prevTasks.filter(t => (t.status ?? "TODO") === sourceStatus && (!selectedList || t.listId === selectedList.id))
        const otherTasks = prevTasks.filter(t => (t.status ?? "TODO") !== sourceStatus || (selectedList && t.listId !== selectedList.id))

        // Encuentra el índice real en prevTasks
        const draggedTaskId = draggableId
        const fromIndex = panelTasks.findIndex(t => t.id.toString() === draggedTaskId)
        const toIndex = destination.index

        if (fromIndex === -1) return prevTasks

        // Reordena el array del panel
        const newPanelTasks = Array.from(panelTasks)
        const [removed] = newPanelTasks.splice(fromIndex, 1)
        newPanelTasks.splice(toIndex, 0, removed)

        // Reconstruye el array completo
        // Mantén el orden de los otros panels
        const newTasks: Task[] = []
        prevTasks.forEach(t => {
          if ((t.status ?? "TODO") === sourceStatus && (!selectedList || t.listId === selectedList.id)) {
            // Solo agrega si está en el nuevo orden
            const idx = newPanelTasks.findIndex(nt => nt.id === t.id)
            if (idx !== -1) newTasks.push(newPanelTasks[idx])
          } else {
            newTasks.push(t)
          }
        })
        return newTasks
      })
      return
    }

    // Si cambia de panel o no es manual, sigue igual
    if (sourceStatus !== destStatus) {
      setTasks(
        tasks.map((task: Task) =>
          task.id.toString() === draggableId ? { ...task, status: destStatus } : task
        )
      )
      try {
        await changeStateTask(draggableId, destStatus)
      } catch (e) {
        fetchTasks()
      }
    }
  }
  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
      <CircularProgress size={40} color="secondary" />
    </Box>)

  return (
    <Box sx={{ p: 3, height: "100vh", overflow: "auto" }}>
      <FormControl size="small" sx={{ minWidth: 220, mb: 3, mr: 2 }}>
        <InputLabel>Filter by list</InputLabel>
        <Select
          value={selectedList?.id}
          label="Filter by list"
          onChange={(e) => {setSelectedList(lists.find((list) => list.id == e.target.value))}}
        >
          <MenuItem value="">All lists</MenuItem>
          {lists.map((list) => (
            <MenuItem key={list.id} value={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180, mb: 3 }}>
        <InputLabel>Order by</InputLabel>
        <Select
          value={orderBy}
          label="Order by"
          onChange={e => setOrderBy(e.target.value as "custom" | "dueDate" | "title")}
        >
          {orderOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DragDropContext onDragEnd={onDragEnd}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ width: "100%", flex: 1 }}
        >
          {statusPanels.map((panel) => (
            <Droppable droppableId={panel.key} key={panel.key}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    height: { xs: 400, sm: "calc(100vh - 180px)" },
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    background: snapshot.isDraggingOver ? "#23272b" : "secondary.main",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: "primary.main", textAlign: "center" }}
                  >
                    {panel.label}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      minHeight: 0,
                      pr: 1,
                    }}
                  >
                    {tasksByStatus[panel.key].map((task, idx) => (
                      <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              marginBottom: 12,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TaskItem
                              task={task}
                              hideCheckbox
                              onOpenModal={handleOpenEdit}
                              inTodoPage
                              onDelete={handleDeleteTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {panel.key === "TODO" && (
                    <AddTask taskList={selectedList}/>
                    )}
                  </Box>
                </Paper>
              )}
            </Droppable>
          ))}
        </Stack>
      </DragDropContext>
      <EditTask open={editOpen} onClose={handleCloseEdit} task={selectedTask} />
    </Box>
  )
}