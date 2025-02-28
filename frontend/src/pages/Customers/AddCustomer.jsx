import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      toast.success('Customer added successfully');
      navigate('/customers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add customer');
    }
  };

  return (
    <div className="p-6">
      <div className="page-header">
        <h1>Add New Customer</h1>
        <p>Create a new customer profile in your system</p>
      </div>

      <div className="form-card max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <UserPlusIcon className="h-12 w-12 text-blue-500" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-input"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="secondary-button"
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
