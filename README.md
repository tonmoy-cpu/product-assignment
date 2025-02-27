# POS System

A modern Point of Sale (POS) system built with React.js, Node.js, MongoDB, and Tailwind CSS.

## Features

- Customer Management
  - Add/Edit/Delete Customers
  - Import Customers via CSV
  - View Customer List
- Supplier Management
  - Add/Edit/Delete Suppliers
  - Import Suppliers via CSV
  - View Supplier List
- Modern UI with Tailwind CSS
- Responsive Design
- Toast Notifications

## Tech Stack

- Frontend:
  - React.js
  - Tailwind CSS
  - React Router DOM
  - Axios
  - React Toastify
  - Headless UI
  - Heroicons

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - Multer (for file uploads)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://inspiredgrow:pPM0ggZq2cJ8GV39@cluster0.cfzsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from root directory)
   npm run server

   # Start frontend server (from frontend directory)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   ├── customerModel.js
│   │   └── supplierModel.js
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   └── supplierRoutes.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Customers/
│   │   │   └── Suppliers/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## API Endpoints

### Customers
- GET `/api/customers` - Get all customers
- POST `/api/customers` - Add new customer
- POST `/api/customers/import` - Import customers from CSV
- PATCH `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

### Suppliers
- GET `/api/suppliers` - Get all suppliers
- POST `/api/suppliers` - Add new supplier
- POST `/api/suppliers/import` - Import suppliers from CSV
- PATCH `/api/suppliers/:id` - Update supplier
- DELETE `/api/suppliers/:id` - Delete supplier
