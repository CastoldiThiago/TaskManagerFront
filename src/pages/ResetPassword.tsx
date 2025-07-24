import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Avatar, Divider } from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';
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
  const token = searchParams.get("token"); // Extract token from URL
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setErrorMessage("Invalid or missing token");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });

      if (response.ok) {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/"); // Redirect to login after 3 seconds
        }, 3000);
      } else {
        setErrorMessage("Error updating password. Please try again.");
      }
    } catch (err) {
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
          Reset your password
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Enter your new password below. Password must be at least 8 characters.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', marginTop: 0 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 15 }}>
              {errorMessage}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, fontSize: 15 }}>
              {success}
            </Alert>
          )}
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            autoFocus
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{
              background: '#fff',
              borderRadius: 1,
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;