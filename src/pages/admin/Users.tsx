import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users as UsersIcon, Search, MoreVertical, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(result.success ? result.data.users : []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading users...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage registered users and their access</p>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShieldOff className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => !u.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isAdmin
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!user.isAdmin && (
                        <button
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                            user.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
