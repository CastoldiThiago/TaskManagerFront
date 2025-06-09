import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

interface AuthContextProps {
    isAuthenticated: boolean;
    logout: () => void;
    login: (jwt: string) => void;
    token: string | null;
    name: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    const isAuthenticated = !!token;
    
    const login = (jwt:string) => {
        setToken(jwt);
        const decoded = parseJwt(jwt);
        localStorage.setItem('authToken', jwt);
        if (decoded?.name) {
            localStorage.setItem('name', decoded.name);
            setName(decoded.name)
        }
    }

    const logout = () => {
        setToken(null);
        setName(null)
        localStorage.removeItem('authToken');
        localStorage.removeItem('name')
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout, token, name,  login }}>
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