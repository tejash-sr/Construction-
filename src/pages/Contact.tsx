import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import SectionTitle from '@/components/ui/SectionTitle';

import heroConstruction1 from '@/assets/hero-construction-1.jpg';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Thank you! We will contact you soon.');
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      content: ['1/18, Kudi Street, Near Panchayat Headquarter,', 'Mettupalayam, Kokkalai,', 'Namakkal, Tamil Nadu 637410'],
    },
    {
      icon: Phone,
      title: 'Phone Number',
      content: ['+91 90036 33552'],
      isLink: true,
      linkPrefix: 'tel:',
    },
    {
      icon: Mail,
      title: 'Email Address',
      content: ['iniyanandco@gmail.com'],
      isLink: true,
      linkPrefix: 'mailto:',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: ['Monday - Saturday', '9:00 AM - 6:00 PM'],
    },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section 
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroConstruction1})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="yellow-accent mx-auto mb-6" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-wider">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Get in touch with us for your construction needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-dark py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="yellow-accent mb-6" />
              <h2 className="section-title text-3xl md:text-4xl mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="message">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hero-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-card border border-border p-8 md:p-10">
                <h3 className="font-display text-2xl tracking-wide mb-8">
                  Get In Touch
                </h3>

                <div className="space-y-8">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 flex-shrink-0 flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{info.title}</h4>
                        {info.content.map((line, i) => (
                          info.isLink ? (
                            <a
                              key={i}
                              href={`${info.linkPrefix}${line.replace(/\s/g, '')}`}
                              className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={i} className="text-muted-foreground">{line}</p>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-10 pt-8 border-t border-border">
                  <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary">
                    <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-display text-lg tracking-wide">GST Registered</p>
                      <p className="text-muted-foreground text-sm">
                        Government Registered & Verified Business
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 bg-card border border-border aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.8!2d78.0!3d11.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKokkalai%2C%20Namakkal%2C%20Tamil%20Nadu%20637410!5e0!3m2!1sen!2sin!4v1639568123456!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="INIYAN & Co Location - Kokkalai, Namakkal"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
