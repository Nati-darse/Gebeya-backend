# 🌾 Gebeya Platform - Backend

**Gebeya** is a MERN stack-based web application that connects agricultural product wholesalers with customers in urban areas. This repository contains the backend implementation using **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

- 👤 User authentication (JWT-based)
- 🧑‍🌾 Wholesaler dashboard for product listings and order management
- 🛡️ Super Admin role for managing the platform
- 📦 Product management (CRUD)
- 💳 Payment integration support
- 📊 RESTful API for frontend consumption

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT, bcrypt
- **Dev Tools**: Nodemon, dotenv
- **Security**: CORS, Helmet (optional)

## 📁 Project Structure

/backend
│
├── config/ # Database config
├── controllers/ # Route logic
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── middlewares/ # Auth and error handling
├── utils/ # Utility functions
├── .env # Environment variables
├── server.js # App entry point

bash
Copy
Edit

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/gebeya-backend.git
cd gebeya-backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up Environment Variables
Create a .env file and add the following:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
4. Run the Server
bash
Copy
Edit
npm run dev
The server should be running at http://localhost:5000.

📬 API Endpoints (Sample - More to be Added)
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/products	List all products
POST	/api/products	Create new product

📌 Notes
This backend is part of the full-stack Gebeya platform.

The frontend is built separately using React with Tailwind CSS.

Ensure MongoDB is running locally or provide an external connection.

🧑‍💻 Author
Natnael Darsema
Computer Science Student | Full Stack Developer

Feel free to improve and customize it as the project evolves.

yaml
Copy
Edit

---

Let me know if you'd like to include badges (build status, license, etc.) or additional sections like contribution guidelines.
