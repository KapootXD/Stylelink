# StyleLink Pages

This directory contains all the main pages for the StyleLink application.

## ProfilePage.tsx

A comprehensive user profile page with the following features:

### Features
- **User Information Display**: Profile picture, display name, username, bio, location, and join date
- **Statistics**: Followers, following, and posts count
- **Outfit Posts Grid**: Displays user's shared looks using Card components
- **Edit Profile Modal**: Full profile editing with form validation
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Animations**: Smooth Framer Motion animations throughout
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Components Used
- `Card` - For outfit post display
- `Button` - For actions and CTAs
- `Input` - For form fields with validation
- `Modal` - For edit profile dialog
- `LoadingSpinner` - For loading states

### User Context Integration
- Uses `useUser` hook from `UserContext`
- Supports both own profile and other user profiles
- Real-time updates when profile is edited

### Styling
- Uses StyleLink's color palette (rust, gold, brown, beige)
- Consistent with app-wide design system
- Warm and professional aesthetic

### Navigation
- Accessible via `/profile` route
- Profile link in main navigation
- Mobile-responsive navigation menu
