# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install SQLite
RUN apk add --no-cache sqlite

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set the correct permissions
RUN mkdir -p /app/prisma /app/public /app/.next \
    && chown -R nextjs:nodejs /app

# Copy necessary files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./

# Install production dependencies only
RUN npm ci --omit=dev

# Create volume for SQLite database
VOLUME /app/prisma/data

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/prisma/data/prod.db

# Create a startup script
RUN echo '#!/bin/sh\n\
mkdir -p /app/prisma/data\n\
npx prisma migrate deploy\n\
exec npm start\n\
' > /app/start.sh && chmod +x /app/start.sh

# Switch to non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"]