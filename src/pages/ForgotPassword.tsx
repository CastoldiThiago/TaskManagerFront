import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography, Alert, Avatar, Divider } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';
import config from '../config';

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${config.backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setMessage("If the email is valid, you will receive instructions to reset your password.");
        reset(); // Clear the form
      } else {
        setErrorMessage("Could not send the email. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 0, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: { xs: 2, sm: 4 },
          border: { xs: 'none', sm: '1px solid #e0e0e0' },
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: { xs: 'none', sm: '0 4px 16px rgba(0,0,0,0.10)' },
          textAlign: 'center',
          bgcolor: '#fafbfc',
          color: '#222',
        }}
      >
        <Avatar sx={{ margin: '0 auto', bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockResetIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, letterSpacing: 0.5 }} gutterBottom>
          Forgot your password?
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', marginTop: 0 }}>
          {message && (
            <Alert severity="success" sx={{ mb: 2, fontSize: 15 }}>
              {message}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 15 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            autoFocus
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              background: '#fff',
              borderRadius: 1,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, fontWeight: 600, fontSize: 17, py: 1.2, borderRadius: 2, boxShadow: 1 }}
          >
            Send Reset Link
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2, mb: 1, fontWeight: 500, fontSize: 15, textTransform: 'none' }}
            onClick={() => navigate("/")}
          >
            ← Back to login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;