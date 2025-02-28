import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BuildingOfficeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
      toast.success('Supplier deleted successfully');
      fetchSuppliers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <BuildingOfficeIcon className="h-8 w-8 text-white" />
          <div>
            <h1>Supplier List</h1>
            <p>Manage and view all your suppliers</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="p-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search suppliers..."
              className="form-input pl-10 pr-4 py-2"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex space-x-4">
            <Link to="/suppliers/import" className="secondary-button">
              Import Suppliers
            </Link>
            <Link to="/suppliers/add" className="primary-button">
              Add New Supplier
            </Link>
          </div>
        </div>

        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th>Company Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GST Number</th>
              <th>State</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="table-row">
                <td>{supplier.company}</td>
                <td>{supplier.mobile}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.gstNumber}</td>
                <td>{supplier.state}</td>
                <td>
                  <span className={`status-badge ${supplier.status}`}>
                    {supplier.status}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-3">
                    <Link
                      to={`/suppliers/edit/${supplier._id}`}
                      className="p-1 hover:text-blue-600 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suppliers found. Add a new supplier to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierList;
