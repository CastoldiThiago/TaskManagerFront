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
import { TitleProvider } from '../../context/TitleContext';

const Home: React.FC = () => {


    return (
      <TitleProvider>
      {/* Barra lateral izquierda */}
      <ResponsiveSideBar>

      {/* Contenido principal */}
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
      </ResponsiveSideBar>
      </TitleProvider>
    
    );
};

export default Home;