import { useEffect, useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Plus,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Quote {
  _id: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  location: string;
  status: string;
  quotedAmount?: number;
  quotedDetails?: string;
  createdAt: string;
  updatedAt: string;
}

const MyQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    projectSize: '',
    description: '',
    budgetRange: '',
    timeline: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast.error('Failed to load your quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
          phone: formData.phone,
          projectType: formData.projectType,
          projectSize: formData.projectSize,
          location: formData.location,
          budgetRange: formData.budgetRange,
          timeline: formData.timeline,
          description: formData.description
        })
      });

      if (response.ok) {
        toast.success('Quote request submitted successfully!');
        setShowForm(false);
        setFormData({
          projectType: '',
          projectSize: '',
          description: '',
          budgetRange: '',
          timeline: '',
          location: '',
          phone: ''
        });
        fetchQuotes();
      } else {
        toast.error('Failed to submit quote request');
      }
    } catch (error) {
      console.error('Failed to submit quote:', error);
      toast.error('Something went wrong');
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      pending: { 
        label: 'Pending Review', 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock
      },
      quoted: { 
        label: 'Quote Provided', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: FileText
      },
      approved: { 
        label: 'Approved', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle
      },
      rejected: { 
        label: 'Rejected', 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle
      },
      'in-progress': { 
        label: 'In Progress', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Clock
      },
      completed: { 
        label: 'Completed', 
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: CheckCircle
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your quotes...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Quotes</h1>
            <p className="text-muted-foreground">View and manage your quote requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            <Plus className="h-5 w-5" />
            New Quote Request
          </button>
        </div>

        {/* New Quote Form */}
        {showForm && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Request a Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Type *
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Select project type</option>
                    <option value="Residential Construction" className="text-gray-900">Residential Construction</option>
                    <option value="Commercial Construction" className="text-gray-900">Commercial Construction</option>
                    <option value="Industrial Construction" className="text-gray-900">Industrial Construction</option>
                    <option value="Electrical Work" className="text-gray-900">Electrical Work</option>
                    <option value="Renovation" className="text-gray-900">Renovation</option>
                    <option value="Interior Design" className="text-gray-900">Interior Design</option>
                    <option value="Other" className="text-gray-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Size *
                  </label>
                  <select
                    required
                    value={formData.projectSize}
                    onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Select project size</option>
                    <option value="Small (< 1000 sq ft)" className="text-gray-900">Small (&lt; 1000 sq ft)</option>
                    <option value="Medium (1000-2500 sq ft)" className="text-gray-900">Medium (1000-2500 sq ft)</option>
                    <option value="Large (2500-5000 sq ft)" className="text-gray-900">Large (2500-5000 sq ft)</option>
                    <option value="Extra Large (> 5000 sq ft)" className="text-gray-900">Extra Large (&gt; 5000 sq ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Budget Range *
                  </label>
                  <select
                    required
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Select budget range</option>
                    <option value="Under ₹5 Lakhs" className="text-gray-900">Under ₹5 Lakhs</option>
                    <option value="₹5-10 Lakhs" className="text-gray-900">₹5-10 Lakhs</option>
                    <option value="₹10-20 Lakhs" className="text-gray-900">₹10-20 Lakhs</option>
                    <option value="₹20-50 Lakhs" className="text-gray-900">₹20-50 Lakhs</option>
                    <option value="Above ₹50 Lakhs" className="text-gray-900">Above ₹50 Lakhs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timeline *
                  </label>
                  <select
                    required
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Select timeline</option>
                    <option value="1-3 months" className="text-gray-900">1-3 months</option>
                    <option value="3-6 months" className="text-gray-900">3-6 months</option>
                    <option value="6-12 months" className="text-gray-900">6-12 months</option>
                    <option value="More than 12 months" className="text-gray-900">More than 12 months</option>
                    <option value="Flexible" className="text-gray-900">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Project location (City, State)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your project requirements in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-border rounded-lg font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quotes List */}
        {quotes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {quotes.map((quote) => {
              const statusInfo = getStatusInfo(quote.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={quote._id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{quote.projectType}</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{quote.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Budget: {quote.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Timeline: {quote.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Submitted: {new Date(quote.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Location: {quote.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {quote.status === 'quoted' && quote.quotedAmount && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Quote Provided</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-2">₹{quote.quotedAmount.toLocaleString()}</p>
                      {quote.quotedDetails && (
                        <p className="text-sm text-blue-700">{quote.quotedDetails}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Quotes Yet</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any quote requests yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              <Plus className="h-5 w-5" />
              Request Your First Quote
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyQuotes;
