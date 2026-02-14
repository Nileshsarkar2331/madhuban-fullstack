import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import GalleryCarousel from '@/components/home/GalleryCarousel';
import ReviewsSection from '@/components/home/ReviewsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <GalleryCarousel />
      <ReviewsSection />
    </div>
  );
};

export default Index;
