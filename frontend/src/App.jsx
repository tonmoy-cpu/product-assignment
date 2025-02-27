import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomerList from './pages/Customers/CustomerList';
import AddCustomer from './pages/Customers/AddCustomer';
import ImportCustomers from './pages/Customers/ImportCustomers';
import SupplierList from './pages/Suppliers/SupplierList';
import AddSupplier from './pages/Suppliers/AddSupplier';
import ImportSuppliers from './pages/Suppliers/ImportSuppliers';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            } />
            <Route path="/customers/add" element={
              <ProtectedRoute>
                <AddCustomer />
              </ProtectedRoute>
            } />
            <Route path="/customers/import" element={
              <ProtectedRoute>
                <ImportCustomers />
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute>
                <SupplierList />
              </ProtectedRoute>
            } />
            <Route path="/suppliers/add" element={
              <ProtectedRoute>
                <AddSupplier />
              </ProtectedRoute>
            } />
            <Route path="/suppliers/import" element={
              <ProtectedRoute>
                <ImportSuppliers />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
};

export default App;
