import React from 'react';
import '../styles/import.css';

const ImportSuppliers = () => {
  return (
    <div className="import-container">
      <h1>Import Suppliers</h1>
      <div className="import-box">
        <p>Drop your CSV file here to import suppliers</p>
        <input type="file" accept=".csv" />
      </div>
    </div>
  );
};

export default ImportSuppliers;
