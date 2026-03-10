# FIDD Frontend Development Guidelines

This document provides technical details and guidelines for the FIDD frontend project.

## 1. Build and Configuration

### Environment Setup
- **Node.js**: 18.x or higher is required.
- **Next.js**: Version 16.1.6 (App Router enabled).
- **React**: Version 19.2.3 (React Compiler enabled).
- **Output**: Standalone mode is enabled for optimized production builds.
- **Dependencies**: Managed with `npm`. Run `npm install` after cloning.

### Environment Variables
The project uses `.env.local` for local environment variables.
- `NEXT_PUBLIC_API_URL`: Backend API base URL (defaults to `http://localhost:8080`).

### Development Server
Run the development server with:
```bash
npm run dev
```
The server will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
npm run build
npm start
```

## 2. Testing Information

### Framework
The project uses **Jest** and **React Testing Library** for testing.
- **Configuration**: `jest.config.js` and `jest.setup.js`.
- **Environment**: `jsdom` for component testing.
- **Aliases**: Path aliases (`@/*`) are supported in tests.

### Running Tests
- **All tests**: `npm test`
- **Specific file**: `npm test path/to/file.test.ts`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:coverage` (Minimum 50% threshold for branches, functions, lines, and statements).

### Adding New Tests
Tests should be placed in `__tests__` directories adjacent to the code they test, or follow the `.test.ts(x)` naming convention.

#### Example: Testing a Utility Function
Create a file `src/lib/__tests__/math-util.test.ts`:
```typescript
import { add } from '../math-util';

describe('math-util', () => {
  it('adds two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

#### Example: Testing a Component
Ensure you use `@testing-library/react` for component tests.
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## 3. Additional Development Information

### Code Style and Standards
- **TypeScript**: Use strict mode and avoid `any`.
- **Linting**: ESLint with `next/core-web-vitals` and `next/typescript`. Run `npm run lint`.
- **Styling**: **Tailwind CSS 4**. Avoid custom CSS where possible.
- **Form Handling**: Use **React Hook Form** with **Zod** schemas for validation. Schemas are defined in `src/lib/validations.ts`.
- **API Client**: Use the Axios instance from `src/lib/api-client.ts` which includes interceptors for authentication and error handling.

### Project Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
  - `auth/`: Authentication related components.
  - `campaigns/`: Campaign management components.
  - `dashboard/`: Dashboard components and metrics.
- `src/lib`: Services, utility functions, and Zod schemas.
- `src/hooks`: Custom React hooks (e.g., `useAuth`).
- `src/context`: React Context providers (e.g., `auth-context`).
- `src/types`: Global TypeScript interfaces and types.

### API Integration
- The frontend uses Next.js rewrites to proxy `/api/*` requests to the backend, avoiding CORS issues.
- Configuration for rewrites can be found in `next.config.ts`.

## 4. Next.js Best Practices

### Server vs. Client Components
- **Server Components (Default)**: Use for data fetching, accessing backend resources, and keeping sensitive information on the server.
- **Client Components**: Use only when necessary for interactivity (hooks like `useState`, `useEffect`), browser-only APIs, or event listeners. Use the `'use client'` directive at the top of the file.
- **Rule of Thumb**: Keep Client Components as "leaf nodes" in your component tree to minimize the JavaScript bundle sent to the client.

### Data Fetching
- **Server-side Fetching**: Fetch data in Server Components (Pages or Components) to reduce client-side requests and improve SEO.
- **Caching and Revalidation**: Use `fetch` with `cache: 'force-cache'` or `next: { revalidate: 3600 }` to optimize performance.
- **Security**: Never expose sensitive API keys on the client. Use server-only logic for sensitive operations.

### Performance and Optimization
- **Navigation**: Always use `next/link` for internal navigation to enable prefetching and client-side transitions.
- **Images**: Use `next/image` for automatic image optimization, lazy loading, and prevention of layout shifts.
- **Fonts**: Use `next/font` to optimize font loading and prevent CLS.

### Routing and Layouts
- **Layouts**: Use `layout.tsx` for shared UI across multiple pages (e.g., sidebars, navigation).
- **Loading States**: Implement `loading.tsx` to show instant feedback during page transitions.
- **Error Handling**: Use `error.tsx` to handle runtime errors gracefully within specific route segments.

### SEO and Metadata
- Use the **Metadata API** by exporting a `metadata` object or `generateMetadata` function in `page.tsx` or `layout.tsx`.
