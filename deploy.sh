#!/bin/bash

# Exit immediately if any command exits with a non-zero status
set -e

echo "========================================="
echo " Starting TechNova Application Deployment"
echo "========================================="

# 1. Pull latest Docker images
echo "Pulling latest images from Docker Hub..."
docker compose pull backend frontend

# 2. Stop old containers and start new containers
echo "Stopping old container group..."
docker compose down

echo "Starting container services in background..."
docker compose up -d --build

# 3. Check application health
echo "Waiting for services to spin up (15s)..."
sleep 15

echo "Checking backend health status..."
HEALTH_CHECK=$(curl -s http://localhost:5000/api/health || curl -s http://127.0.0.1:5000/api/health)

if [[ "$HEALTH_CHECK" == *"healthy"* ]]; then
  echo "========================================="
  echo " Deployment Successful! App is HEALTHY."
  echo "========================================="
  exit 0
else
  echo "========================================="
  echo " CRITICAL: Health check failed! Check logs."
  echo "========================================="
  docker compose logs backend
  exit 1
fi
