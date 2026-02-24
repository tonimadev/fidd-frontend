# FIDD Frontend

Frontend application for the FIDD platform - Sistema de Gerenciamento de Campanhas de Fidelização.

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

## Overview

FIDD Frontend is a modern web application that provides authentication and campaign management for loyalty programs. Built with Next.js and TypeScript, it offers a complete solution for store owners to manage customer loyalty campaigns.

## Tech Stack

- **Framework:** Next.js 16+
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form with Zod validation
- **HTTP Client:** Axios
- **Linting:** ESLint with Next.js configuration

## Features

### Authentication
- User registration for stores (CNPJ/CPF)
- Login functionality with JWT tokens
- Protected routes and session management
- Secure password validation
- Token refresh and expiration handling

### Campaign Management
- Create loyalty campaigns
- List all campaigns with filtering
- Delete campaigns
- View campaign status (Active/Inactive/Expired)
- Set point requirements and expiration dates
- Real-time validation

### UI/UX
- Responsive design for mobile and desktop
- Form validation with user-friendly error messages
- Loading states and error handling
- Tab-based navigation in dashboard
- Clean and modern interface

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard page (protected)
│   │   └── page.tsx
│   ├── login/                   # Login page
│   │   └── page.tsx
│   ├── register/                # Registration page
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   └── favicon.ico
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RegisterForm.tsx
│   └── campaigns/               # Campaign components
│       ├── CreateCampaignForm.tsx
│       └── CampaignsList.tsx
├── context/                      # React Context providers
│   └── auth-context.tsx
├── hooks/                        # Custom React hooks
│   └── useAuth.ts
├── lib/                          # Utility functions and services
│   ├── api-client.ts           # Axios client with interceptors
│   ├── auth-service.ts         # Authentication API calls
│   ├── campaign-service.ts     # Campaign API calls
│   └── validations.ts          # Zod schemas
├── types/                        # TypeScript type definitions
│   ├── auth.ts
│   └── campaign.ts
└── public/                       # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Backend API running on port 8080

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend through a Next.js proxy. All API calls are routed through `/api/*`:

### Authentication Endpoints
- `POST /api/web/v1/auth/register` - Register a new store
- `POST /api/web/v1/auth/login` - Login
- `GET /api/web/v1/auth/me` - Get current user info

### Campaign Endpoints
- `GET /api/web/v1/campaigns` - List all campaigns
- `POST /api/web/v1/campaigns` - Create a new campaign
- `PUT /api/web/v1/campaigns/:id` - Update a campaign
- `DELETE /api/web/v1/campaigns/:id` - Delete a campaign

## Validation

The application uses Zod for schema validation:

- Email: Valid email format
- Password: Minimum 8 characters, uppercase, lowercase, number, and special character
- CNPJ: 14 digits
- CPF: 11 digits
- Campaign Name: 3-100 characters
- Points Required: 1-10000
- Expiration Date: Must be in the future

## Authentication Flow

1. User registers with store details (name, CNPJ/CPF, email, password)
2. Server returns JWT token
3. Token stored in localStorage
4. Token automatically added to all subsequent requests via interceptor
5. On token expiration (401), user redirected to login
6. User can logout and clear session data

## Proxy Configuration

The project uses Next.js rewrites to proxy API requests. This solves CORS issues by:

1. Frontend makes request to `/api/...` (same origin)
2. Next.js rewrites to `http://localhost:8080/api/...`
3. Response returned to frontend
4. No CORS errors occur

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API URL
```

## Security

- JWT tokens stored securely in localStorage
- Tokens automatically cleared on 401 responses
- Protected routes require authentication
- Password validation enforces strong passwords
- Form validation prevents invalid data submission

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)




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



