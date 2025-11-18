# Fixing Firestore Parse Error on Line 1

## The Problem
Even though `rules_version = "2";` looks correct, Firebase is reporting a parse error. This is usually caused by:
- Invisible/hidden characters
- Encoding issues
- Copy-paste artifacts

## Solution 1: Delete and Type Fresh (Recommended)

1. **Select ALL code** (Ctrl+A or Cmd+A)
2. **Delete everything**
3. **Type this EXACTLY, character by character:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /outfits/{outfitId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Key differences:**
- Use **single quotes** `'2'` instead of double quotes
- Type it manually, don't copy-paste

## Solution 2: Try Without Semicolon on Line 1

Sometimes Firebase is picky about the semicolon. Try:

```
rules_version = '2'
```

(No semicolon - though this is less common)

## Solution 3: Use Different Format

Try this alternative format:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Then gradually add your rules back.

## Solution 4: Check for Hidden Characters

1. Click at the very beginning of line 1
2. Press Backspace a few times to ensure there's nothing before `rules_version`
3. Make sure there are no spaces before `rules_version`
4. Type: `rules_version = '2';` (with single quotes)

## Most Likely Fix

**Use single quotes instead of double quotes:**

Change:
```
rules_version = "2";
```

To:
```
rules_version = '2';
```

Then try publishing again.

