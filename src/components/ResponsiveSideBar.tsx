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
import ListAltIcon from "@mui/icons-material/ListAlt"
import LogoutIcon from "@mui/icons-material/Logout"
import AddIcon from "@mui/icons-material/Add"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTitle } from "../context/TitleContext"
import { useTaskContext } from "../context/TaskContext"
import { Button } from "@mui/material"

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
  const {lists, createList} = useTaskContext()
  const navigate = useNavigate()

  const handleAddList = async () => {
    try {
      const newList = await createList({ name: "New List" })
      // Redirige a la página de la nueva lista
      navigate(`/home/task-list/${newList.id}`)
    } catch (e) {
      alert("No se pudo crear la lista.")
    }
  }
  
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

  const handleLogout = async () => {
  await logout(); 
  navigate("/");
};

  const menuItems = [
    { text: "My Day", path: "/home/my-day", icon: <TodayIcon /> },
    { text: "All My Tasks", path: "/home/all-my-tasks", icon: <AssignmentIcon /> },
    { text: "To Do", path: "/home/todo", icon: <CheckBoxIcon /> },
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
          <IconButton color="inherit" onClick={handleLogout} edge="end">
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
          <Typography variant="subtitle2" sx={{ px: 2, pt: 1, color: "text.secondary" }}>
            My Lists
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pb: 10, // espacio para el botón
              position: "relative",
              minHeight: 0,
              maxHeight: "calc(100vh - 260px)", // ajusta según tu diseño
            }}
          >
            <List>
              {lists.map((list) => (
                <ListItem key={list.id} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={`/home/task-list/${list.id}`}
                    selected={location.pathname === `/home/task-list/${list.id}`}
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
                    <ListItemIcon>
                      <ListAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={list.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          {/* Botón fijo abajo */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              p: 2,
              bgcolor: "background.paper",
              borderTop: "1px solid #eee",
              textAlign: "center",
            }}
          >
            <IconButton
              color="primary"
              size="large"
              onClick={handleAddList}
              sx={{ borderRadius: 2 }}
              aria-label="Add new list"
            >
              <AddIcon />
              <Typography sx={{ ml: 1, fontWeight: 500, fontSize: 16 }}>
                New List
              </Typography>
            </IconButton>
          </Box>
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
              position: "relative",
            },
          }}
          open
        >
          <DrawerHeader>
            <Button onClick={()=>navigate("/home")} sx={{
               textTransform: "none", 
               width: "100%",
               '&:focus': {
                  outline: 'none',
                },
                '&.Mui-focusVisible': {
                  boxShadow: 'none',
                }
               }}>
            <Typography variant="h6" component="div">
              TaskManager
            </Typography>
            </Button>
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
          <Typography variant="subtitle2" sx={{ px: 2, pt: 1, color: "text.secondary" }}>
            My Lists
          </Typography>
          {/* Box scrolleable para las listas */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pb: 10, // espacio para el botón
              position: "relative",
              minHeight: 0,
              maxHeight: "calc(100vh - 260px)", // ajusta según tu diseño
            }}
          >
            <List>
              {lists.map((list) => (
                <ListItem key={list.id} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={`/home/task-list/${list.id}`}
                    selected={location.pathname === `/home/task-list/${list.id}`}
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
                    <ListItemIcon>
                      <ListAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={list.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          {/* Botón fijo abajo */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              p: 2,
              bgcolor: "background.paper",
              borderTop: "1px solid #eee",
              textAlign: "center",
            }}
          >
            <IconButton
              color="primary"
              size="large"
              onClick={handleAddList}
              sx={{ borderRadius: 2 }}
              aria-label="Add new list"
            >
              <AddIcon />
              <Typography sx={{ ml: 1, fontWeight: 500, fontSize: 16 }}>
                New List
              </Typography>
            </IconButton>
          </Box>
        </Drawer>
      </Box>
      <Main>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}