// Cliente API base para hacer peticiones HTTP
import axios from "axios"

// Crear una instancia de axios con configuración común
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Añadir withCredentials para permitir cookies en solicitudes CORS
  withCredentials: true,
})

// Interceptor para manejar tokens de autenticación
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores comunes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores comunes como 401, 403, etc.
    if (error.response?.status === 401) {
      // Redirigir a login o refrescar token
      console.log("Sesión expirada")
      // window.location.href = '/login';
    }

    // Mejorar el manejo de errores CORS
    if (error.message && error.message.includes("Network Error")) {
      console.error("Error de red detectado. Posible problema CORS:", error)
      console.error(
        "Verifica que el servidor esté configurado correctamente para aceptar solicitudes desde:",
        window.location.origin,
      )
    }

    return Promise.reject(error)
  },
)

export default apiClient
