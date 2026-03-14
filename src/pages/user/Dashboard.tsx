import { useEffect, useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  FolderKanban,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface UserStats {
  totalQuotes: number;
  pendingQuotes: number;
  approvedQuotes: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalQuotes: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's quotes
      const quotesRes = await fetch('http://localhost:5000/api/quotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (quotesRes.ok) {
        const quotes = await quotesRes.json();
        setRecentQuotes(quotes.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalQuotes: quotes.length,
          pendingQuotes: quotes.filter((q: any) => q.status === 'pending').length,
          approvedQuotes: quotes.filter((q: any) => q.status === 'approved').length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Quotes',
      value: stats.totalQuotes,
      icon: FileText,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes,
      icon: Clock,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'Approved Quotes',
      value: stats.approvedQuotes,
      icon: CheckCircle,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      title: 'My Projects',
      value: stats.activeProjects,
      icon: FolderKanban,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-amber-100 text-amber-700',
      quoted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      'in-progress': 'bg-purple-100 text-purple-700',
      completed: 'bg-gray-100 text-gray-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your quotes and projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.textColor}`} />
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

        {/* Recent Quotes */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Quote Requests</h3>
            <a href="/user/quotes" className="text-sm text-primary hover:underline font-medium">
              View All →
            </a>
          </div>
          
          {recentQuotes.length > 0 ? (
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{quote.projectType}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(quote.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">You haven't submitted any quote requests yet.</p>
              <a
                href="/user/quotes"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Request a Quote
              </a>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary rounded-xl p-6 text-primary-foreground">
            <TrendingUp className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Need a Quote?</h3>
            <p className="opacity-90 mb-4">
              Get a detailed quote for your construction or electrical project.
            </p>
            <a
              href="/user/quotes"
              className="inline-block bg-background text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              Request Quote
            </a>
          </div>

          <div className="bg-primary rounded-xl p-6 text-primary-foreground">
            <FolderKanban className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Projects</h3>
            <p className="opacity-90 mb-4">
              View the progress of your ongoing construction projects.
            </p>
            <a
              href="/user/projects"
              className="inline-block bg-background text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
