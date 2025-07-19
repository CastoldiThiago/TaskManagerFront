import React, { useState } from "react"
import { Box, Typography, IconButton, Collapse } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import TaskItem from "./TaskItem"
import type { Task } from "../types"

interface DropdownTasksProps {
  tasks: Task[]
  title?: string
  onOpenModal?: (task: Task) => void
  onDelete?: (task: Task) => void
  noTasks?: string
  initialOpen?: boolean
  onComplete?: (task: Task) => void
}

export default function DropdownTasks({
  tasks,
  title = "Completed Tasks",
  noTasks = "No Tasks",
  initialOpen = false,
  onOpenModal,
  onDelete,
  onComplete
}: DropdownTasksProps) {
  const [open, setOpen] = useState(initialOpen? initialOpen : false)
  return (
    <Box sx={{ mb: 2}}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          px: 1,
          paddingRight: 2,
          py: 1,
          borderRadius: 1,
          backgroundColor: "secondary.main",
          "&:hover": { backgroundColor: "secondary.light" },
          userSelect: "none",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <IconButton
          size="small"
          sx={{ color: "#fff", mr: 1 }}
          onClick={e => { e.stopPropagation(); setOpen((prev) => !prev) }}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 500 }}>
          {title} ({tasks.length})
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box sx={{ mt: 1 }}>
          {tasks.length === 0 ? (
            <Typography variant="body2" sx={{ color: "primary.main", px: 2, py: 1 }}>
              {noTasks}
            </Typography>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} task={task} onOpenModal={onOpenModal} onDelete={onDelete} onComplete={onComplete}/>
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  )
}