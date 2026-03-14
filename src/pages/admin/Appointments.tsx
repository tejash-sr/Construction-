import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Video,
  MapPin,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: string;
  meetingLink?: string;
  locationType: string;
  location?: string;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter !== 'all'
        ? `http://localhost:5000/api/admin/appointments?status=${filter}`
        : 'http://localhost:5000/api/admin/appointments';
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setUpdatingAppointmentId(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/admin/appointments/${appointmentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          newStatus === 'confirmed'
            ? 'Appointment confirmed! Meeting link generated.'
            : `Appointment ${newStatus} successfully`
        );
        fetchAppointments();
      } else {
        toast.error(result.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment');
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rescheduled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading appointments...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and confirm customer appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'No appointments have been scheduled yet'
                  : `No ${filter} appointments`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.appointmentType}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{appointment.user.name}</span>
                        <span>•</span>
                        <span>{appointment.user.email}</span>
                        <span>•</span>
                        <span>{appointment.user.phone}</span>
                      </div>

                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(appointment.scheduledDate)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {appointment.scheduledTime} ({appointment.duration} min)
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {appointment.locationType === 'online' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {appointment.locationType === 'online'
                            ? 'Online Meeting'
                            : appointment.locationType === 'site'
                            ? 'Site Visit'
                            : 'Office'}
                        </div>
                      </div>

                      {appointment.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}

                      {appointment.customerNotes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="text-gray-700">
                            <strong>Customer notes:</strong> {appointment.customerNotes}
                          </p>
                        </div>
                      )}

                      {appointment.meetingLink && (
                        <div className="mt-3">
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {appointment.status === 'pending' && (
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment._id, 'confirmed')
                          }
                          disabled={updatingAppointmentId === appointment._id}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                        >
                          {updatingAppointmentId === appointment._id
                            ? 'Confirming...'
                            : 'Confirm'}
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment._id, 'cancelled')
                          }
                          disabled={updatingAppointmentId === appointment._id}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment._id, 'completed')
                          }
                          disabled={updatingAppointmentId === appointment._id}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment._id, 'cancelled')
                          }
                          disabled={updatingAppointmentId === appointment._id}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
