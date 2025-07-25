import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

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

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  logout: () => void;
  login: (jwt: string) => void;
  refresh: () => Promise<string | null>;
  token: string | null;
  name: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const login = (jwt: string) => {
    if (isTokenExpired(jwt)) {
      logout();
      return;
    }
    setToken(jwt);
    localStorage.setItem('authToken', jwt);

    const decoded = parseJwt(jwt);
    if (decoded?.name) {
      setName(decoded.name);
      localStorage.setItem('name', decoded.name);
    }
  };

  const logout = async () => {
    setToken(null);
    setName(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');

    // Pedir al backend que elimine la cookie
    try {
      await fetch(`${config.backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Error cerrando sesión en el backend:', e);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${config.backendUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // 🔥 enviar cookie refreshToken
      });

      if (!res.ok) throw new Error('Refresh falló');

      const data = await res.json();
      const newToken = data.accessToken;

      setToken(newToken);
      localStorage.setItem('authToken', newToken);

      const decoded = parseJwt(newToken);
      if (decoded?.name) {
        setName(decoded.name);
        localStorage.setItem('name', decoded.name);
      }

      return newToken;
    } catch (err) {
      console.error('Error al refrescar token:', err);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    const checkToken = async () => {
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        const decoded = parseJwt(storedToken);
        if (decoded?.name) {
          setName(decoded.name);
        }
      } else {
        await refreshAccessToken();
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        login,
        refresh: refreshAccessToken,
        token,
        name,
      }}
    >
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