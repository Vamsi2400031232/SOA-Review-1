# PulseFit - Multi-Center Health Clubs System

This workspace is cleanly structured into separate frontend and microservice backend modules.

## 📁 Repository Structure

```
Abhiram/
├── frontend/               # React + Vite Frontend Application
├── backend/                # Spring Boot REST API Core Service (Port 8081)
├── api-gateway/            # Spring Cloud API Gateway (Port 8080)
└── .vscode/                # VS Code launch & task configurations
```

---

## 🚀 Getting Started

### 1. Frontend (`/frontend`)
The web application built with React, Vite, TailwindCSS, and Lucide Icons.

```bash
cd frontend
npm install
npm run dev
```
The app will run locally on `http://localhost:3000`.

### 2. Core Backend Service (`/backend`)
Spring Boot microservice handling core business logic, members, attendance, and plans.

```bash
cd backend
mvn spring-boot:run
```

### 3. API Gateway (`/api-gateway`)
Spring Cloud Gateway routing API requests from port `8080` to backend services.

```bash
cd api-gateway
mvn spring-boot:run
```

---

## 🛠 VS Code Tasks & Debugging

- Open the Run & Debug menu in VS Code (`Ctrl+Shift+D` / `Cmd+Shift+D`) and select:
  - **Run Full Stack** to run Gateway, Backend, and Frontend simultaneously.
  - Or run individual tasks: **Run Frontend**, **Run Backend**, **Run API Gateway**.
