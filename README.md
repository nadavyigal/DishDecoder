# DishDecoder Web Application

A web version of the DishDecoder mobile app, built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication System**
  - Email/Password Login & Registration
  - Social Login (Google, Facebook)
  - Password Reset
  - Protected Routes

- **User Management**
  - Profile Management
  - Email Verification
  - Session Persistence

- **UI Components**
  - Reusable Form Inputs
  - Custom Button Components
  - Loading States
  - Error Handling
  - Responsive Design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Lucide Icons
- Context API for State Management

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── FormInput.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ForgotPassword.tsx
└── styles/
    └── index.css
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/nadavyigal/DishDecoder.git
   cd DishDecoder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- The project uses TypeScript for type safety
- Tailwind CSS for styling with custom theme configuration
- Context API for state management
- Protected routes for authenticated access
- Form validation and error handling
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.