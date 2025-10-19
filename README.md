# StyleLink

A web-based fashion discovery and shopping platform that connects global fashion with local creativity. StyleLink empowers users to discover, share, and shop authentic styles worldwide while supporting local brands and everyday creators.

## Product Vision

FOR young adults, fashion enthusiasts, travelers, and local brands WHO want a seamless way to discover, share, and shop authentic styles worldwide, StyleLink is a web-based fashion discovery and shopping platform THAT connects global fashion with local creativity. Users can post outfits, explore aesthetics, and shop directly through links.

## Features

- 📸 Upload outfit photos with direct shopping links
- 🏷️ Browse by style tags (streetwear, business casual, Y2K, etc.)
- 🌍 Global fashion discovery and cultural exploration
- 🤖 AI-driven recommendations for similar local alternatives
- 👥 Follow creators and discover trending aesthetics
- 💰 Monetize your style with commission-based earnings
- 🏪 Support local brands and independent designers

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stylelink
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not reversible)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components and routes
├── services/      # API calls and external services
├── data/          # Mock data and constants
├── utils/         # Utility functions and helpers
├── App.tsx        # Main App component
├── index.tsx      # Entry point
└── index.css      # Global styles and Tailwind imports
```

## Team Development

This project is set up for a team of 4 developers with the following considerations:

- TypeScript for type safety and better developer experience
- Tailwind CSS for consistent styling and rapid development
- Organized directory structure for scalable codebase
- Git configuration with proper `.gitignore`
- ESLint and Prettier configurations for code consistency

## Contributing

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Test your changes thoroughly
4. Submit a pull request with a clear description

## Development Guidelines

- Use functional components with hooks
- Follow TypeScript best practices
- Maintain consistent naming conventions
- Write meaningful component and variable names
- Keep components small and focused

## Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```
REACT_APP_API_URL=your_api_url_here
```

## License

This project is proprietary and confidential.
