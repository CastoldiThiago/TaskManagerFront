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
import apiClient from '../services/api/client';
import { set } from 'date-fns';

interface FormData {
    name: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<FormData>();
    const [isLoginMode, setIsLoginMode] = React.useState(true);
    const [verifyEmail, setVerifyEmail] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [registerMessage, setRegisterMessage] = React.useState<string | null>(null); 
    const [isRegistering, setIsRegistering] = React.useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, token, login } = useAuth();

    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Redirect to password recovery page
    };
    
    const handleLoginRegister = ()=>{
        setIsLoginMode(!isLoginMode);
        setErrorMessage(null);
        reset(); // Clear the form
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
        setErrorMessage(null); // Clear global error messages

        try {
            if (isLoginMode) {
                // Login
                const response = await apiClient.post("/auth/login", {
                    email: data.email,
                    password: data.password,
                });
                const accessToken = response.data.jwt;

                if (!accessToken) {
                    throw new Error("No accessToken received from server");
                }

                login(accessToken); // Use AuthContext to save token and name
                navigate("/home");
            } else {
                // Register
                setIsRegistering(true);
                setRegisterMessage("Creating account...");
                await apiClient.post("/auth/register", {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                });

                setRegisterMessage(null);
                setIsRegistering(false);
                // Redirect to email verification
                navigate("/verify-email", { state: { email: data.email } });
            }
        } catch (error: any) {
            setIsRegistering(false);
            setRegisterMessage(null);
            if (error.response) {
                const { status, data } = error.response;

                if (isLoginMode) {
                    // Login errors
                    if (status === 401) {
                        // Invalid credentials
                        setError("email", { type: "manual", message: "Email or password is incorrect" });
                        setError("password", { type: "manual", message: "Email or password is incorrect" });
                        setErrorMessage(null);
                    } else if (status === 404 || (typeof data === 'string' && data.toLowerCase().includes("not found"))) {
                        setError("email", { type: "manual", message: "Email not found" });
                        setErrorMessage(null);
                    } else if (status === 400 && typeof data === 'string' && data.toLowerCase().includes("password")) {
                        setError("password", { type: "manual", message: data });
                        setErrorMessage(null);
                    } else if (status === 409 || ( typeof data === 'string' && data.toLowerCase().includes("not verified"))){
                        setError("email", { type: "manual", message: "Email not verified. Please check your inbox." });
                        setErrorMessage(null);
                        setVerifyEmail(true);
                    }else {
                        setErrorMessage(typeof data === 'string' ? data : "An unexpected error occurred. Please try again.");
                    }
                } else {
                    // Register errors
                    if (status === 409 && data?.toLowerCase().includes("email")) {
                        setError("email", { type: "manual", message: "This email is already registered" });
                        setErrorMessage(null);
                    } else if (status === 400 && typeof data === 'string' && data.toLowerCase().includes("password")) {
                        setError("password", { type: "manual", message: data });
                        setErrorMessage(null);
                    } else if (status === 400 && typeof data === 'string' && data.toLowerCase().includes("name")) {
                        setError("name", { type: "manual", message: data });
                        setErrorMessage(null);
                    } else {
                        setErrorMessage(typeof data === 'string' ? data : "An unexpected error occurred. Please try again.");
                    }
                }
            } else {
                setErrorMessage("Could not connect to the server. Please try again.");
            }
        }
    };

    const handleLoginSuccess = async (credentialResponse: any) => {
        const idToken = credentialResponse.credential;

        try {
            const res = await fetch(`${config.backendUrl}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
            });

            if (!res.ok) {
            throw new Error('Error validating token with Google');
            }

            const { jwt: accessToken } = await res.json();

            if (!accessToken) {
            throw new Error('No accessToken received from backend');
            }

            login(accessToken); // Actualizar contexto y localStorage
            navigate('/home');
        } catch (error) {
            console.error('Fallo el login con Google:', error);
            setErrorMessage('Error signing in with Google. Please try again.');
            // Podés mostrar un mensaje de error si querés
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
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
                    Registration completed! You can now log in.
                </Alert>
            </Snackbar>
            {/* Main title */}
            <Avatar sx={{ margin: '0 auto', bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Task Manager
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
                {isLoginMode ? 'Welcome, please log in.' : 'Create an account to start managing your tasks.'}
            </Typography>

            {/* Global error message */}
            {errorMessage && (
                <Alert severity='error'>{errorMessage}</Alert>
            )}


            {/* Formulario de login/registro */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format',
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                {!isLoginMode && (
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('name', { required: 'Name is required' })}
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
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                {isLoginMode && (
                    <Typography variant="body2">
                        Forgot your password?{' '}
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
                            Recover password
                        </Link>
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={isRegistering}
                >
                    {isRegistering ? (
                        <>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ marginRight: 8 }}>Creating account...</span>
                                <span className="MuiCircularProgress-root MuiCircularProgress-colorPrimary" style={{ width: 20, height: 20 }}>
                                    <svg className="MuiCircularProgress-svg" viewBox="22 22 44 44">
                                        <circle className="MuiCircularProgress-circle" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" />
                                    </svg>
                                </span>
                            </span>
                        </>
                    ) : (
                        isLoginMode ? 'Log In' : 'Register'
                    )}
                </Button>
            </form>

            {/* Botón para ir a verificar el email si verifyEmail es true */}
            {verifyEmail && (
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                        // Obtener el valor actual del campo email
                        const emailValue = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
                        navigate('/verify-email', { state: { email: emailValue } });
                    }}
                >
                    Go to verify your email
                </Button>
            )}

            {/* Divider and Google button */}
            <Divider sx={{ marginY: 2 }} />
            {isLoginMode && (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                        console.log('Google login failed');
                    }}
                />
            )}
            {/* Mensaje de registro */}
            {registerMessage && (
                <Alert severity="info" sx={{ mt: 2 }}>{registerMessage}</Alert>
            )}

            {/* Toggle between Login and Register */}
            <Typography variant="body2" sx={{ marginTop: 2 }}>
                {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Link
                    component="button"
                    onClick={() => handleLoginRegister()}
                    sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                    {isLoginMode ? 'Register' : 'Log In'}
                </Link>
            </Typography>
        </Box>
        </Box>
    );
};

export default Login;