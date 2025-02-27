import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import {
  UsersIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Customers',
      icon: UsersIcon,
      dropdown: [
        { name: 'Add Customer', path: '/customers/add' },
        { name: 'Customer List', path: '/customers' },
        { name: 'Import Customers', path: '/customers/import' }
      ]
    },
    {
      name: 'Suppliers',
      icon: TruckIcon,
      dropdown: [
        { name: 'Add Supplier', path: '/suppliers/add' },
        { name: 'Supplier List', path: '/suppliers' },
        { name: 'Import Suppliers', path: '/suppliers/import' }
      ]
    },
    {
      name: 'Sales',
      icon: CurrencyDollarIcon,
      dropdown: []
    },
    {
      name: 'Products',
      icon: ShoppingCartIcon,
      dropdown: []
    },
    {
      name: 'Reports',
      icon: ClipboardDocumentListIcon,
      dropdown: []
    },
    {
      name: 'Settings',
      icon: CogIcon,
      dropdown: []
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <span className="text-primary text-2xl font-bold">POS System</span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown('')}
                  >
                    <button
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200 ${
                        openDropdown === item.name ? 'text-primary' : ''
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-1" />
                      {item.name}
                      {item.dropdown.length > 0 && (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </button>

                    {item.dropdown.length > 0 && (
                      <Transition
                        show={openDropdown === item.name}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.path}
                                to={dropdownItem.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </Transition>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </button>

              {/* Profile Dropdown */}
              <Transition
                show={showProfileMenu}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </Transition>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <Bars3Icon className="block h-6 w-6" />
              ) : (
                <XMarkIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.name ? '' : item.name)}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                  {item.dropdown.length > 0 && (
                    <ChevronDownIcon className={`ml-auto h-5 w-5 transform ${
                      openDropdown === item.name ? 'rotate-180' : ''
                    } transition-transform duration-200`} />
                  )}
                </button>

                {item.dropdown.length > 0 && (
                  <Transition
                    show={openDropdown === item.name}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="pl-4">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-md"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </Transition>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
            >
              Profile
            </button>
            {showProfileMenu && (
              <div className="pl-4">
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
