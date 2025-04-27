// Cliente API base para hacer peticiones HTTP con proxy
import axios from "axios"

// Crear una instancia de axios con configuración común
const apiClient = axios.create({
  baseURL: "/api", // Usa el proxy configurado en vite.config.ts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Resto del código sin cambios...

export default apiClient
