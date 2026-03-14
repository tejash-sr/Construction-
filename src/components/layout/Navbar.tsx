import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Building2, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Why Choose Us', path: '/why-choose-us' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'header-scrolled py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Building2 className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse-glow rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-wider text-foreground">
                INIYAN & Co
              </span>
              <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Construction Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`animated-underline text-sm font-medium tracking-wide transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919003633552"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">+91 90036 33552</span>
            </a>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin ? (
                    <>
                      <DropdownMenuItem onClick={() => window.location.href = '/admin'} className="cursor-pointer">
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => window.location.href = '/user'} className="cursor-pointer">
                        <span>My Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/contact" className="btn-hero-primary text-sm py-3 px-6">
                Get Quote
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="glass rounded-lg p-6 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-2 font-medium ${
                        location.pathname === link.path
                          ? 'text-primary'
                          : 'text-foreground/80'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 border-t border-border">
                  <a
                    href="tel:+919003633552"
                    className="flex items-center gap-2 text-primary py-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>+91 90036 33552</span>
                  </a>
                  
                  {user ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/contact"
                      className="btn-hero-primary w-full text-center mt-4"
                    >
                      Get Quote
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
