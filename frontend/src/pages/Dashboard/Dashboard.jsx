import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, suppliersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customers'),
          axios.get('http://localhost:5000/api/suppliers')
        ]);
        setCustomers(customersRes.data);
        setSuppliers(suppliersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'CUSTOMERS',
      count: customers.length,
      icon: UserGroupIcon,
      iconClass: 'customers-icon'
    },
    {
      title: 'SUPPLIERS',
      count: suppliers.length,
      icon: TruckIcon,
      iconClass: 'suppliers-icon'
    },
    {
      title: 'PURCHASES',
      count: purchases.length,
      icon: ShoppingCartIcon,
      iconClass: 'purchases-icon'
    },
    {
      title: 'INVOICES',
      count: invoices.length,
      icon: ReceiptRefundIcon,
      iconClass: 'invoices-icon'
    }
  ];

  // Chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Purchase',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#9c27b0',
      },
      {
        label: 'Sales',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#f44336',
      },
      {
        label: 'Expense',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#2196f3',
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card purchase-due-card text-white">
          <ClipboardDocumentListIcon className="card-icon" />
          <h3 className="text-lg font-semibold opacity-80">PURCHASE DUE</h3>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
        
        <div className="dashboard-card sales-due-card text-white">
          <CurrencyDollarIcon className="card-icon" />
          <h3 className="text-lg font-semibold opacity-80">SALES DUE</h3>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
        
        <div className="dashboard-card sales-card text-white">
          <ShoppingCartIcon className="card-icon" />
          <h3 className="text-lg font-semibold opacity-80">SALES</h3>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
        
        <div className="dashboard-card expense-card text-white">
          <ReceiptRefundIcon className="card-icon" />
          <h3 className="text-lg font-semibold opacity-80">EXPENSE</h3>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className={`stats-icon-container ${stat.iconClass}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">Purchase, Sales & Expense Bar Chart</h3>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
        
        <div className="recent-items">
          <h3 className="recent-items-header">RECENTLY ADDED ITEMS</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">SL No</th>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Item Sales Price</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.length > 0 ? (
                  recentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">₹{item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2">bread</td>
                    <td className="px-4 py-2">₹170.00</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
