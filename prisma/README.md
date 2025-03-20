# Prisma Database Setup

This project uses Prisma ORM with SQLite for data persistence.

## Database Schema

The database has two main models:

1. **User** - Stores user information
   - `id`: Unique identifier (UUID)
   - `name`: User's name
   - `email`: User's email (unique)
   - `createdAt`: When the user was created
   - `updatedAt`: When the user was last updated
   - `games`: Relation to GameResult model

2. **GameResult** - Stores game outcomes
   - `id`: Unique identifier (UUID)
   - `outcome`: Result of the game (win, loss, draw)
   - `timestamp`: When the game was played
   - `userId`: Reference to the User
   - `user`: Relation to User model

## Usage

The Prisma client is initialized in `src/lib/prisma.ts` and exported for use throughout the application.

### Example: Working with Users

```typescript
import { createUser, getUserByEmail } from '@/lib/db/users';

// Create a new user
const newUser = await createUser('John Doe', 'john@example.com');

// Find a user by email
const user = await getUserByEmail('john@example.com');
```

### Example: Working with Game Results

```typescript
import { createGameResult, getGameResultsByUser } from '@/lib/db/game-results';

// Record a game result
const result = await createGameResult(userId, 'win');

// Get all game results for a user
const userGames = await getGameResultsByUser(userId);
```

## Database Management

### Running Migrations

After changing the schema, run:

```bash
npx prisma migrate dev --name <migration-name>
```

### Viewing Data

To open Prisma Studio and view/edit data:

```bash
npx prisma studio
```

### Generating Prisma Client

If you make changes to the schema, generate the updated client:

```bash
npx prisma generate
```