# Deploying Frontend to Vercel & Backend to Render

This step-by-step guide walks you through deploying:
- **Frontend (React + Vite)** on **Vercel**
- **Backend (Spring Boot + Java 17)** on **Render**
- **Database (MySQL)** on a free cloud MySQL provider (e.g., **Aiven**, **TiDB Cloud**, or **Railway**)

---

## Architecture Flow

```
[ User Browser ]
       |
       v
[ Vercel CDN (React App) ]  ---> (HTTP REST / JSON) ---> [ Render Web Service (Spring Boot) ]
  https://your-app.vercel.app                                 https://your-api.onrender.com
                                                                     |
                                                                     v
                                                          [ Cloud MySQL Database ]
                                                            (Aiven / TiDB / Railway)
```

---

## Step 1: Set Up Cloud MySQL Database (2 Minutes)

Since Render doesn't offer free managed MySQL (only PostgreSQL), use a free cloud MySQL database:

### Recommended: **Aiven for MySQL** (Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and create a free account.
2. Click **Create Service** -> Select **MySQL** -> Choose **Free Plan**.
3. Once running, copy the service parameters:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (e.g., `avnadmin`)
   - **Password**
   - **Database Name** (e.g., `defaultdb` or create `library_db`)
4. Construct your JDBC URL:
   ```
   jdbc:mysql://<HOST>:<PORT>/<DATABASE_NAME>?useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   ```

*(Alternative: You can also use **TiDB Cloud Serverless** or **Railway**)*

---

## Step 2: Deploy Backend to Render

1. Push your repository to **GitHub**.
2. Log in to [https://dashboard.render.com](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository:
   - **Name**: `college-library-backend`
   - **Language / Runtime**: **Docker**
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Instance Type**: **Free**
5. Expand **Advanced** -> Click **Add Environment Variable**:

### 🔑 Render Environment Variables to Add:

| Key | Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/<DATABASE>?useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` | Your cloud MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `<DB_USER>` (e.g., `avnadmin`) | Cloud MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | `<DB_PASSWORD>` | Cloud MySQL password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Automatically creates tables |
| `CORS_ALLOWED_ORIGINS` | `https://*.vercel.app,http://localhost:5173` | Allows all Vercel domains |

6. Click **Create Web Service**.
7. Wait 2-3 minutes for the build to finish. Once live, Render gives you a URL like:
   ```
   https://college-library-backend.onrender.com
   ```
8. **Verify Backend**:
   Visit `https://college-library-backend.onrender.com/actuator/health` in your browser. It should respond:
   ```json
   {"status": "UP", "groups": ["liveness", "readiness"]}
   ```
   And `https://college-library-backend.onrender.com/api/books` will return your initial book catalog!

---

## Step 3: Deploy Frontend to Vercel

1. Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Expand **Environment Variables**:

### 🔑 Vercel Environment Variable to Add:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://college-library-backend.onrender.com` |

*(Replace with your actual Render backend URL from Step 2. Do **not** add a trailing slash)*

6. Click **Deploy**.
7. In ~30 seconds, Vercel will give you a live domain, e.g.:
   ```
   https://college-library-frontend.vercel.app
   ```

---

## Step 4: Verification Checklist

- [ ] Open your Vercel URL: The book catalog, search bar, and filters load immediately.
- [ ] Test Login: Click **Quick Role -> Student** (Aarav Sharma) or **Librarian**.
- [ ] Test Borrow: Click **Borrow** on any book -> confirm loan -> stock decrements.
- [ ] Test Return: Switch to **Admin & Librarian Desk** -> **Return Processing Desk** -> click **Process Return**.
- [ ] Page Refresh: Refresh on `/student-dashboard` or `/admin-dashboard` — [vercel.json](file:///d:/LibrarymanagmentSystem/frontend/vercel.json) prevents 404 errors.

---

## 💡 Important Notes for Free Tiers

- **Render Cold Starts**: Render's free tier spins down web services after 15 minutes of inactivity. When you open the Vercel app after a while, the very first API request may take ~30-45 seconds while Render wakes up the backend. Subsequent requests will be instant.
- **CORS Handling**: `WebMvcConfig.java` is pre-configured with `allowedOriginPatterns("https://*.vercel.app")`, allowing both production Vercel domains and preview branch deployments.
