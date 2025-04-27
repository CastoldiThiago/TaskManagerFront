import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return; // si ya procesó, no hace nada (por react strict mode que ejecuta dos veces)
        processed.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/home');
        } else {
            console.error('No se encontró token en la URL');
            navigate('/');
        }
        //  Solo se ejecuta una vez al montar
    }, []); 

    return <p>Procesando autenticación...</p>;
};

export default OAuthSuccess;