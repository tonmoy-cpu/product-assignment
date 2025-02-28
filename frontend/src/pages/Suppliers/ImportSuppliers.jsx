import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImportSuppliers = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a CSV file');
      e.target.value = null;
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/suppliers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.suppliers && response.data.suppliers.length > 0) {
        toast.success(response.data.message);
        navigate('/suppliers');
      } else {
        toast.error('No suppliers were imported. Please check your CSV format.');
      }
    } catch (error) {
      console.error('Import error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to import suppliers');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <CloudArrowUpIcon className="h-8 w-8 text-white" />
          <div>
            <h1>Import Suppliers</h1>
            <p>Upload your supplier data using CSV file</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="content-card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Required CSV Format</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Basic Info: SUPPLIER NAME, MOBILE, EMAIL, PHONE
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tax Info: GST NUMBER, TAX NUMBER
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Location: COUNTRY/STATE, POSTCODE, ADDRESS
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Financial: OPENING BALANCE
            </li>
          </ul>
        </div>

        <div
          className={`import-section ${isDragging ? 'border-blue-500 bg-blue-100/50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <DocumentTextIcon className="import-icon" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {file ? file.name : 'Drop your CSV file here'}
            </h3>
            <p className="text-gray-500 mb-4">or</p>
            <label className="primary-button cursor-pointer">
              <span>Browse Files</span>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>

        {file && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                document.querySelector('input[type="file"]').value = '';
              }}
              className="secondary-button"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="success-button flex items-center"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importing...
                </>
              ) : (
                'Import Suppliers'
              )}
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Sample CSV Format</h3>
          <p className="text-xs text-blue-600 font-mono">
            SUPPLIER NAME,MOBILE,EMAIL,PHONE,GST NUMBER,TAX NUMBER,COUNTRY/STATE,POSTCODE,ADDRESS,OPENING BALANCE
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Example: Supplier Name 1,9988787878,abc@gmail.com,8465655645,GST123,TAX123,Karnataka,591222,Tq:Chikodi AP:Kabbur,0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportSuppliers;
