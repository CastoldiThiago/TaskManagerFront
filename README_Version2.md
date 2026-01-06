# 📋 Task Manager - Frontend

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Frontend de una aplicación completa de gestión de tareas desarrollada con React y TypeScript

[Demo en Vivo](https://taskmanagerfront-absm.onrender.com/home) · [Reportar Bug](https://github.com/CastoldiThiago/TaskManagerFront/issues) · [Solicitar Función](https://github.com/CastoldiThiago/TaskManagerFront/issues)

</div>

---

## 📖 Sobre el Proyecto

Task Manager es una aplicación web moderna de gestión de tareas desarrollada para demostrar y practicar conocimientos en React y Java. Este repositorio contiene el frontend de la aplicación, construido con React 19, TypeScript y Material-UI.  

El proyecto implementa un sistema completo de gestión de tareas con características avanzadas como drag & drop, organización por listas, vista "Mi Día" y autenticación segura mediante JWT. 

> ⚠️ **Nota sobre el rendimiento**:  La aplicación puede presentar lentitud debido a que está desplegada completamente en el plan gratuito de Render. Se recomienda paciencia al cargar inicialmente.

---

## ✨ Características Principales

### 🎯 Gestión de Tareas
- ✅ **Drag & Drop**:  Arrastra y suelta tareas para cambiar su estado de forma intuitiva
- 📅 **Mi Día**: Vista especial para tareas del día actual
- 📝 **Listas Personalizadas**: Organiza tareas en diferentes listas según tus necesidades
- 🔄 **Estados de Tareas**:  Gestiona el flujo de trabajo con múltiples estados

### 🔐 Autenticación y Seguridad
- 🔑 **Login JWT**:  Sistema de autenticación seguro con tokens JWT
- 👤 **Gestión de Usuarios**:  Sistema completo de registro e inicio de sesión
- 🔒 **Rutas Protegidas**: Acceso seguro a funcionalidades según autenticación

### 🎨 Interfaz de Usuario
- 💎 **Material-UI**: Diseño moderno y responsivo con componentes de Material-UI
- 📱 **Responsive Design**:  Adaptable a diferentes tamaños de pantalla
- 🌈 **Experiencia Visual**:  Interfaz limpia y profesional

---

## 🛠️ Tecnologías Utilizadas

### Core
- **[React 19](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool y dev server ultra rápido

### UI & Styling
- **[Material-UI v7](https://mui.com/)** - Componentes de interfaz de usuario
- **[@emotion/react](https://emotion.sh/)** - CSS-in-JS
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[React Icons](https://react-icons.github.io/react-icons/)** - Librería de iconos

### Funcionalidades
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop (fork de react-beautiful-dnd)
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios
- **[React Router DOM v7](https://reactrouter.com/)** - Enrutamiento
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[jwt-decode](https://github.com/auth0/jwt-decode)** - Decodificación de tokens JWT
- **[date-fns](https://date-fns.org/)** - Utilidades de fecha

### Herramientas de Desarrollo
- **[ESLint](https://eslint.org/)** - Linter de código
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de utilidades CSS

---

## 🚀 Comenzando

### Prerequisitos

Asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **npm** o **yarn**

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/CastoldiThiago/TaskManagerFront.git
cd TaskManagerFront
```

2. **Instala las dependencias**
```bash
npm install
# o
yarn install
```

3. **Configura las variables de entorno**
```bash
# Crea un archivo .env en la raíz del proyecto
# Agrega la URL de tu backend
VITE_API_URL=http://localhost:8080/api
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abre tu navegador**
```
http://localhost:5173
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Compila la aplicación para producción
npm run preview      # Previsualiza la compilación de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar el código
```

---

## 🏗️ Estructura del Proyecto

```
TaskManagerFront/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas/vistas de la aplicación
│   ├── hooks/          # Custom hooks
│   ├── services/       # Servicios y llamadas a API
│   ├── context/        # Context API providers
│   ├── utils/          # Funciones utilitarias
│   ├── types/          # Definiciones de TypeScript
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Punto de entrada
├── index. html
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

---

## 🔗 Backend

Este proyecto se conecta con un backend desarrollado en Java.  Asegúrate de tener el backend corriendo para utilizar todas las funcionalidades.

[🔗 Repositorio del Backend](https://github.com/CastoldiThiago/TaskManagerBack)

---

## 🌐 Deployment

La aplicación está desplegada en **Render**:
- **URL de Producción**: [https://taskmanagerfront-absm.onrender.com/home](https://taskmanagerfront-absm. onrender.com/home)

Tanto el frontend como el backend están desplegados en **Render** (plan gratuito), lo que puede ocasionar tiempos de respuesta más lentos, especialmente en la primera carga después de un período de inactividad.

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.  

---

## 👤 Autor

**Thiago Castoldi**

- GitHub: [@CastoldiThiago](https://github.com/CastoldiThiago)
- LinkedIn: [Thiago Castoldi](https://www.linkedin.com/in/thiagocastoldi/)

---

## 🙏 Agradecimientos

- Este proyecto fue desarrollado como parte de mi aprendizaje continuo en React y desarrollo full-stack
- Agradecimiento especial a la comunidad de React y Material-UI por su excelente documentación
- A todos los que prueben y proporcionen feedback sobre la aplicación

---

<div align="center">

⭐ Si te gusta este proyecto, considera darle una estrella! 

Hecho con ❤️ por [Thiago Castoldi](https://github.com/CastoldiThiago)

</div>