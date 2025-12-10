# Firestore Indexes File Guide

## File Name

**Use:** `firestore.indexes.json`

This is the standard file name that Firebase CLI expects for Firestore indexes.

## What I Created

I've created `firestore.indexes.json` with the necessary composite indexes based on your queries in `firebaseService.ts`:

1. **userId + createdAt** - For filtering outfits by user and sorting by date
2. **occasion + createdAt** - For filtering by occasion and sorting by date
3. **season + createdAt** - For filtering by season and sorting by date
4. **styleTags + createdAt** - For filtering by style tags (array) and sorting by date
5. **createdAt** - For sorting all outfits by creation date

## During Firebase Init

When `firebase init` asks for the indexes file:

1. **File name:** Enter `firestore.indexes.json`
2. **If it asks to overwrite:** Choose **No** (to keep the indexes I created)
   - Or **Yes** if you want to start fresh (you can add indexes later)

## Why These Indexes Are Needed

Firestore requires composite indexes when you:
- Use `where()` with `orderBy()` on different fields
- Use `array-contains-any` with `orderBy()`
- Combine multiple `where()` clauses with `orderBy()`

Your `getOutfits()` function does all of these, so these indexes are essential.

## Deploying Indexes

After `firebase init`, deploy the indexes:

```bash
firebase deploy --only firestore:indexes
```

Or deploy everything:
```bash
firebase deploy
```

## Adding More Indexes Later

If you add new queries that need indexes:

1. Firestore will show an error with a link to create the index
2. Click the link → Firebase Console will auto-generate the index
3. Or manually add to `firestore.indexes.json` and deploy

## Current Configuration

✅ `firestore.indexes.json` - Created with necessary indexes
✅ `firebase.json` - Updated to reference the indexes file

You're all set! 🚀

