# Caveman Front V2 🦴

This is the **next-generation frontend** for the Caveman platform, built with:

- [Mantis Dashboard v3.4.0](https://mantisdashboard.io/)
- [Vite](https://vitejs.dev/) (for blazing fast builds)
- [Yarn 4 (Berry)](https://yarnpkg.com/)
- Dockerized for production deployment
- Tested with Node.js v20 (Alpine)

---

## 🚀 Getting Started (Development)

### 1. Install dependencies

yarn install

Ensure you have Yarn v4.6.0 or higher (Corepack recommended)

### 2. Start the dev server
yarn start

The app will open at http://localhost:3000

⚙️ Environment Variables
Create a .env file in the root directory:

VITE_API_URL=http://localhost:8000/api/
To share configuration, use .env.example as a template.

🐳 Running in Docker (Production Build)
1. Build the image

docker build -t caveman-front-v2 .
2. Run the container

docker run -p 8080:80 caveman-front-v2
Visit http://localhost:8080

📦 Project Structure
csharp
Copy
Edit
├── Dockerfile            # Production Docker build
├── public/               # Static assets
├── src/                  # Main application source
├── .env.example          # Example env config
├── .gitignore
├── package.json
├── yarn.lock
└── README.md
🧪 Notes
.env is gitignored by default. Use .env.example to share config structure.

jsconfig.node.json uses "composite": true and may show warnings in some IDEs — it still works fine.

Default build output is served with Nginx in Docker.

