# Task Manager Frontend

A modern task management application built with React and TypeScript.

## Features

- Task creation, editing, and deletion
- User authentication and authorization
- Responsive design
- Real-time updates

## Authentication

The application supports user authentication with email and password. 

**Note:** The codebase includes integration with `@react-oauth/google` for Google login functionality. However, this feature is currently disabled due to cost considerations. The implementation remains in the code for potential future activation.

## Technologies Used

- React
- TypeScript
- Vite
- React Router
- Axios for API calls
- @react-oauth/google (integration present but disabled)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
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

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service functions
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
