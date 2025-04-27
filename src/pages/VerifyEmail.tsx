import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import config from '../config';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState(location.state?.email || '');
    const [code, setCode] = React.useState('');
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [resendOk, setResendOk] = React.useState(true);
    const [segundosRestantes, setSegundosRestantes] = React.useState(30); // Estado para los segundos restantes

    const handleVerify = async () => {
        try {
            await axios.post(`${config.backendUrl}/auth/verify`, { email, code });
            setMessage('Correo verificado exitosamente. Ahora puedes iniciar sesión.');
            setTimeout(() => navigate('/'), 3000); // Redirigir al login después de 3 segundos
        } catch (error: any) {
            console.error('Error al verificar el correo:', error);
            setError('El código de verificación es incorrecto. Inténtalo de nuevo.');
        }
    };
    
    const startCountdown = () => {
        setSegundosRestantes(10);
        const interval = setInterval(() => {
            setSegundosRestantes((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendOk(true);
                    return 30; // Reiniciar el contador
                }
                return prev - 1;
            });
        }, 1000);
    };

    const waitForResend = () => {
        setResendOk(false); // Deshabilitar el botón de reenviar código
        startCountdown(); // Iniciar el contador
    };
    const handleResendCode = async () => {
        waitForResend();
        try {
            await axios.post(`${config.backendUrl}/auth/resend`, { email });
            setMessage('Código de verificación reenviado. Revisa tu correo.');
        }
        catch (error: any) {
            console.error('Error al reenviar el código:', error);
            setError('No se pudo reenviar el código. Inténtalo de nuevo.');
        }
    };


    return (
        <Box sx={{ 
                maxWidth: 400,
                padding: 4,
                border: '1px solid #ccc',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                color: '#000'
            }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Verificar correo electrónico
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Hemos enviado un código de verificación a tu correo: <strong>{email}</strong>
            </Typography>
            {message && <Alert severity="success" sx={{ marginBottom: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
            <TextField
                label="Código de verificación"
                variant="outlined"
                fullWidth
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleVerify}
            >
                Verificar
            </Button>
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleResendCode}
                disabled={!resendOk} // Deshabilitar el botón si ya se ha reenviado el código
            >
                Reenviar código {resendOk ? '' : `(${segundosRestantes})`}
            </Button>
        </Box>
        
    );
};

export default VerifyEmail;