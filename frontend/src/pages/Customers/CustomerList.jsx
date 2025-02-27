import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
        <div className="space-x-2">
          <Link
            to="/customers/import"
            className="btn btn-secondary"
          >
            Import Customers
          </Link>
          <Link
            to="/customers/add"
            className="btn btn-primary"
          >
            Add Customer
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table">
            <thead>
              <tr className="bg-gray-50">
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
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">{customer.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
