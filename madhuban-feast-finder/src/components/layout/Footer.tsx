import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-secondary" />
              <span className="text-2xl font-bold">Madhu <span className="text-secondary">वन</span></span>
            </div>
            <p className="text-primary-foreground/80">
              Cafe & Restaurant - Perfect venue for parties, events & celebrations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Tagore Nagar Road, Indramarket, Shaktifarm (U.S.Nagar)</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 75001 11774</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@madhuvan.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2 text-primary-foreground/80 text-sm">
              <div className="flex justify-between">
                <span>Mon - Thu:</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat:</span>
                <span>11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>12:00 PM - 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-primary-foreground/60 text-sm">
          <p>&copy; 2024 Madhu वन Cafe & Restaurant. All rights reserved.</p>
        </div>
         <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-primary-foreground/60 text-sm">
          <p> Made by Nilesh Sarkar❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;