import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  TextField,
  IconButton,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  InputAdornment,
  Divider,
  Typography,
} from "@mui/material"
import { Add, KeyboardArrowUp, FormatListBulleted, CalendarMonth, Close } from "@mui/icons-material"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns"

// Mock data for task lists
const taskLists = [
  { id: 1, name: "Personal" },
  { id: 2, name: "Trabajo" },
  { id: 3, name: "Compras" },
  { id: 4, name: "Proyectos" },
]

export default function AddTask() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [selectedList, setSelectedList] = useState<{ id: number; name: string } | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)

  // Popover states
  const [listAnchorEl, setListAnchorEl] = useState<HTMLDivElement | null>(null)
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLDivElement | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listButtonRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLDivElement>(null)

  const listOpen = Boolean(listAnchorEl)
  const dateOpen = Boolean(dateAnchorEl)

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isExpanded &&
        !listOpen &&
        !dateOpen
      ) {
        resetForm()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded, listOpen, dateOpen])

  const handleAddClick = () => {
    setIsExpanded(true)
  }

  const resetForm = () => {
    setTaskName("")
    setSelectedList(null)
    setDueDate(null)
    setIsExpanded(false)
  }

  const handleSubmit = () => {
    if (taskName.trim()) {
      console.log({
        name: taskName,
        listId: selectedList?.id,
        dueDate: dueDate,
      })

      setTaskName("")
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      resetForm()
    }
  }

  // List popover handlers
  const handleListClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setListAnchorEl(listButtonRef.current)
  }

  const handleListClose = () => {
    setListAnchorEl(null)
  }

  const handleListSelect = (list: { id: number; name: string }) => {
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

  const handleDateClose = () => {
    setDateAnchorEl(null)
  }

  const handleDateSelect = (date: Date | null) => {
    setDueDate(date)
    handleDateClose()
  }

  const handleDateClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    setDueDate(null)
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto" }} ref={containerRef}>
      <Paper
        elevation={0}
        sx={{
          p: 0.5,
          borderRadius: 2,
          backgroundColor: "secondary.main",
          border: "1px solid #333",
          color: "#fff",
        }}
      >
        {!isExpanded ? (
          <Box
            onClick={handleAddClick}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              cursor: "pointer",
            }}
          >
            <Add sx={{ color: "#888", mr: 1 }} />
            <Box sx={{ color: "#888" }}>Add task</Box>
          </Box>
        ) : (
          <Box>
            {/* Barra superior con botones para lista y fecha */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #333",
                px: 2,
                py: 1,
              }}
            >
              {/* Botón de lista */}
              <div
                ref={listButtonRef}
                onClick={handleListClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selectedList ? "#773344" : "#888",
                  cursor: "pointer",
                  flex: 1,
                  position: "relative",
                }}
              >
                {selectedList ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedList.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleListClear}
                      sx={{
                        ml: 0.5,
                        p: 0.25,
                        color: "#888",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <FormatListBulleted />
                )}
              </div>

              <Divider orientation="vertical" flexItem sx={{ bgcolor: "#333" }} />

              {/* Botón de fecha */}
              <div
                ref={dateButtonRef}
                onClick={handleDateClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: dueDate ? "#773344" : "#888",
                  cursor: "pointer",
                  flex: 1,
                  position: "relative",
                }}
              >
                {dueDate ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {format(dueDate, "MMM d")}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleDateClear}
                      sx={{
                        ml: 0.5,
                        p: 0.25,
                        color: "#888",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <CalendarMonth />
                )}
              </div>
            </Box>

            {/* Campo de texto para el nombre de la tarea */}
            <TextField
              fullWidth
              placeholder="Add task"
              variant="standard"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              // Usando slotProps en lugar de InputProps
              slotProps={{
                input: {
                  style: {
                    color: "#fff",
                    padding: "12px 16px",
                  },
                },
              }}
              // Mantenemos algunos estilos con sx
              sx={{
                "& .MuiInputBase-root": {
                  color: "#fff",
                  px: 2,
                  py: 1.5,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "transparent",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "transparent",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "transparent",
                },
              }}
              // Añadimos el botón de enviar como un componente separado
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleSubmit} sx={{ color: "#888" }}>
                      <KeyboardArrowUp />
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
          </Box>
        )}
      </Paper>

      {/* List Selection Popover */}
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
              backgroundColor: "#1E1E1E",
              color: "#fff",
              width: 200,
              mt: 1,
            },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <List dense>
          {taskLists.map((list) => (
            <ListItemButton
              key={list.id}
              onClick={() => handleListSelect(list)}
              selected={selectedList?.id === list.id}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#333",
                },
                "&:hover": {
                  backgroundColor: "#2A2A2A",
                },
              }}
            >
              <ListItemText primary={list.name} />
            </ListItemButton>
          ))}
        </List>
      </Popover>

      {/* Date Selection Popover */}
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
              backgroundColor: "#1E1E1E",
              color: "#fff",
              mt: 1,
            },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={dueDate}
            onChange={(newDate) => handleDateSelect(newDate as Date)}
            sx={{
              color: "#fff",
              "& .MuiPickersDay-root": {
                color: "#fff",
                "&.Mui-selected": {
                  backgroundColor: "#4F46E5",
                },
              },
            }}
          />
        </LocalizationProvider>
      </Popover>
    </Box>
  )
}
