import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <>
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="navbar-brand">
                <span>POS</span>
              </Link>

              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.name}
                      className="nav-item"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown('')}
                    >
                      <button className="nav-link">
                        <item.icon className="h-5 w-5 mr-1.5" />
                        <span>{item.name}</span>
                        {item.dropdown.length > 0 && (
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>

                      {item.dropdown.length > 0 && (
                        <div className={`nav-dropdown ${openDropdown === item.name ? 'show' : ''}`}>
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              className="nav-dropdown-item"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="profile-menu">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="profile-button"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                <div className={`profile-dropdown ${showProfileMenu ? 'show' : ''}`}>
                  <Link to="/profile" className="profile-dropdown-item">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="profile-dropdown-item">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="profile-dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mobile-menu-button"
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

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.name} className="nav-item">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? '' : item.name)}
                    className="nav-link w-full text-gray-700 hover:text-primary"
                  >
                    <item.icon className="h-5 w-5 mr-1.5" />
                    <span>{item.name}</span>
                    {item.dropdown.length > 0 && (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </button>

                  {item.dropdown.length > 0 && (
                    <div className={`nav-dropdown ${openDropdown === item.name ? 'show' : ''}`}>
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          className="nav-dropdown-item"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="profile-menu-mobile">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="profile-button w-full text-gray-700 hover:text-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-gray-700" />
                    )}
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>

                <div className={`profile-dropdown ${showProfileMenu ? 'show' : ''}`}>
                  <Link to="/profile" className="profile-dropdown-item">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="profile-dropdown-item">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="profile-dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </nav>
      <div className="main-content">
      </div>
    </>
  );
};

export default Navbar;
