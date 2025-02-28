import React from 'react';
import '../styles/import.css';

const ImportCustomers = () => {
  return (
    <div className="import-container">
      <h1>Import Customers</h1>
      <div className="import-box">
        <p>Drop your CSV file here to import customers</p>
        <input type="file" accept=".csv" />
      </div>
    </div>
  );
};

export default ImportCustomers;
