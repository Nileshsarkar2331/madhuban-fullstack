import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import GalleryCarousel from '@/components/home/GalleryCarousel';
import FeaturedDishes from '@/components/home/FeaturedDishes';
import ReviewsSection from '@/components/home/ReviewsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedDishes />
      <GalleryCarousel />
      <ReviewsSection />
    </div>
  );
};

export default Index;
