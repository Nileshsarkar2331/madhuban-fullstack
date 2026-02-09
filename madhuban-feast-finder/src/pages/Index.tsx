import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import GalleryCarousel from '@/components/home/GalleryCarousel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <GalleryCarousel />
    </div>
  );
};

export default Index;
