import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import DropdownTasks from "../../../components/DropdownTasks"
import EditTask from "../../../components/EditTask"
import { useTaskContext } from "../../../context/TaskContext"
import type { Task } from "../../../types"
import AddTask from "../../../components/AddTask"
import { useTitle } from "../../../context/TitleContext"
import { se } from "date-fns/locale"

const filterOptions = [
  { value: "", label: "All" },
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
  { value: "OVERDUE", label: "Overdue" },
]

const orderOptions = [
  { value: "dueDate", label: "Due date" },
  { value: "title", label: "Title" },
]

export default function AllMyTasks() {
  const { tasks, lists, fetchTasks } = useTaskContext()
  const [filter, setFilter] = useState<string>("")
  const [order, setOrder] = useState<string>("dueDate")
  const [search, setSearch] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("flat")
  const {setTitle} = useTitle();

  useEffect(() => {
    fetchTasks()
    setTitle("All my tasks")
  }, [fetchTasks])

  // Filtering and ordering
  const filteredTasks = useMemo(() => {
    let filtered = tasks
    if (filter === "OVERDUE") {
      const now = new Date()
      now.setHours(0, 0, 0, 0) // Set to start of day
      filtered = filtered.filter(
        t =>
          t.status !== "DONE" &&
          t.dueDate &&
          new Date(t.dueDate) < now
      )
    } else if (filter) {
      filtered = filtered.filter(t => t.status === filter)
    }
    if (search) filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    return [...filtered].sort((a, b) => {
      if (order === "title") return a.title.localeCompare(b.title)
      if (order === "dueDate") {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      // createdAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [tasks, filter, order, search])

  // Group by list
  const groupedByList = useMemo(() => {
    const groups: Record<string, Task[]> = {}
    filteredTasks.forEach(task => {
      const listName = lists.find(l => l.id === task.listId)?.name || "No list"
      if (!groups[listName]) groups[listName] = []
      groups[listName].push(task)
    })
    return groups
  }, [filteredTasks, lists])

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task)
    setEditOpen(true)
  }
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSelectedTask(null)
  }

  return (
    <Box sx={{ p: 3, maxHeight: "100vh", overflowY: "auto" }}>
      <Box sx={{ maxWidth: 400 }}>
        <AddTask />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} mt={2}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={e => setFilter(e.target.value)}
          >
            {filterOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
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
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && setViewMode(value)}
          size="small"
          sx={{ ml: 2,  }}
        >
          <ToggleButton value="grouped">Group by list</ToggleButton>
          <ToggleButton value="flat">Flat list</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* Show grouped or flat */}
      {viewMode === "grouped" ? (
        Object.entries(groupedByList).map(([listName, tasks]) => (
          <DropdownTasks
            key={listName}
            tasks={tasks}
            title={listName}
            onOpenModal={handleOpenEdit}
          />
        ))
      ) : (
        <DropdownTasks
          tasks={filteredTasks}
          title="All tasks"
          onOpenModal={handleOpenEdit}
        />
      )}

      <EditTask open={editOpen} onClose={handleCloseEdit} task={selectedTask} />
    </Box>
  )
}