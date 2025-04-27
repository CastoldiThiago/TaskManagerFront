import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setMessage("Si el correo es válido, recibirás instrucciones para restablecer tu contraseña.");
        reset(); // Limpiar el formulario
      } else {
        setErrorMessage("No se pudo enviar el correo. Inténtalo de nuevo.");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        padding: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        color: '#000',
        margin: '0 auto',
        marginTop: '50px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Recuperar Contraseña
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ingresa tu correo electrónico para recibir un enlace de recuperación.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {message && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('email', {
            required: 'El correo electrónico es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'El formato del correo electrónico no es válido',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Enviar Enlace
        </Button>
      </form>
    </Box>
  );
};

export default ForgotPassword;