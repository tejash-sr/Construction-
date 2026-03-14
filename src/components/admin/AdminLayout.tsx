import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  FolderKanban, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Quotes', path: '/admin/quotes' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">INIYAN & Co</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-accent">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
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
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Version 1.0.0</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">© 2026 INIYAN & Co</p>
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

export default AdminLayout;
