// Cliente API base para hacer peticiones HTTP
import axios, { AxiosError } from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Necesario para enviar cookie refreshToken
})

// Interceptor de solicitud: adjunta el accessToken
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Función para refrescar el token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post("http://localhost:8080/api/auth/refresh", {}, {
      withCredentials: true,
    })
    const newToken = res.data.accessToken
    localStorage.setItem("authToken", newToken)
    return newToken
  } catch (error) {
    console.error("No se pudo refrescar el token:", error)
    return null
  }
}

// Interceptor de respuesta: si hay error 401, intenta refrescar el token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Si es un error 401 y no intentamos ya refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await refreshAccessToken()

      if (newToken) {
        // Reintenta la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } else {
        // Si no se puede refrescar, redirige al login
        localStorage.removeItem("authToken")
        window.location.href = "/login"
      }
    }

    // Errores de red (ej. CORS)
    if (error.message && error.message.includes("Network Error")) {
      console.error("Error de red detectado. Posible problema CORS:", error)
      console.error("Verifica que el servidor acepte solicitudes desde:", window.location.origin)
    }

    return Promise.reject(error)
  }
)

export default apiClient