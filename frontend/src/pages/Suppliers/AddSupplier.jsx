import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const AddSupplier = () => {
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
      await axios.post('http://localhost:5000/api/suppliers', formData);
      toast.success('Supplier added successfully');
      navigate('/suppliers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add supplier');
    }
  };

  return (
    <div className="p-6">
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <BuildingOfficeIcon className="h-8 w-8 text-white" />
          <div>
            <h1>Add New Supplier</h1>
            <p>Create a new supplier profile in your system</p>
          </div>
        </div>
      </div>

      <div className="form-card max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <BuildingOfficeIcon className="h-12 w-12 text-blue-500" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
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
            <button type="button" className="secondary-button" onClick={() => navigate('/suppliers')}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
