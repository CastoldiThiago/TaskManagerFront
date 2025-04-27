import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extrae el token de la URL
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setErrorMessage("Token inválido o faltante");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Las contraseñas no coinciden" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });

      if (response.ok) {
        setSuccess("Contraseña actualizada correctamente");
        setTimeout(() => {
          navigate("/"); // Redirige al usuario a la página de inicio de sesión después de 3 segundos
        }, 3000);
      } else {
        setErrorMessage("Error al actualizar la contraseña:");
      }
    } catch (err) {
      setErrorMessage("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        padding: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        color: "#000",
        margin: "0 auto",
        marginTop: "50px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Restablecer Contraseña
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {success}
          </Alert>
        )}
        <TextField
          label="Nueva Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("newPassword", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
        <TextField
          label="Confirmar Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("confirmPassword", {
            required: "Debes confirmar tu contraseña",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Actualizar Contraseña
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;