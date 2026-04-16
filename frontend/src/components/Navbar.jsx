import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'landlord'
      ? '/landlord/dashboard'
      : '/tenant/dashboard';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Home size={24} />
              <span>RentEase</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/rooms" className="text-text-muted hover:text-primary px-3 py-2 font-medium transition-colors">
                Browse Properties
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to={dashboardPath} className="flex items-center gap-2 text-text-muted hover:text-primary px-3 py-2 font-medium transition-colors">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2 text-text-main font-medium">
                  <User size={18} />
                  {user.username}
                </div>
                <button onClick={handleLogout} className="btn-primary flex items-center gap-2 text-sm py-1.5">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/tenant/login" className="text-text-muted hover:text-primary font-medium px-3 py-2">Login</Link>
                <Link to="/tenant/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2">
          <Link to="/rooms" className="block px-3 py-2 text-text-muted hover:bg-slate-50 rounded-md">Browse Properties</Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="block px-3 py-2 text-text-muted hover:bg-slate-50 rounded-md">Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md">Logout</button>
            </>
          ) : (
            <>
              <Link to="/tenant/login" className="block px-3 py-2 text-text-muted hover:bg-slate-50 rounded-md">Login</Link>
              <Link to="/tenant/register" className="block px-3 py-2 text-primary font-bold hover:bg-slate-50 rounded-md">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
