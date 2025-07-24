import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material';
import { format, isFuture, set } from 'date-fns';
import { useTaskContext } from '../../../context/TaskContext';
import { useTitle } from '../../../context/TitleContext';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import AddTask from '../../../components/AddTask';

const HomePage = () => {
  const {
    tasks,
    isLoading,
    fetchTasks,
  } = useTaskContext();
  const { setTitle } = useTitle();
  const [name, setName] = React.useState(localStorage.getItem("name") || null);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('');
    fetchTasks(); // Load tasks on mount

  }, [fetchTasks]);

  const today = new Date();

  const tasksForToday = tasks.filter(
    task => task.movedToMyDay == true
  );
  const upcomingTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.status === "DONE") return false;
      return isFuture(new Date(task.dueDate));
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()})
    .slice(0, 3); // show top 3 upcoming tasks

  const completedToday = tasksForToday.filter(task => task.status === "DONE").length;
  const pendingToday = tasksForToday.length - completedToday;

  // Tareas vencidas (overdue)
  const overdueTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.status === "DONE") return false;
      const due = new Date(task.dueDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return due < now;
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3); // mostrar solo las 3 más próximas

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, overflowY: 'auto', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Welcome! {name ? name : ""}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Today is {format(today, 'EEEE, MMMM d, yyyy')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        justifyContent="space-between"
      >
        {/* Today's Tasks Card */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            <Typography>Completed: {completedToday}</Typography>
            <Typography>Pending: {pendingToday}</Typography>
            <Button variant="contained" size="small" onClick={()=> navigate("/home/my-day")} sx={{ mt: 2 }}>
              Go to My Day
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks Card */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <Box key={task.id} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {task.title} – {format(new Date(task.dueDate!), 'MM/dd/yyyy')}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No upcoming tasks</Typography>
            )}
            <Button variant="outlined" size="small" onClick={()=> navigate("/home/all-my-tasks")} sx={{ mt: 2 }}>
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Overdue Tasks Card */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overdue Tasks
            </Typography>
            {overdueTasks.length > 0 ? (
              overdueTasks.map(task => (
                <Box key={task.id} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {task.title} – {format(new Date(task.dueDate!), 'MM/dd/yyyy')}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No overdue tasks</Typography>
            )}
            <Button variant="outlined" size="small" onClick={()=> navigate("/home/all-my-tasks")} sx={{ mt: 2 }}>
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <AddTask />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default HomePage;