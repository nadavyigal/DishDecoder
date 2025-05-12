# DishDecoder Mobile App

A cross-platform mobile application for iOS and Android that allows users to identify dishes from photos and get customizable recipes.

## Features

- **Photo Recognition**: Upload or take photos of dishes to identify them and get recipes
- **Recipe Explorer**: Browse a collection of recipes with search functionality
- **Dietary Customization**: Adapt recipes for various dietary needs (vegetarian, gluten-free, etc.)
- **Step-by-Step Cooking**: Follow detailed instructions with visual guides
- **Recipe Management**: Save favorite recipes for quick access
- **User Profiles**: Manage preferences and cooking history

## Tech Stack

- React Native (0.73.4)
- TypeScript
- React Navigation (Stack & Tab Navigation)
- Expo Libraries (Image Picker, Status Bar)
- RESTful API Integration

## Project Structure

```
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Card, etc.)
│   │   └── ...            # Feature-specific components
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   ├── services/          # API and service integrations
│   ├── theme/             # Design system (colors, spacing, typography)
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Root component
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm or yarn
- iOS: XCode & CocoaPods
- Android: Android Studio & SDK

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dish-decoder.git
   cd dish-decoder/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the application:
   ```bash
   # For iOS
   npm run ios
   # or
   yarn ios
   
   # For Android
   npm run android
   # or
   yarn android
   ```

## Design System

The app uses a warm, engaging color palette:
- Primary: Amber tones (#E9A646)
- Secondary: Sage greens (#8DAA7B)
- Neutral: Creams and off-whites (#FFFBF1)

Design principles:
- Large, appetizing food images
- Minimal text with intuitive icons
- Smooth transitions and animations
- Accessible to all users

## Backend Integration

The app connects to a Node.js/Express backend that provides:
- Recipe data and search
- Dish identification via image recognition
- Recipe customization for dietary preferences

API endpoints are defined in `src/services/api.ts`

## Future Enhancements

- Offline mode with local storage
- Push notifications for recipe recommendations
- Social sharing capabilities
- Expanded dietary preference options
- Community features (comments, ratings, etc.)

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 