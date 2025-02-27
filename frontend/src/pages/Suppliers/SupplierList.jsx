import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
      setSuppliers(suppliers.filter(supplier => supplier._id !== id));
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Suppliers</h2>
        <div className="space-x-2">
          <Link
            to="/suppliers/import"
            className="btn btn-secondary"
          >
            Import Suppliers
          </Link>
          <Link
            to="/suppliers/add"
            className="btn btn-primary"
          >
            Add Supplier
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
              {suppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {supplier.address.includes('http') ? (
                      <a 
                        href={supplier.address} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark"
                      >
                        View Location
                      </a>
                    ) : (
                      supplier.address
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDelete(supplier._id)}
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

export default SupplierList;
