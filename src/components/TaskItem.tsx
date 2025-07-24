import React from "react"
import { useTaskContext } from "../context/TaskContext"
import type { Task } from "../types"
import { Box, Checkbox, IconButton, Typography } from "@mui/material"
import CalendarIcon from "@mui/icons-material/CalendarToday"
import ListIcon from "@mui/icons-material/FormatListBulleted"
import { format, set } from "date-fns"
import { es } from "date-fns/locale"
import { DeleteIcon, Trash } from "lucide-react"
import DeleteItemModal from "./DeleteItemModal"

interface TaskItemProps {
  task: Task
  onOpenModal?: (task: Task) => void
  onDelete?: (task: Task) => void
  hideCheckbox?: boolean
  inTodoPage?: boolean
  onComplete?: (task: Task) => void
}

export default function TaskItem({ task, onOpenModal, hideCheckbox, inTodoPage = false, onDelete, onComplete}: TaskItemProps) {
  const { changeStateTask } = useTaskContext()
  const { lists } = useTaskContext()
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  const handleComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    await changeStateTask(task.id, task.status === "DONE" ? "TODO" : "DONE")
    if (onComplete) onComplete({ ...task, status: task.status === "DONE" ? "TODO" : "DONE" })
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteModalOpen(true)
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
        p: { xs: 1, sm: 2 },
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        backgroundColor: "secondary.main",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        opacity: task.status === "DONE" ? 0.75 : 1,
        cursor: "pointer",
        transition: "background 0.2s, box-shadow 0.2s",
        minWidth: 0,
        width: '100%',
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
            fontSize: { xs: 15, sm: 18 },
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </Typography>

        {(task.dueDate || task.listId) && (
          <Box sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            mt: 0.5,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            alignItems: 'center',
          }}>
            {task.listId && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#bdbdbd",
                  fontSize: { xs: 12, sm: 13 },
                  maxWidth: { xs: 120, sm: 'none' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
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
                  fontSize: { xs: 12, sm: 13 },
                  maxWidth: { xs: 110, sm: 'none' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem" }} />
                {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: es })}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {/* Botón eliminar */}
      <IconButton
        edge="end"
        color="primary"
        size="large"
        sx={{ ml: 1 }}
        onMouseDown={e => { e.stopPropagation(); handleDeleteClick(e); }}
        aria-label="Delete task"
      >
        <Trash size={20} />
      </IconButton>
      <DeleteItemModal
        open={deleteModalOpen}
        onClose={(e?: React.SyntheticEvent) => {
          if (e) e.stopPropagation();
          setDeleteModalOpen(false);
        }}
        onConfirm={async (e?: React.SyntheticEvent) => {
          if (e) e.stopPropagation();
          if (onDelete) await onDelete(task)
          setDeleteModalOpen(false)
        }}
        type="task"
        name={task.title}
      />
    </Box>
  )
}