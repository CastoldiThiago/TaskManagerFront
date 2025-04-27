import React from 'react';
import ResponsiveSideBar from '../../components/ResponsiveSideBar';
import { Box, Button } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AllMyTasks from './pages/AllMyTasks';
import ToDo from './pages/ToDo';
import TaskList from './pages/TaskList';
import Calendar from './pages/Calendar';
import MyDay from './pages/MyDay';
import HomePage from './pages/HomePage';
import { TaskProvider } from '../../context/TaskContext';

const Home: React.FC = () => {


    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>

      {/* Barra lateral izquierda */}
      <ResponsiveSideBar>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, padding: 3 }}>
        <TaskProvider>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="all-my-tasks" element={<AllMyTasks />} />
          <Route path="todo" element={<ToDo />} />
          <Route path="task-list" element={<TaskList />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="my-day" element={<MyDay />} />
        </Routes>
        </TaskProvider>
      </Box>
      </ResponsiveSideBar>

    </Box>
    
    );
};

export default Home;