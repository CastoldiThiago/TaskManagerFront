import React, { useState, useRef } from "react"
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Stack,
  Switch,
  Button,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ListIcon from "@mui/icons-material/FormatListBulleted"
import TodayIcon from "@mui/icons-material/Today"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Task, Status, TaskList } from "../types"
import { useTaskContext } from "../context/TaskContext"

interface EditTaskProps {
  open: boolean
  onClose: () => void
  task: Task | null
}

const statusLabels: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

export default function EditTask({ open, onClose, task }: EditTaskProps) {
  const { lists, updateTask } = useTaskContext()
  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.dueDate ? new Date(task.dueDate) : null
  )
  const [status, setStatus] = useState<Status>(task?.status ?? "TODO")
  const [movedToMyDay, setMovedToMyDay] = useState(!!task?.movedToMyDay)
  const [selectedList, setSelectedList] = useState<TaskList | null>(
    lists.find(l => l.id === task?.listId) ?? null
  )

  // Popover states
  const [listAnchorEl, setListAnchorEl] = useState<HTMLDivElement | null>(null)
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLDivElement | null>(null)
  const listButtonRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLDivElement>(null)
  const listOpen = Boolean(listAnchorEl)
  const dateOpen = Boolean(dateAnchorEl)

  React.useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? "")
      setDueDate(task.dueDate ? new Date(task.dueDate) : null)
      setStatus(task.status ?? "TODO")
      setMovedToMyDay(!!task.movedToMyDay)
      setSelectedList(lists.find(l => l.id === task.listId) ?? null)
    }
    // eslint-disable-next-line
  }, [task, lists])

  if (!task) return null

  // List popover handlers
  const handleListClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setListAnchorEl(listButtonRef.current)
  }
  const handleListClose = () => setListAnchorEl(null)
  const handleListSelect = (list: TaskList) => {
    setSelectedList(list)
    handleListClose()
  }
  const handleListClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedList(null)
  }

  // Date popover handlers
  const handleDateClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setDateAnchorEl(dateButtonRef.current)
  }
  const handleDateClose = () => setDateAnchorEl(null)
  const handleDateSelect = (date: Date | null) => {
    setDueDate(date)
    handleDateClose()
  }
  const handleDateClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    setDueDate(null)
  }

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      status,
      movedToMyDay,
      movedDate: movedToMyDay ? new Date().toISOString() : undefined,
      listId: selectedList ? selectedList.id : undefined,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          minWidth: 420,
          maxWidth: 600,
          outline: "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Edit Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            size="medium"
            inputProps={{ maxLength: 120 }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            size="medium"
            multiline
            minRows={3}
            maxRows={8}
            inputProps={{ maxLength: 1000 }}
          />

          

          {/* Estado */}
          <TextField
            select
            label="Estate"
            value={status}
            onChange={e => setStatus(e.target.value as Status)}
            fullWidth
            size="medium"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Lista */}
            <div
              ref={listButtonRef}
              onClick={handleListClick}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                minWidth: 0,
                flex: 1,
              }}
            >
              <ListIcon fontSize="small" color="action" />
              {selectedList ? (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
                    {selectedList.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleListClear}
                    sx={{ ml: 0.5, p: 0.25 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="body2" sx={{ ml: 1, color: "#bbb" }}>
                  Select list
                </Typography>
              )}
            </div>

            <Divider orientation="vertical" flexItem />

            {/* Fecha */}
            <div
              ref={dateButtonRef}
              onClick={handleDateClick}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                minWidth: 0,
                flex: 1,
              }}
            >
              <CalendarMonthIcon fontSize="small" color="action" />
              {dueDate ? (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
                    {format(dueDate, "dd/MM/yyyy", { locale: es })}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleDateClear}
                    sx={{ ml: 0.5, p: 0.25 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="body2" sx={{ ml: 1, color: "#bbb" }}>
                  Select date
                </Typography>
              )}
            </div>
          </Stack>

          {/* Mi Día */}
          <Stack direction="row" spacing={1} alignItems="center">
            <TodayIcon fontSize="small" color="action" />
            <Typography variant="body2">My Day</Typography>
            <Switch
              checked={movedToMyDay}
              onChange={e => setMovedToMyDay(e.target.checked)}
              color="primary"
            />
          </Stack>

          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save Changes
          </Button>
        </Stack>

        {/* Popover para seleccionar lista */}
        <Popover
          open={listOpen}
          anchorEl={listAnchorEl}
          onClose={handleListClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "background.paper",
                color: "text.primary",
                width: 240,
                mt: 1,
              },
            },
          }}
          onClick={e => e.stopPropagation()}
        >
          <List dense>
            {lists.map(list => (
              <ListItemButton
                key={list.id}
                onClick={() => handleListSelect(list)}
                selected={selectedList?.id === list.id}
              >
                <ListItemText primary={list.name} />
              </ListItemButton>
            ))}
          </List>
        </Popover>

        {/* Popover para seleccionar fecha */}
        <Popover
          open={dateOpen}
          anchorEl={dateAnchorEl}
          onClose={handleDateClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "background.paper",
                color: "text.primary",
                mt: 1,
              },
            },
          }}
          onClick={e => e.stopPropagation()}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DateCalendar
              value={dueDate}
              onChange={date => handleDateSelect(date as Date)}
              sx={{
                color: "text.primary",
                "& .MuiPickersDay-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#4F46E5",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Popover>
      </Box>
    </Modal>
  )
}