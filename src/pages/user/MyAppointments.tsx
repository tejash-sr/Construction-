import { useEffect, useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Plus,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Appointment {
  _id: string;
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

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    appointmentType: '',
    scheduledTime: '',
    duration: '60',
    locationType: 'online',
    location: '',
    customerNotes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (!formData.appointmentType || !formData.scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert 24-hour time to 12-hour format for backend
    const [hours, minutes] = formData.scheduledTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const scheduledTime12h = `${displayHour}:${minutes} ${ampm}`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentType: formData.appointmentType,
          scheduledDate: date,
          scheduledTime: scheduledTime12h,
          duration: parseInt(formData.duration),
          locationType: formData.locationType,
          location: formData.location,
          customerNotes: formData.customerNotes
        })
      });

      if (response.ok) {
        toast.success('Appointment request submitted! We will confirm shortly.');
        setShowForm(false);
        setFormData({
          appointmentType: '',
          scheduledTime: '',
          duration: '60',
          locationType: 'online',
          location: '',
          customerNotes: ''
        });
        setDate(undefined);
        fetchAppointments();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      toast.error('Failed to create appointment request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rescheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rescheduled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const cancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-1">Schedule and manage your appointments</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Book Appointment
          </button>
        </div>

        {/* Booking Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type *
                  </label>
                  <select
                    required
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">Select Type</option>
                    <option value="Initial Consultation" className="text-gray-900">Initial Consultation</option>
                    <option value="Site Visit" className="text-gray-900">Site Visit</option>
                    <option value="Progress Review" className="text-gray-900">Progress Review</option>
                    <option value="Final Walkthrough" className="text-gray-900">Final Walkthrough</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-left flex items-center gap-2",
                          !date && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4" />
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="30" className="text-gray-900">30 minutes</option>
                    <option value="60" className="text-gray-900">1 hour</option>
                    <option value="90" className="text-gray-900">1.5 hours</option>
                    <option value="120" className="text-gray-900">2 hours</option>
                  </select>
                </div>

                {/* Location Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="online" className="text-gray-900">Online Meeting</option>
                    <option value="site" className="text-gray-900">Site Visit</option>
                    <option value="office" className="text-gray-900">Office</option>
                  </select>
                </div>

                {/* Location Address (if not online) */}
                {formData.locationType !== 'online' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Address
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.customerNotes}
                  onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                  rows={3}
                  placeholder="Any specific requirements or questions?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.appointmentType}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(appointment.scheduledDate)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {appointment.scheduledTime} ({appointment.duration} min)
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {appointment.locationType === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          {appointment.locationType === 'online' ? 'Online Meeting' : 
                           appointment.locationType === 'site' ? 'Site Visit' : 'Office'}
                        </div>
                        {appointment.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {appointment.location}
                          </div>
                        )}
                      </div>

                      {appointment.customerNotes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="text-gray-600"><strong>Your notes:</strong> {appointment.customerNotes}</p>
                        </div>
                      )}

                      {appointment.adminNotes && (
                        <div className="mt-3 p-3 bg-amber-50 rounded text-sm">
                          <p className="text-gray-700"><strong>Admin notes:</strong> {appointment.adminNotes}</p>
                        </div>
                      )}

                      {appointment.meetingLink && appointment.status === 'confirmed' && (
                        <div className="mt-4">
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default MyAppointments;
