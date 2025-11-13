# User Classification System

This document describes the user classification system implemented for StyleLink.

## Overview

StyleLink now supports a user classification system with four user types:
- **Admin**: Full access to all features, content moderation
- **Premium**: Enhanced features, can sell items, higher limits
- **Regular**: Standard users, can upload outfits, limited features
- **Guest**: Read-only access, cannot upload or sell

## User Types

### Admin (`admin`)
- ✅ Upload unlimited outfits
- ✅ Sell items
- ✅ Access premium features
- ✅ Moderate content
- ✅ Unlimited items per outfit

### Premium (`premium`)
- ✅ Upload up to 20 outfits per day
- ✅ Sell items
- ✅ Access premium features
- ❌ Cannot moderate content
- ✅ Up to 10 items per outfit

### Regular (`regular`)
- ✅ Upload up to 5 outfits per day
- ❌ Cannot sell items
- ❌ No premium features
- ❌ Cannot moderate content
- ✅ Up to 5 items per outfit

### Guest (`guest`)
- ❌ Cannot upload outfits
- ❌ Cannot sell items
- ❌ No premium features
- ❌ Cannot moderate content
- ✅ Can browse and view content

## Implementation Details

### Type Definitions

User types are defined in `src/types/user.ts`:

```typescript
export enum UserType {
  ADMIN = 'admin',
  PREMIUM = 'premium',
  REGULAR = 'regular',
  GUEST = 'guest'
}

export interface AppUser {
  uid: string;
  email: string | null;
  userType: UserType | UserTypeString;
  // ... other fields
}
```

### Default User Type

New users are automatically assigned the `regular` user type on signup:

```typescript
export const DEFAULT_USER_TYPE: UserType = UserType.REGULAR;
```

### Firestore Structure

User profiles are stored in the `users` collection with the following structure:

```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  userType: 'admin' | 'premium' | 'regular' | 'guest';
  username?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
}
```

## Usage

### Accessing User Type

#### In Components

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserType, hasPermission } from '../types/user';

function MyComponent() {
  const { userProfile } = useAuth();
  const { userType } = useUser();
  
  // Check user type
  if (userProfile?.userType === UserType.PREMIUM) {
    // Show premium features
  }
  
  // Check permissions
  if (hasPermission(userType, 'canSellItems')) {
    // Show sell button
  }
}
```

#### Check Permissions

```typescript
import { getUserTypePermissions, hasPermission } from '../types/user';

// Get all permissions for a user type
const permissions = getUserTypePermissions(UserType.PREMIUM);
if (permissions.canSellItems) {
  // Allow selling
}

// Check specific permission
if (hasPermission(userType, 'canUploadOutfits')) {
  // Allow upload
}
```

### Updating User Type

#### Programmatically

```typescript
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/user';

function UpgradeUser() {
  const { updateUserType, currentUser } = useAuth();
  
  const handleUpgrade = async () => {
    try {
      await updateUserType(UserType.PREMIUM);
      // User type updated successfully
    } catch (error) {
      // Handle error
    }
  };
}
```

#### In Firestore Console

1. Go to Firestore Database
2. Navigate to `users` collection
3. Find the user document
4. Update the `userType` field to: `admin`, `premium`, `regular`, or `guest`

### Signup Flow

When a user signs up:

1. Firebase Auth creates the user account
2. User profile is created in Firestore with:
   - `userType: 'regular'` (default)
   - `email`, `displayName`, `createdAt`
3. User profile is fetched and stored in AuthContext
4. UserContext syncs with AuthContext

### Login Flow

When a user logs in:

1. Firebase Auth authenticates the user
2. User profile is fetched from Firestore
3. If profile doesn't exist, a default profile is created
4. User profile (including `userType`) is stored in AuthContext
5. UserContext syncs with AuthContext

## API Reference

### AuthContext

```typescript
interface AuthContextType {
  currentUser: User | null;
  userProfile: AppUser | null;  // Includes userType
  loading: boolean;
  error: string | null;
  updateUserType: (userType: UserType | string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  // ... other methods
}
```

### UserContext

```typescript
interface UserContextType {
  user: AppUser | null;
  userType: UserType | string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  // ... other methods
}
```

### Helper Functions

#### `getUserTypePermissions(userType: UserType)`
Returns all permissions for a user type.

#### `hasPermission(userType: UserType, permission: string)`
Checks if a user type has a specific permission.

#### `updateUserType(uid: string, userType: UserType)`
Updates user type in Firestore (from `src/config/firebase.ts`).

## Error Handling

### Missing User Profile

If a user profile doesn't exist in Firestore:
- A default profile is created with `userType: 'regular'`
- The profile is automatically created on first login
- No error is thrown, ensuring graceful degradation

### Firestore Errors

All Firestore operations include error handling:
- Errors are logged to console
- User-friendly error messages are shown via toast notifications
- Default values are used when possible

## Security Considerations

### Firestore Security Rules

Update your Firestore security rules to protect user type updates:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can update userType
      allow update: if request.auth != null && (
        request.auth.uid == userId && 
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['userType'])
      ) || (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin'
      );
    }
  }
}
```

### Admin Access

To grant admin access:
1. Manually update the user document in Firestore Console
2. Set `userType: 'admin'`
3. Or use a Cloud Function with proper authentication

## Testing

### Test User Types

1. **Create test users** with different types:
   ```typescript
   // In Firestore Console
   {
     uid: 'test-user-1',
     email: 'admin@test.com',
     userType: 'admin'
   }
   ```

2. **Test permissions**:
   ```typescript
   const permissions = getUserTypePermissions('premium');
   expect(permissions.canSellItems).toBe(true);
   ```

3. **Test user type updates**:
   ```typescript
   await updateUserType(userId, UserType.PREMIUM);
   const profile = await getUserProfile(userId);
   expect(profile?.userType).toBe(UserType.PREMIUM);
   ```

## Migration Guide

### Existing Users

For existing users without a `userType` field:

1. They will be assigned `'regular'` as default
2. The default is applied when their profile is fetched
3. You can bulk update in Firestore Console:

```javascript
// Firestore Console > Run in Cloud Shell
const users = await db.collection('users').get();
const batch = db.batch();

users.forEach(doc => {
  if (!doc.data().userType) {
    batch.update(doc.ref, { userType: 'regular' });
  }
});

await batch.commit();
```

## Future Enhancements

- [ ] User type upgrade flow (regular → premium)
- [ ] Admin dashboard for managing user types
- [ ] Usage tracking (outfits uploaded per day)
- [ ] Automatic downgrade for inactive premium users
- [ ] Role-based access control (RBAC) system

## Support

For questions or issues:
1. Check Firestore Console for user documents
2. Verify `userType` field exists and is valid
3. Check browser console for errors
4. Review AuthContext and UserContext state

