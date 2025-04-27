import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthSuccess from './pages/OAuthSuccess';
import { AuthProvider } from './context/AuthContext';
import VerifyEmail from './pages/VerifyEmail';
import { CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#773344',
    },
    secondary: {
      main: '#0B0014',
    },
    background: {
      default: '#F5E9E2'
    }
  },
  }
)

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/home/*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;