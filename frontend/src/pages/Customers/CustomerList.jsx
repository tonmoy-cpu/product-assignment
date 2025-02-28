import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserGroupIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      toast.success('Customer deleted successfully');
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
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
          <UserGroupIcon className="h-8 w-8 text-white" />
          <div>
            <h1>Customer List</h1>
            <p>Manage and view all your customers</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="p-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
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
          <Link
            to="/customers/add"
            className="primary-button"
          >
            Add New Customer
          </Link>
        </div>

        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer._id} className="table-row">
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  {customer.address && customer.address.includes('http') ? (
                    <a 
                      href={customer.address} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      View Location
                    </a>
                  ) : (
                    customer.address
                  )}
                </td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>
                  <div className="flex space-x-3">
                    <Link
                      to={`/customers/edit/${customer._id}`}
                      className="p-1 hover:text-blue-600 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(customer._id)}
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

        <div className="p-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">10</span> of{' '}
            <span className="font-medium">20</span> results
          </div>
          <div className="flex space-x-2">
            <button className="secondary-button">Previous</button>
            <button className="primary-button">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
