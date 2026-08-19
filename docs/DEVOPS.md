# TechNova DevOps & CI/CD Documentation

This document describes the complete DevOps architecture, containerization configuration, CI/CD pipelines, Kubernetes resource manifests, and monitoring infrastructure implemented in **TechNova**.

---

## DevOps Pipeline Flow

```text
 I write code
      ↓
 Push to GitHub
      ↓
 GitHub Actions starts (CI: lint, test, build frontend/backend)
      ↓
 Docker images compiled
      ↓
 Images published to Docker Hub with commit SHA tags
      ↓
 CD triggers deploy.sh on AWS EC2
      ↓
 Kubernetes orchestrates backend and frontend pods
      ↓
 Liveness & readiness probes track health via /api/health
      ↓
 Prometheus scrapes application metrics
      ↓
 Grafana visualizes request latency and error rates
```

---

## 1. Containerization (Docker & Docker Compose)

We use **Docker** to containerize the services.

- **Backend Dockerfile** (`backend/Dockerfile`): Builds on `node:20-alpine`, installs production dependencies, exposes port `5000`, and starts the server.
- **Frontend Dockerfile** (`frontend/Dockerfile`): A multi-stage build. Stage 1 compiles Vite React assets; Stage 2 loads them into a lightweight `nginx:alpine` image and configures custom proxy paths to avoid CORS issues.
- **Docker Compose** (`docker-compose.yml`): Spins up all five systems locally:
  - React Frontend (Port 80)
  - Express Backend (Port 5000)
  - MongoDB (Port 27017)
  - Prometheus (Port 9090)
  - Grafana (Port 3000)

---

## 2. GitHub Actions CI/CD Pipeline

The workflows are located in `.github/workflows/`:

1. **Continuous Integration** (`ci.yml`):
   - Triggers on any `push` or `pull_request`.
   - Runs backend test suites (Jest + Supertest).
   - Validates that Vite React builds successfully.
   - Runs test Docker compiles.
2. **Publish Docker Images** (`docker.yml`):
   - Triggers on merges to `main`/`master` branch.
   - Logs into Docker Hub using secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
   - Tags and pushes `technova-frontend` and `technova-backend` with both `latest` and the unique Git commit SHA.
3. **Continuous Deployment** (`cd.yml` & `deploy.sh`):
   - SSHs into an AWS EC2 instance using SSH secrets (`EC2_HOST`, `EC2_USERNAME`, `EC2_SSH_KEY`).
   - Copies files and runs `deploy.sh`, which pulls the fresh images and restarts the application safely, testing backend response health.

---

## 3. Kubernetes Orchestration

The resource manifests are situated in the `k8s/` directory:

- `configmap.yaml` & `secret.yaml`: Stores backend ports, environment configurations, and base-64 encoded JWT secrets.
- `mongodb-deployment.yaml` & `mongodb-service.yaml`: Database state utilizing cluster internal routing.
- `backend-deployment.yaml`: Manages 2 replica pods. Implements liveness and readiness health checks pointing to `/api/health` on port 5000 to trigger automated self-healing.
- `backend-service.yaml`: Maps internal pod ports.
- `frontend-deployment.yaml`: Configures 2 replica pods.
- `frontend-service.yaml`: Exposes client pages on NodePort `30007`.

To deploy:
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

## 4. Monitoring (Prometheus & Grafana)

Prometheus collects application performance metrics using the `/metrics` endpoint exposed by the Node.js backend.

### Scraping Settings
Prometheus is configured in `monitoring/prometheus/prometheus.yml` to query:
```yaml
scrape_configs:
  - job_name: 'technova-backend'
    scrape_interval: 5s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['backend:5000']
```

### Visualizations in Grafana
The dashboard tracks the following custom PromQL metrics:
- **HTTP Latency**: `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])`
- **Error Rates**: `sum(rate(http_request_duration_seconds_count{status_code=~"5.."}[5m]))`
- **Uptime**: `process_uptime_seconds`
