import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  UsersIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, suppliersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customers'),
          axios.get('http://localhost:5000/api/suppliers')
        ]);
        setStats({
          customers: customersRes.data.length,
          suppliers: suppliersRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Customers',
      count: stats.customers,
      icon: UsersIcon,
      link: '/customers',
      color: 'bg-blue-500'
    },
    {
      title: 'Suppliers',
      count: stats.suppliers,
      icon: TruckIcon,
      link: '/suppliers',
      color: 'bg-green-500'
    },
    {
      title: 'Sales',
      icon: CurrencyDollarIcon,
      link: '#',
      color: 'bg-yellow-500'
    },
    {
      title: 'Products',
      icon: ShoppingCartIcon,
      link: '#',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports',
      icon: ClipboardDocumentListIcon,
      link: '#',
      color: 'bg-red-500'
    },
    {
      title: 'Settings',
      icon: CogIcon,
      link: '#',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className={`p-4 ${item.color}`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                {item.count !== undefined && (
                  <p className="text-3xl font-bold text-gray-700 mt-2">{item.count}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/customers/add"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-primary font-medium">Add Customer</span>
          </Link>
          <Link
            to="/suppliers/add"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-primary font-medium">Add Supplier</span>
          </Link>
          <Link
            to="/customers/import"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-primary font-medium">Import Customers</span>
          </Link>
          <Link
            to="/suppliers/import"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-primary font-medium">Import Suppliers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
