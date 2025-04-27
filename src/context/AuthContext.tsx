import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface AuthContextProps {
    isAuthenticated: boolean;
    loginWithGoogle: () => void;
    logout: () => void;
    token: string | null; // Puede ser un token JWT o de Google
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    const isAuthenticated = !!token;

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setToken(tokenResponse.access_token);
            localStorage.setItem('authToken', tokenResponse.access_token); // Guardar el token de Google
        },
        onError: (error) => {
            console.error('Error al iniciar sesión con Google:', error);
        },
    });

    const logout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginWithGoogle, logout, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};