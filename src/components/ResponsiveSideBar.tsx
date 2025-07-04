"use client"

import * as React from "react"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import CssBaseline from "@mui/material/CssBaseline"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import TodayIcon from "@mui/icons-material/Today"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ListAltIcon from "@mui/icons-material/ListAlt"
import LogoutIcon from "@mui/icons-material/Logout"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTitle } from "../context/TitleContext"

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  minHeight: 0,
  overflow: "hidden",
  background: theme.palette.background.default,
  // Solo padding arriba para el AppBar
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(8),
  },
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

interface ResponsiveSidebarProps {
  children?: React.ReactNode
}

export default function ResponsiveSidebar({ children }: ResponsiveSidebarProps) {
  const theme = useTheme()
  const location = useLocation()
  const [open, setOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const { logout } = useAuth()
  const { title, setTitle } = useTitle()

  React.useEffect(() => {
    const storedUserName = localStorage.getItem("name")
    if (storedUserName) {
      setTitle(`Bienvenido! ${storedUserName}`)
    }
  }, [])

  const handleDrawerOpen = () => {
    if (!isClosing) setOpen(true)
    if (open) {
      setIsClosing(true)
      setOpen(false)
    }
  }

  const handleDrawerClose = () => {
    setIsClosing(true)
    setOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleLogOut = () => {
    logout()
  }

  const menuItems = [
    { text: "Mi día", path: "/home/my-day", icon: <TodayIcon /> },
    { text: "All My Tasks", path: "/home/all-my-tasks", icon: <AssignmentIcon /> },
    { text: "To Do", path: "/home/todo", icon: <CheckBoxIcon /> },
    { text: "Calendario", path: "/home/calendar", icon: <CalendarMonthIcon /> },
  ]

  const secondaryItems = [
    { text: "Lista de tareas", path: "/home/task-list", icon: <ListAltIcon /> },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 2,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, textAlign: "start" }}>
            {title}
          </Typography>
          <IconButton color="inherit" onClick={handleLogOut} edge="end">
            <LogoutIcon />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
              Cerrar sesión
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          height: "100vh",
        }}
        aria-label="mailbox folders"
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={open}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: 3,
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    "&.active, &:hover, &[aria-selected='true']": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "8px",
                      mx: 1,
                      width: "calc(100% - 16px)",
                    },
                    my: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {secondaryItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    "&.active, &:hover, &[aria-selected='true']": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "8px",
                      mx: 1,
                      width: "calc(100% - 16px)",
                    },
                    my: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: 3,
              height: "100vh",
            },
          }}
          open
        >
          <DrawerHeader>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              TaskManager
            </Typography>
          </DrawerHeader>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    "&.active, &:hover, &[aria-selected='true']": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "8px",
                      mx: 1,
                      width: "calc(100% - 16px)",
                    },
                    my: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {secondaryItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    "&.active, &:hover, &[aria-selected='true']": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "8px",
                      mx: 1,
                      width: "calc(100% - 16px)",
                    },
                    my: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <Main>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}