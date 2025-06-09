import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import config from '../config'
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Divider,
    Link,
    Avatar,
    Container,
    Alert,
    SnackbarCloseReason,
    Snackbar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';

interface FormData {
    name: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<FormData>();
    const [isLoginMode, setIsLoginMode] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [registerMessage, setRegisterMessage] = React.useState<string | null>(null); 
    const navigate = useNavigate();
    const { isAuthenticated, token, login } = useAuth();

    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Redirigir a la página de recuperación de contraseña
    };
    
    const handleLoginRegister = ()=>{
        setIsLoginMode(!isLoginMode);
        setErrorMessage(null);
        reset(); // Limpiar el formulario
    }
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
      const onSubmit = async (data: FormData) => {
        setErrorMessage(null); // Limpiar mensajes de error globales
        try {
            if (isLoginMode) {
                // Login
                const response = await axios.post(`${config.backendUrl}/auth/login`, {
                    email: data.email,
                    password: data.password,
                });
                login(response.data); // Actualizar el estado del contexto
                navigate('/home');
            } else {
                // Register
                await axios.post(`${config.backendUrl}/auth/register`, {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                });
                // Redirigir a la pantalla de verificación de correo
                navigate('/verify-email', { state: { email: data.email } });
            }
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
    
                if (isLoginMode) {
                    // Manejar errores específicos del login
                    if (status === 401) {
                        setErrorMessage(data); // Usuario o contraseña incorrectos
                    } else {
                        setErrorMessage('Ocurrió un error inesperado. Inténtalo de nuevo.');
                    }
                } else {
                    // Manejar errores específicos del registro
                    if (status === 409) {
                        if (data.includes('correo')) {
                            setError('email', { type: 'manual', message: data });
                        }
                    } else if (status === 400) {
                        setErrorMessage(data); // Mostrar mensaje de solicitud inválida
                    } else {
                        setErrorMessage('Ocurrió un error inesperado. Inténtalo de nuevo.');
                    }
                }
            } else {
                setErrorMessage('No se pudo conectar con el servidor. Inténtalo de nuevo.');
            }
        }
    };

    const handleLoginSuccess = async (credentialResponse: any) => {
        const idToken = credentialResponse.credential;

        // Enviás el idToken al backend para validarlo y generar tu propio JWT
        const res = await fetch(`${config.backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        });

        if (res.ok) {
        const { jwt } = await res.json();
        login(jwt);
        navigate('/home');
        } else {
        console.error('Error validando el token');
        }
  };

    useEffect(() => {
        if (isAuthenticated && token) {
            navigate('/home');
        }
    }, [isAuthenticated, token, navigate]);

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
                color: '#000'
            }}
        >
            <Snackbar
                open={open}
                autoHideDuration={5500}
                onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Registro completado! ya puedes iniciar sesión
                </Alert>
            </Snackbar>
            {/* Título principal */}
            <Avatar sx={{ margin: '0 auto', bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Task Manager
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
                {isLoginMode ? 'Bienvenido, por favor inicia sesión.' : 'Crea una cuenta para comenzar a gestionar tus tareas.'}
            </Typography>

            {/* Mensaje de error global */}
            {errorMessage && (
                <Alert severity='error'>{errorMessage}</Alert>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                <TextField
                        label="Email"
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
                
                {!isLoginMode && (
                    <TextField
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    />
                )}
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    
                    {...register('password', {
                        required: 'La contraseña es obligatoria',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                {isLoginMode && (
                    <Typography variant="body2">
                        ¿Olvidaste tu contraseña?{' '}
                        <Link 
                        sx={{ 
                            color: 'primary.main', 
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'primary.main',
                                cursor: 'pointer',
                            },
                        }}
                        type={'button'}
                        onClick={() => handleForgotPassword()}
                        >
                            Recuperar contraseña
                        </Link>
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    {isLoginMode ? 'Iniciar sesión' : 'Registrarse'}
                </Button>
            </form>

            {/* Divider y botón de Google */}
            <Divider sx={{ marginY: 2 }} />
            {isLoginMode && (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                        console.log('Fallo el login con Google');
                    }}
                />
            )}

            {/* Alternar entre Login y Registro */}
            <Typography variant="body2" sx={{ marginTop: 2 }}>
                {isLoginMode ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
                <Link
                    component="button"
                    onClick={() => handleLoginRegister()}
                    sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                    {isLoginMode ? 'Regístrate' : 'Inicia sesión'}
                </Link>
            </Typography>
        </Box>
    );
};

export default Login;