import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartItemsCount = 3; // This will be dynamic later

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
            <div className="flex items-center space-x-1">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-secondary transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg sm:text-2xl font-bold text-gradient">Madhuबन<span className="text-primary hidden xs:inline">वन</span></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-2 lg:px-3 py-2 text-xs sm:text-sm lg:text-base font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                  isActivePage(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
                {isActivePage(item.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-secondary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Auth Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Sign In</span>
            </Button>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-secondary text-secondary-foreground"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2.5 text-sm font-medium transition-colors duration-300 hover:text-primary ${
                  isActivePage(item.path)
                    ? 'text-primary bg-primary/5 rounded-lg'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50">
              <Button variant="outline" className="w-full text-xs sm:text-sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;