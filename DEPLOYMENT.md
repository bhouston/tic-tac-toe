# Deployment Guide

This document outlines the steps to deploy the Tic-Tac-Toe application to Google Cloud Run.

## Prerequisites

- Google Cloud SDK installed and configured
- Docker installed locally
- Access to a Google Cloud project with billing enabled
- Required Google Cloud APIs enabled:
  - Cloud Run API
  - Container Registry API
  - Cloud Build API

## Local Development with Docker

1. Build the Docker image locally:
   ```bash
   docker build -t tic-tac-toe:latest .
   ```

2. Run the container locally:
   ```bash
   docker run -p 3000:3000 tic-tac-toe:latest
   ```

3. Access the application at http://localhost:3000

## Deployment to Google Cloud Run

### 1. Set up Google Cloud Project

```bash
# Set your Google Cloud project ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com
```

### 2. Build and Push the Docker Image

```bash
# Build the image using Cloud Build
gcloud builds submit --tag gcr.io/$PROJECT_ID/tic-tac-toe:latest

# Alternatively, build locally and push
docker build -t gcr.io/$PROJECT_ID/tic-tac-toe:latest .
docker push gcr.io/$PROJECT_ID/tic-tac-toe:latest
```

### 3. Deploy to Cloud Run

```bash
# Update the service configuration file
sed -i "s/PROJECT_ID/$PROJECT_ID/g" cloud-run-service.yaml

# Deploy using the configuration file
gcloud run services replace cloud-run-service.yaml --region=us-central1

# Alternatively, deploy directly without the config file
gcloud run deploy tic-tac-toe \
  --image gcr.io/$PROJECT_ID/tic-tac-toe:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=file:/app/prisma/data/prod.db"
```

### 4. Access Your Deployed Application

After deployment, Cloud Run will provide a URL to access your application. You can also get it with:

```bash
gcloud run services describe tic-tac-toe --region=us-central1 --format='value(status.url)'
```

## Important Notes

- **Database Persistence**: Cloud Run instances are ephemeral. The SQLite database uses an `emptyDir` volume, which means data will persist only for the lifetime of the container instance. For production use, consider:
  - Using a managed database service instead of SQLite
  - Implementing a backup/restore mechanism for the SQLite database
  - Using a persistent volume solution with Cloud Run

- **Environment Variables**: Sensitive environment variables should be stored as secrets in Google Cloud Secret Manager.

- **Scaling**: Cloud Run automatically scales based on traffic. Ensure your application handles concurrent requests properly.