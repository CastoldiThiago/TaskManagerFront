# Task Manager Front

A modern task management application built with React and TypeScript.

## Features

- Task creation, editing, and deletion
- Task status management
- User authentication
- Responsive design
- Modern UI with Tailwind CSS

## Authentication and Security

The application includes JWT-based authentication with secure token management:

- **Standard Authentication**: Email and password login with JWT tokens
- **Google OAuth Implementation**: Google login functionality has been fully implemented in the codebase but is currently disabled in production due to API cost considerations. The feature can be easily enabled by configuring the appropriate Google OAuth credentials and environment variables when ready for deployment.

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios for API calls
- Vite as build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CastoldiThiago/TaskManagerFront.git
cd TaskManagerFront
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
VITE_API_URL=your_api_url_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Thiago Castoldi - [@CastoldiThiago](https://github.com/CastoldiThiago)

Project Link: [https://github.com/CastoldiThiago/TaskManagerFront](https://github.com/CastoldiThiago/TaskManagerFront)