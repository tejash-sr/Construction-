import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <Building2 className="h-10 w-10 text-primary" />
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-wider">
                  INIYAN & Co
                </span>
                <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                  Construction Consultancy
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A trusted construction and consultancy firm delivering quality-driven 
              residential and commercial projects with transparency, safety, and precision.
            </p>
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <span className="px-3 py-1 border border-primary rounded-sm">
                GST Registered
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-xl tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Projects', path: '/projects' },
                { name: 'Why Choose Us', path: '/why-choose-us' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="font-display text-xl tracking-wider">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Residential Construction',
                'Commercial Construction',
                'Renovation & Remodeling',
                'Construction Consultancy',
                'Site Supervision',
              ].map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group cursor-pointer">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-display text-xl tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  1/18, Kudi Street,<br />
                  Near Panchayat Headquarter,<br />
                  Mettupalayam, Kokkalai,<br />
                  Namakkal, Tamil Nadu 637410
                </span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+919003633552" className="text-sm hover:text-primary transition-colors">
                  +91 90036 33552
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:iniyanandco@gmail.com" className="text-sm hover:text-primary transition-colors">
                  iniyanandco@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">
                  Mon - Sat: 9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} INIYAN & Co. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
