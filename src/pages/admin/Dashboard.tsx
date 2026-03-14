import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalQuotes: number;
  totalMessages: number;
  totalProjects: number;
  pendingQuotes: number;
  unreadMessages: number;
  activeProjects: number;
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.revenue?.total?.toLocaleString() || 0}`,
      change: stats?.revenue?.growth || 0,
      icon: DollarSign,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: 0,
      icon: Users,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      change: 0,
      icon: Activity,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'Pending Quotes',
      value: stats?.pendingQuotes || 0,
      change: 0,
      icon: FileText,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
  ];

  const quickStats = [
    {
      label: 'Total Quotes',
      value: stats?.totalQuotes || 0,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            
            return (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(card.change)}%
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{stats?.revenue?.growth || 0}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{stats?.revenue?.thisMonth?.toLocaleString() || 0}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Last Month</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ₹{stats?.revenue?.lastMonth?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Projects Overview</h3>
              <p className="opacity-90 mb-4">
                You have {stats?.activeProjects || 0} active projects out of {stats?.totalProjects || 0} total
              </p>
              <button className="bg-background text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors">
                View All Projects
              </button>
            </div>
            <div className="hidden md:block">
              <div className="h-24 w-24 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-sm">
                <Activity className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
