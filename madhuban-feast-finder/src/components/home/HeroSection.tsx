import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/curry-hero.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Delicious Indian cuisine" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
        <div className="space-y-6 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-secondary/30">
            <Star className="h-4 w-4 text-secondary fill-current" />
            <span className="text-sm font-medium text-secondary">Meeting Hall Available</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Welcome to{' '}
            <span className="text-secondary drop-shadow-lg">Madhu <span className="text-primary-foreground">वन</span></span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-normal">
              Cafe & Restaurant
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Perfect venue for Birthday Party, Kitty Party, Anniversary Party, Engagement Party, Pre-Wedding Shoots & Bonfire Events.
            Meeting Hall Available.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button variant="hero" size="xl" className="group">
              Order Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm">
              View Menu
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">1000+</div>
              <div className="text-sm text-primary-foreground/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">25+</div>
              <div className="text-sm text-primary-foreground/80">Authentic Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">30min</div>
              <div className="text-sm text-primary-foreground/80">Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;