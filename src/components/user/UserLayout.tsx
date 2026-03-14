import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  User,
  LogOut,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', path: '/user' },
    { icon: FileText, label: 'My Quotes', path: '/user/quotes' },
    { icon: Calendar, label: 'My Appointments', path: '/user/appointments' },
    { icon: FolderKanban, label: 'My Projects', path: '/user/projects' },
    { icon: User, label: 'Profile', path: '/user/profile' },
  ];

  const websiteLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Why Choose Us', path: '/why-choose-us' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">INIYAN & Co</h1>
                <p className="text-xs text-gray-500">Client Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-accent">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Client</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0 -ml-64'
        }`}
      >
        <nav className="p-4 space-y-1">
          <div className="mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
              My Account
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Website
            </p>
            {websiteLinks.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <span className="font-medium whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">© 2026 INIYAN & Co</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-16 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
