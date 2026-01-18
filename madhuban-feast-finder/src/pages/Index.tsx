import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDishes from '@/components/home/FeaturedDishes';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedDishes />
    </div>
  );
};

export default Index;
