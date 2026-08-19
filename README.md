# TechNova e-Commerce Platform

Tagline: **"Smart Shopping. Better Technology."**

TechNova is a minimal, professional electronics e-commerce platform built on the MERN stack with a complete DevOps CI/CD pipeline. Developed as a 4th-year B.Tech project, this codebase is designed to be clean, modular, and easy to explain during placement interviews.

---

## 1. DevOps Architecture Diagram

```text
                 Developer
                     |
                     v
                  GitHub
                     |
                     v
              GitHub Actions
                     |
          +----------+----------+
          |                     |
          v                     v
       Testing                Build
          |                     |
          +----------+----------+
                     |
                     v
                  Docker
                     |
                     v
                Docker Hub
                     |
                     v
               Deployment
                     |
                     v
                Kubernetes
                /        \
               /          \
              v            v
         Frontend       Backend
                           |
                           v
                        MongoDB
                           |
                           v
                      Prometheus
                           |
                           v
                         Grafana
```

---

## 2. Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, prom-client
- **Database**: MongoDB, Mongoose
- **DevOps**: Docker, Docker Compose, GitHub Actions, Kubernetes, Prometheus, Grafana

---

## 3. Project Folder Structure

```text
technova-devops/
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI elements (Navbar, Footer, ProtectedRoute...)
│   │   ├── context/         # AuthContext and CartContext state modules
│   │   ├── pages/           # Page routers (Home, Cart, AdminDashboard...)
│   │   ├── index.css        # Tailwind global themes
│   │   └── App.jsx          # Routing configurations
│   ├── nginx.conf           # Client Nginx routing
│   ├── Dockerfile           # Multi-stage client compiler
│   └── package.json
│
├── backend/
│   ├── config/              # DB connection options
│   ├── controllers/         # Request handler logics (Auth, Products, Orders...)
│   ├── middleware/          # Security filters, logs, prom-client metrics
│   ├── models/              # Mongoose schema models (User, Product, Order, Review)
│   ├── routes/              # Express API routers
│   ├── services/            # Product database seeder
│   ├── tests/               # Jest & Supertest integration checks
│   ├── Dockerfile           # Backend container build configuration
│   └── package.json
│
├── k8s/                     # Kubernetes Pod, Service, and Secret manifests
├── monitoring/              # Prometheus scrapers
├── docs/                    # Deep-dive DevOps guides
├── docker-compose.yml       # Local system sandbox config
├── deploy.sh                # Staging deployment script
├── .env.example
├── .gitignore
└── README.md
```

---

## 4. Local Setup (Without Docker)

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`

### Step 1: Clone and Configure Environment Variables
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

### Step 2: Spin Up Backend
1. Go to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```
*The database will connect and automatically seed 14 electronic items.*

### Step 3: Spin Up Frontend
1. Open another terminal and go to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 5. Dockerized Execution

Run the complete stack including Prometheus and Grafana metrics monitors locally with a single command:
```bash
docker compose up --build
```
- **Storefront**: [http://localhost](http://localhost) (Port 80)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health] (Returns `{"status": "healthy"}`)
- **Prometheus Scraper**: [http://localhost:9090](http://localhost:9090)
- **Grafana Panel**: [http://localhost:3000](http://localhost:3000)

To turn off services:
```bash
docker compose down -v
```

---

## 6. Testing

Backend API endpoint verification checks (mocked DB dependencies for fast and isolated execution) are written with Jest and Supertest.

Run tests:
```bash
cd backend
npm test
```

---

## 7. CI/CD & Deployments

- **CI Pipeline** (`.github/workflows/ci.yml`): Executes on push and PR. Runs test suites, runs build targets, and verifies Dockerfiles compile successfully.
- **Image Publication** (`.github/workflows/docker.yml`): Builds and pushes fresh containers to Docker Hub, tagged with both `latest` and the unique Git commit SHA.
- **CD Staging Deploy** (`.github/workflows/cd.yml` & `deploy.sh`): SSHs into target AWS EC2 instance, checks out the codebase, pulls fresh images, restarts services, and tests health.
- **Kubernetes Orchestration** (`k8s/`): Sets up 2 replica pods for frontend/backend, hooks readiness/liveness checks, and references base-64 secret values.
- **Monitoring Integration** (`monitoring/`): Backend endpoints publish `/metrics` which are indexed by Prometheus and displayed on Grafana panels.
