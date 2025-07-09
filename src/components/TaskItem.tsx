import React from "react"
import { useTaskContext } from "../context/TaskContext"
import type { Task } from "../types"
import { Box, Checkbox, Typography } from "@mui/material"
import CalendarIcon from "@mui/icons-material/CalendarToday"
import ListIcon from "@mui/icons-material/FormatListBulleted"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TaskItemProps {
  task: Task
  onOpenModal?: (task: Task) => void
  hideCheckbox?: boolean
}

export default function TaskItem({ task, onOpenModal, hideCheckbox }: TaskItemProps) {
  const { changeStateTask } = useTaskContext()
  const { lists } = useTaskContext()

  const handleComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    await changeStateTask(task.id, task.status === "DONE" ? "TODO" : "DONE")
  }

  const handleClick = () => {
    if (onOpenModal) onOpenModal(task)
    else console.log("Abrir modal para editar tarea:", task)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        mb: 2,
        p: 2,
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        backgroundColor: "secondary.main",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        opacity: task.status === "DONE" ? 0.75 : 1,
        cursor: "pointer",
        transition: "background 0.2s, box-shadow 0.2s",
        "&:hover": {
          backgroundColor: "secondary.light",
          boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
        },
      }}
    >
      {!hideCheckbox && (
      <Checkbox
        checked={task.status === "DONE"}
        onClick={e => e.stopPropagation()}
        onChange={handleComplete}
        sx={{
          color: "#7a3742",
          "&.Mui-checked": {
            color: "#7a3742",
          },
        }}
      />
      )}

      <Box sx={{ flex: 1, ml: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: task.status === "DONE" ? "line-through" : "none",
            color: "#fff",
            fontWeight: 500,
            fontSize: 18,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title}
        </Typography>

        {(task.dueDate || task.listId) && (
          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
            {task.listId && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#bdbdbd",
                  fontSize: 13,
                }}
              >
                <ListIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem" }} />
                {lists.find(list => list.id === task.listId)?.name}
              </Typography>
            )}
            {task.dueDate && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#bdbdbd",
                  fontSize: 13,
                }}
              >
                <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem" }} />
                {format(new Date(task.dueDate), "PPP", { locale: es })}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}