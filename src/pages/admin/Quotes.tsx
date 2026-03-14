import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, Search, Calendar, IndianRupee, MoreVertical, Edit, Sparkles, X, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Quote {
  _id: string;
  name: string;
  email: string;
  projectType: string;
  projectSize?: string;
  description: string;
  budget: string;
  budgetRange?: string;
  timeline: string;
  location: string;
  status: string;
  priority: string;
  quotedAmount?: number;
  createdAt: string;
}

interface AIAnalysis {
  recommendation: 'accept' | 'reject' | 'negotiate' | 'manual_review';
  confidence: number;
  reasoning: string[];
  estimatedCostRange: {
    min: number;
    max: number;
    currency: string;
  };
  estimatedDuration: number;
  riskFactors: string[];
  opportunities: string[];
  suggestedQuotedAmount: number;
  nextSteps: string[];
  redFlags: string[];
  greenFlags: string[];
  analyzedAt?: string;
  model?: string;
  error?: boolean;
  errorMessage?: string;
}

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingQuote, setEditingQuote] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzingQuote, setAnalyzingQuote] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/quotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setQuotes(result.success ? result.data.quotes : []);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Quote status updated successfully');
        fetchQuotes(); // Refresh the list
        setEditingQuote(null);
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update quote status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAIAnalysis = async (quoteId: string, quote: Quote) => {
    try {
      setAnalyzingQuote(quoteId);
      setSelectedQuote(quote);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/quotes/${quoteId}/ai-analysis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setAiAnalysis(result.data.analysis);
        setShowAIModal(true);
        toast.success('AI analysis completed');
      } else {
        toast.error(result.message || 'Failed to get AI analysis');
      }
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      toast.error('Failed to get AI analysis');
    } finally {
      setAnalyzingQuote(null);
    }
  };

  const handleAIRecommendedAction = async (action: 'accept' | 'reject' | 'negotiate') => {
    if (!selectedQuote || !aiAnalysis) return;

    const statusMap = {
      accept: 'approved',
      reject: 'rejected',
      negotiate: 'quoted'
    };

    const newStatus = statusMap[action];
    
    // If accepting or negotiating, use AI suggested amount
    if (action === 'accept' || action === 'negotiate') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/quotes/${selectedQuote._id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: newStatus,
            quotedAmount: aiAnalysis.suggestedQuotedAmount || undefined
          })
        });

        const result = await response.json();

        if (result.success) {
          toast.success(`Quote ${action}ed successfully`);
          fetchQuotes();
          setShowAIModal(false);
          setAiAnalysis(null);
          setSelectedQuote(null);
        } else {
          toast.error(result.message || 'Failed to update quote');
        }
      } catch (error) {
        console.error('Failed to update quote:', error);
        toast.error('Failed to update quote');
      }
    } else {
      // For reject, just update status
      await updateQuoteStatus(selectedQuote._id, newStatus);
      setShowAIModal(false);
      setAiAnalysis(null);
      setSelectedQuote(null);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true;
    return quote.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      quoted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'in-progress': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading quotes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quote Management</h1>
          <p className="text-muted-foreground">Manage all quote requests from customers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-foreground">
              {quotes.filter(q => q.status === 'pending').length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-foreground">
              {quotes.filter(q => q.status === 'approved').length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {quotes.filter(q => q.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'quoted', 'approved', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotes.map((quote) => (
            <div key={quote._id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{quote.projectType}</h3>
                  <p className="text-sm text-muted-foreground">{quote.name} • {quote.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {editingQuote === quote._id ? (
                    <select
                      value={quote.status}
                      onChange={(e) => updateQuoteStatus(quote._id, e.target.value)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold border border-border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                      onBlur={() => setEditingQuote(null)}
                    >
                      <option value="pending">Pending</option>
                      <option value="quoted">Quoted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(quote.status)}`}>
                        {quote.status}
                      </span>
                      <button
                        onClick={() => handleAIAnalysis(quote._id, quote)}
                        disabled={analyzingQuote === quote._id}
                        className="p-1 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                        title="AI Analysis"
                      >
                        {analyzingQuote === quote._id ? (
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Sparkles className="h-4 w-4 text-purple-500" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingQuote(quote._id)}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                        title="Change status"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{quote.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium text-foreground">{quote.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Timeline:</span>
                  <span className="font-medium text-foreground">{quote.timeline}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <span className="text-muted-foreground">{quote.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Quotes</h3>
            <p className="text-muted-foreground">No quote requests found with the selected filter.</p>
          </div>
        )}

        {/* AI Analysis Modal */}
        {showAIModal && aiAnalysis && selectedQuote && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    AI Quote Analysis
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedQuote.projectType} • {selectedQuote.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAIModal(false);
                    setAiAnalysis(null);
                    setSelectedQuote(null);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Recommendation Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-6 py-3 rounded-xl text-lg font-bold flex items-center gap-2 ${
                      aiAnalysis.recommendation === 'accept' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      aiAnalysis.recommendation === 'reject' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      aiAnalysis.recommendation === 'negotiate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {aiAnalysis.recommendation === 'accept' && <CheckCircle className="h-5 w-5" />}
                      {aiAnalysis.recommendation === 'reject' && <XCircle className="h-5 w-5" />}
                      {aiAnalysis.recommendation === 'negotiate' && <AlertTriangle className="h-5 w-5" />}
                      {aiAnalysis.recommendation.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-2xl font-bold text-foreground">{aiAnalysis.confidence}%</p>
                    </div>
                  </div>
                  {aiAnalysis.model && (
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Powered by {aiAnalysis.model}</p>
                      {aiAnalysis.analyzedAt && (
                        <p>{new Date(aiAnalysis.analyzedAt).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confidence Bar */}
                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full transition-all ${
                      aiAnalysis.confidence >= 75 ? 'bg-green-500' :
                      aiAnalysis.confidence >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${aiAnalysis.confidence}%` }}
                  ></div>
                </div>

                {/* Reasoning */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Key Reasoning
                  </h3>
                  <ul className="space-y-2">
                    {aiAnalysis.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost Estimate */}
                {aiAnalysis.estimatedCostRange && aiAnalysis.estimatedCostRange.min > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                      <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-blue-600" />
                        Estimated Cost Range
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{aiAnalysis.estimatedCostRange.min.toLocaleString()} - ₹{aiAnalysis.estimatedCostRange.max.toLocaleString()}
                      </p>
                    </div>

                    {aiAnalysis.suggestedQuotedAmount > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Suggested Quote Amount
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{aiAnalysis.suggestedQuotedAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Duration */}
                {aiAnalysis.estimatedDuration > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      Estimated Duration
                    </h3>
                    <p className="text-xl font-bold text-purple-600">
                      {aiAnalysis.estimatedDuration} days
                    </p>
                  </div>
                )}

                {/* Red Flags & Green Flags */}
                {((aiAnalysis.redFlags && aiAnalysis.redFlags.length > 0) || 
                  (aiAnalysis.greenFlags && aiAnalysis.greenFlags.length > 0)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Red Flags */}
                    {aiAnalysis.redFlags && aiAnalysis.redFlags.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          Red Flags
                        </h3>
                        <ul className="space-y-2">
                          {aiAnalysis.redFlags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                              <span className="mt-1">⚠️</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Green Flags */}
                    {aiAnalysis.greenFlags && aiAnalysis.greenFlags.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Green Flags
                        </h3>
                        <ul className="space-y-2">
                          {aiAnalysis.greenFlags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                              <span className="mt-1">✅</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Factors & Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Risk Factors */}
                  {aiAnalysis.riskFactors && aiAnalysis.riskFactors.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                      <h3 className="font-bold text-orange-600 mb-3">Risk Factors</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-400">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Opportunities */}
                  {aiAnalysis.opportunities && aiAnalysis.opportunities.length > 0 && (
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                      <h3 className="font-bold text-teal-600 mb-3">Opportunities</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-teal-700 dark:text-teal-400">
                            <span className="text-teal-600 mt-1">•</span>
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Next Steps */}
                {aiAnalysis.nextSteps && aiAnalysis.nextSteps.length > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                    <h3 className="font-bold text-indigo-600 mb-3">Recommended Next Steps</h3>
                    <ol className="space-y-2">
                      {aiAnalysis.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-indigo-700 dark:text-indigo-400">
                          <span className="font-bold text-indigo-600">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Error Message */}
                {aiAnalysis.error && aiAnalysis.errorMessage && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ⚠️ {aiAnalysis.errorMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer - Action Buttons */}
              {!aiAnalysis.error && aiAnalysis.recommendation !== 'manual_review' && (
                <div className="sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAIModal(false);
                      setAiAnalysis(null);
                      setSelectedQuote(null);
                    }}
                    className="px-6 py-2 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {aiAnalysis.recommendation === 'reject' && (
                    <button
                      onClick={() => handleAIRecommendedAction('reject')}
                      className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Reject Quote
                    </button>
                  )}
                  
                  {aiAnalysis.recommendation === 'negotiate' && (
                    <button
                      onClick={() => handleAIRecommendedAction('negotiate')}
                      className="px-6 py-2 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                    >
                      Send Negotiation Quote
                    </button>
                  )}
                  
                  {aiAnalysis.recommendation === 'accept' && (
                    <button
                      onClick={() => handleAIRecommendedAction('accept')}
                      className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Accept & Send Quote
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Quotes;
