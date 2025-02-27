import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const ImportCustomers = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid CSV file');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post('http://localhost:5000/api/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Customers imported successfully');
      navigate('/customers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to import customers');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Import Customers</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 text-sm font-medium text-primary hover:text-primary-dark">
                    Click to upload
                  </span>
                  <input
                    id="file-upload"
                    name="file"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
              {file && (
                <div className="mt-4 text-sm text-gray-600">
                  Selected file: {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center"
              disabled={uploading || !file}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importing...
                </>
              ) : (
                'Import Customers'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Import Guidelines</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>File must be in CSV format</li>
            <li>First row should contain column headers</li>
            <li>Required columns: name, email, phone, address, city, state</li>
            <li>Optional columns: status (active/inactive)</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportCustomers;
