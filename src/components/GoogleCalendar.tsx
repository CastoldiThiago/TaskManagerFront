import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GoogleCalendar: React.FC = () => {
    const { token, loginWithGoogle } = useAuth();

    const createEvent = async () => {
        if (!token) {
            console.error('No hay token de acceso disponible');
            return;
        }

        try {
            const event = {
                summary: 'Nueva tarea',
                description: 'Descripción de la tarea',
                start: {
                    dateTime: '2025-03-28T09:00:00-07:00',
                    timeZone: 'America/Los_Angeles',
                },
                end: {
                    dateTime: '2025-03-28T10:00:00-07:00',
                    timeZone: 'America/Los_Angeles',
                },
            };

            const response = await axios.post(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                event,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Evento creado:', response.data);
        } catch (error) {
            console.error('Error al crear el evento:', error);
        }
    };

    return (
        <div>
            {!token ? (
                <button
                    onClick={loginWithGoogle}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4285F4',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Conectar con Google Calendar
                </button>
            ) : (
                <button
                    onClick={createEvent}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#34A853',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Crear evento en Google Calendar
                </button>
            )}
        </div>
    );
};

export default GoogleCalendar;