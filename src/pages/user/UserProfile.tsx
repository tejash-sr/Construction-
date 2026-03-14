import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update profile would go here
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Member since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  disabled={!editing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  disabled={!editing}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {editing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
