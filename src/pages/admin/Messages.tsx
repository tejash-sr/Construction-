import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { MessageSquare, Search, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.success ? result.data.messages : []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });

      if (response.ok) {
        toast.success('Message marked as read');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to update message:', error);
      toast.error('Failed to update message status');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles: any = {
      unread: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return styles[status] || styles.unread;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading messages...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Messages</h1>
          <p className="text-muted-foreground">Manage customer inquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'unread', 'read', 'replied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${messages.filter(m => m.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div key={message._id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{message.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {message.email}
                        {message.phone && (
                          <>
                            <span>•</span>
                            {message.phone}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(message.status)}`}>
                  {message.status}
                </span>
              </div>

              {message.subject && (
                <h4 className="font-semibold text-foreground mb-2">{message.subject}</h4>
              )}
              
              <p className="text-muted-foreground mb-4">{message.message}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(message.createdAt).toLocaleString('en-IN')}
                </div>
                {message.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(message._id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Messages</h3>
            <p className="text-muted-foreground">No messages found with the selected filter.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Messages;
