
import React from "react"

import { useState } from "react"
import { useTaskContext } from "../context/TaskContext"
import type { Task } from "../types"
import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  Paper,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  FormatListBulleted as ListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TaskItemProps {
  task: Task
  onTaskUpdated?: () => void
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const { updateTask, deleteTask, completeTask } = useTaskContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleComplete = async () => {
    try {
      await completeTask(task.id, !task.completed)
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("Error completing task:", error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    handleMenuClose()
  }

  const handleSaveEdit = async () => {
    if (editedTitle.trim() !== "") {
      try {
        await updateTask(task.id, { title: editedTitle })
        setIsEditing(false)
        if (onTaskUpdated) onTaskUpdated()
      } catch (error) {
        console.error("Error updating task:", error)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
    handleMenuClose()
  }

  const handleToggleImportant = async () => {
    try {
      await updateTask(task.id, { isImportant: !task.isImportant })
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("Error updating task importance:", error)
    }
    handleMenuClose()
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        p: 2,
        display: "flex",
        alignItems: "center",
        opacity: task.completed ? 0.7 : 1,
        transition: "all 0.2s",
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={handleComplete}
        sx={{
          color: "#4F46E5",
          "&.Mui-checked": {
            color: "#4F46E5",
          },
        }}
      />

      <Box sx={{ flex: 1, ml: 1 }}>
        {isEditing ? (
          <TextField
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
            autoFocus
            variant="standard"
            size="small"
          />
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {task.isImportant && <StarIcon fontSize="small" sx={{ color: "#FFB400" }} />}
              {task.title}
            </Typography>

            {(task.dueDate || task.listId) && (
              <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                {task.dueDate && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "text.secondary",
                    }}
                  >
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem" }} />
                    {format(new Date(task.dueDate), "PPP", { locale: es })}
                  </Typography>
                )}

                {task.listId && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "text.secondary",
                    }}
                  >
                    <ListIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem" }} />
                    {task.listId}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleImportant}>
          <ListItemIcon>
            {task.isImportant ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{task.isImportant ? "Quitar importancia" : "Marcar como importante"}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  )
}
