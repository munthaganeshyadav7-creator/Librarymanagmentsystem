# Production Deployment Guide

This guide details how to deploy the **College Library Management System** across multiple hosting environments, from **Docker & Docker Compose** to **Cloud PaaS (Render / Railway)** and **Traditional VMs (AWS EC2 / DigitalOcean)**.

---

## Deployment Strategies Overview

The application is architected to support two production deployment topologies:

1. **Multi-Container Topology (Recommended for Docker, ECS, Kubernetes)**
   - `mysql` container (Official MySQL 8.0 with persistent storage & automated SQL schema initialization)
   - `backend` container (Spring Boot 3.3.4 running on Eclipse Temurin JRE 17 Alpine)
   - `frontend` container (React 18 served via high-performance Nginx with Gzip & reverse proxy)

2. **Unified Single-JAR Topology (Recommended for Render, Railway, AWS Elastic Beanstalk)**
   - The compiled React distribution is packaged directly inside `backend/src/main/resources/static/`.
   - A single command `java -jar library-management-system-1.0.0.jar` serves both the React UI and the REST APIs on port 8080.

---

## 1. Multi-Container Deployment via Docker Compose

### Prerequisites
- Docker Engine 24+ and Docker Compose v2+ installed.

### Step-by-Step Instructions

1. **Clone the repository and navigate to root**:
   ```bash
   cd LibrarymanagmentSystem
   ```

2. **Review Environment Settings**:
   Copy `.env.example` to `.env` if you wish to customize database passwords or ports:
   ```bash
   cp .env.example .env
   ```

3. **Build and Launch All Containers**:
   ```bash
   docker compose up --build -d
   ```

4. **Verify Container Health**:
   ```bash
   docker compose ps
   ```
   All three containers (`college_library_mysql`, `college_library_backend`, `college_library_frontend`) should report `healthy` or `running`.

5. **Access the Application**:
   - Web Application: **`http://localhost`** (Port 80) or **`http://localhost:5173`**
   - Backend Actuator Health: **`http://localhost:8080/actuator/health`**
   - MySQL: **`localhost:3306`** (User: `root`, Password: `1234`, DB: `library_db`)

6. **View Real-Time Logs**:
   ```bash
   docker compose logs -f
   ```

7. **Stop and Clean Up**:
   ```bash
   docker compose down -v  # add -v only if you wish to reset the database volume
   ```

---

## 2. Cloud PaaS Deployment (Render / Railway / Fly.io)

### Unified JAR on Render / Railway
Because the repository bundles the React assets inside the Spring Boot JAR, you can deploy the backend as a single web service!

1. **Deploy a Managed MySQL Database**:
   - Provision a MySQL service in Render/Railway.
   - Note down the `Connection String`, `Host`, `Username`, `Password`, and `Database Name`.

2. **Deploy the Web Service**:
   - Connect your GitHub repository.
   - **Build Command**:
     ```bash
     bash build-production.sh
     ```
   - **Start Command**:
     ```bash
     java -jar backend/target/library-management-system-1.0.0.jar
     ```
   - **Environment Variables**:
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<DB_HOST>:<DB_PORT>/<DB_NAME>?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
     - `SPRING_DATASOURCE_USERNAME`: `<DB_USER>`
     - `SPRING_DATASOURCE_PASSWORD`: `<DB_PASS>`
     - `PORT`: `8080`
     - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`

---

## 3. Traditional Linux VM Deployment (Ubuntu / AWS EC2)

### 1. Install Java and MySQL
```bash
sudo apt update
sudo apt install -y openjdk-17-jre-headless mysql-server
```

### 2. Configure MySQL Database
```bash
sudo mysql -u root
```
Inside MySQL prompt:
```sql
CREATE DATABASE library_db;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Import the schema:
```bash
sudo mysql -u library_user -p library_db < database/library_db.sql
```

### 3. Build & Run Application
```bash
bash build-production.sh
```

### 4. Setup Systemd Service
Create `/etc/systemd/system/library.service`:
```ini
[Unit]
Description=College Library Management System
After=syslog.target network.target mysql.service

[Service]
Type=simple
User=ubuntu
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC"
Environment="SPRING_DATASOURCE_USERNAME=library_user"
Environment="SPRING_DATASOURCE_PASSWORD=StrongPassword123!"
Environment="PORT=8080"
ExecStart=/usr/bin/java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -jar /opt/library/backend/target/library-management-system-1.0.0.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```
Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable library
sudo systemctl start library
sudo systemctl status library
```

---

## 4. Health Checks & Observability

Spring Boot Actuator is exposed for container orchestration:
- **Liveness & Readiness**: `GET /actuator/health`
- **Application Info**: `GET /actuator/info`

Sample Response:
```json
{
  "status": "UP",
  "groups": [
    "liveness",
    "readiness"
  ]
}
```

---

## 5. Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/library_db?...` | JDBC connection URL for MySQL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `1234` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Hibernate schema strategy |
| `PORT` | `8080` | Backend HTTP port |
| `DB_POOL_MAX` | `10` | Maximum HikariCP pool connections |
| `DB_POOL_MIN` | `2` | Minimum idle connections |
| `VITE_API_BASE_URL` | `""` (relative) | Custom external API origin if frontend is hosted on separate domain |
