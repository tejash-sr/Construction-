import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'INIYAN & Co'
    },
    companyTagline: {
      type: String,
      default: 'Construction Consultancy'
    },
    email: {
      type: String,
      default: 'iniyanandco@gmail.com'
    },
    phone: {
      type: String,
      default: '+91 90036 33552'
    },
    address: {
      street: {
        type: String,
        default: '1/18, Kudi Street, Near Panchayat Headquarter'
      },
      city: {
        type: String,
        default: 'Mettupalayam, Kokkalai'
      },
      state: {
        type: String,
        default: 'Namakkal, Tamil Nadu'
      },
      pincode: {
        type: String,
        default: '637410'
      }
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String
    },
    businessHours: {
      monday: { type: String, default: '9:00 AM - 6:00 PM' },
      tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
      wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
      thursday: { type: String, default: '9:00 AM - 6:00 PM' },
      friday: { type: String, default: '9:00 AM - 6:00 PM' },
      saturday: { type: String, default: '9:00 AM - 6:00 PM' },
      sunday: { type: String, default: 'Closed' }
    },
    aboutUs: {
      type: String,
      default: 'Professional construction consultancy services delivering excellence in every project.'
    },
    heroSection: {
      title: {
        type: String,
        default: 'Building Your Dreams with Excellence'
      },
      subtitle: {
        type: String,
        default: 'Professional Construction Consultancy Services'
      },
      ctaText: {
        type: String,
        default: 'Get Quote'
      }
    },
    stats: {
      projectsCompleted: { type: Number, default: 150 },
      happyClients: { type: Number, default: 200 },
      yearsExperience: { type: Number, default: 15 },
      teamMembers: { type: Number, default: 25 }
    }
  },
  {
    timestamps: true
  }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
