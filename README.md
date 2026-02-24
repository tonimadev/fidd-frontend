# FIDD Frontend

Frontend application for the FIDD platform built with Next.js and TypeScript.

## Quick Start

### In WebStorm

The easiest way to run the project in WebStorm:

1. **Open the NPM panel** - View > Tool Windows > NPM
2. **Double-click `dev`** under the scripts list
3. The server starts automatically at `http://localhost:3000`

Or use the Run button in the toolbar and select the `dev` configuration.

For detailed WebStorm setup instructions, see [WEBSTORM_SETUP.md](./WEBSTORM_SETUP.md)

### In Terminal

```bash
npm run dev
```



FIDD Frontend is a modern web application that provides a complete authentication system with support for login, signup, CNPJ and CPF validation. The application is built with the latest web technologies and follows best practices for security and user experience.

## Tech Stack

- **Framework:** Next.js 14+
- **Language:** TypeScript
- **Styling:** CSS with PostCSS
- **Linting:** ESLint with Next.js configuration
- **Package Manager:** npm

## Features

- User Authentication System
  - Login functionality
  - User registration
  - CNPJ validation support
  - CPF validation support
- Protected Routes
- Authentication Context API
- Form validation
- API client integration

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page (protected)
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles
│   └── favicon.ico       # Favicon
├── components/           # React components
│   └── auth/            # Authentication components
│       ├── LoginForm.tsx
│       ├── ProtectedRoute.tsx
│       └── RegisterForm.tsx
├── context/             # React Context providers
│   └── auth-context.tsx
├── hooks/               # Custom React hooks
│   └── useAuth.ts
├── lib/                 # Utility functions
│   ├── api-client.ts
│   ├── auth-service.ts
│   └── validations.ts
└── types/              # TypeScript type definitions
    └── auth.ts
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fidd-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the required environment variables. You can copy from `.env.example`:
```bash
cp .env.example .env.local
```

The `.env.local` file should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

This points to the Spring Boot backend running on port 8080.

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build

Build for production:
```bash
npm run build
```

### Start Production Server

Run the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration Files

- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.mjs** - ESLint configuration
- **postcss.config.mjs** - PostCSS configuration

## Authentication

The application uses a custom authentication context to manage user state across the application. Protected routes use the `ProtectedRoute` component to ensure only authenticated users can access certain pages.

### Using the Auth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function Component() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use auth state and methods
}
```

## Backend Integration

This frontend is designed to work with a Spring Boot backend API running on port 8080. The backend provides the following endpoints:

- `POST /api/web/v1/auth/login` - User login
- `POST /api/web/v1/auth/register` - User registration
- `GET /api/web/v1/auth/me` - Get current user information

The API base URL is configured via the `NEXT_PUBLIC_API_URL` environment variable, which defaults to `http://localhost:8080`.

### Starting the Backend

Make sure your Spring Boot backend is running on port 8080:
```bash
cd <backend-project-directory>
./mvnw spring-boot:run
```

Then start the frontend development server in a separate terminal:
```bash
npm run dev
```



## Security Considerations

- Form inputs are validated using the validations utility
- CNPJ and CPF validations are implemented
- Protected routes prevent unauthorized access
- Environment variables are used for sensitive configuration

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, please contact the development team.



