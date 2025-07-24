import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, Avatar, Divider } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import config from '../config';
import { set } from 'date-fns';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState(location.state?.email || '');
    const [code, setCode] = React.useState('');
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [resendOk, setResendOk] = React.useState(true);
    const [secondsLeft, setSecondsLeft] = React.useState(30); // Countdown for resend
    const [isResending, setIsResending] = React.useState(false);
    const [resendMessage, setResendMessage] = React.useState<string | null>(null);

    const handleVerify = async () => {
        setMessage(null);
        setError(null);
        
        try {
            await axios.post(`${config.backendUrl}/api/auth/verify`, { email, code });
            setMessage('Email successfully verified! You can now log in.');
            setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
        } catch (error: any) {
            console.error('Error verifying email:', error);
            setError('The verification code is incorrect. Please try again.');
        }
    };

    const startCountdown = () => {
        setSecondsLeft(10);
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendOk(true);
                    return 30; // Reset counter
                }
                return prev - 1;
            });
        }, 1000);
    };

    const waitForResend = () => {
        setResendOk(false); // Disable resend button
        startCountdown(); // Start countdown
    };
    const handleResendCode = async () => {
        setIsResending(true);
        setResendMessage('Sending verification email...');
        setMessage(null);   
        setError(null);
        waitForResend();
        try {
            await axios.post(`${config.backendUrl}/api/auth/resend`, { email });
            setMessage('Verification code resent. Check your email.');
            setResendMessage(null);
        }
        catch (error: any) {
            console.error('Error resending code:', error);
            setError('Could not resend the code. Please try again.');
            setResendMessage(null);
        }
        setIsResending(false);
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
                p: { xs: 1, sm: 2 },
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
                    backgroundColor: '#fafbfc',
                    color: '#222',
                }}
            >
                <Avatar sx={{ margin: '0 auto', bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <MarkEmailReadIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, letterSpacing: 0.5 }} gutterBottom>
                    Verify your email
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    We've sent a verification code to your email: <strong>{email}</strong>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {message && <Alert severity="success" sx={{ mb: 2, fontSize: 15 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2, fontSize: 15 }}>{error}</Alert>}
                <TextField
                    label="Verification code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                    sx={{ background: '#fff', borderRadius: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mt: 2, fontWeight: 600, fontSize: 17, py: 1.2, borderRadius: 2, boxShadow: 1 }}
                    onClick={handleVerify}
                >
                    Verify
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2, fontWeight: 500, fontSize: 15, textTransform: 'none' }}
                    onClick={handleResendCode}
                    disabled={!resendOk || isResending}
                >
                    {isResending ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ marginRight: 8 }}>Sending...</span>
                            <span className="MuiCircularProgress-root MuiCircularProgress-colorPrimary" style={{ width: 18, height: 18 }}>
                                <svg className="MuiCircularProgress-svg" viewBox="22 22 44 44">
                                    <circle className="MuiCircularProgress-circle" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" />
                                </svg>
                            </span>
                        </span>
                    ) : (
                        <>Resend code {resendOk ? '' : `(${secondsLeft})`}</>
                    )}
                </Button>
                {resendMessage && (
                    <Alert severity="info" sx={{ mt: 2 }}>{resendMessage}</Alert>
                )}
            </Box>
        </Box>
    );
};

export default VerifyEmail;