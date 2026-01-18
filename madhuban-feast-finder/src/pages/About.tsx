import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Award, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Heart, label: 'Happy Customers', value: '10,000+' },
    { icon: Award, label: 'Years of Excellence', value: '15+' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
    { icon: Clock, label: 'Fast Delivery', value: '30 min' },
  ];

  const testimonials = [
      {
        id: 1,
        name: 'Priya Sharma',
        rating: 5,
        text: 'Perfect venue for our anniversary party! The food was delicious and service was exceptional.',
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        rating: 5,
        text: 'Madhu वन made our engagement party unforgettable. Great ambiance and amazing food!',
      },
      {
        id: 3,
        name: 'Anita Patel',
        rating: 5,
        text: 'Best place for kitty parties! The meeting hall is perfect and staff is very cooperative.',
      },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Our Story</Badge>
          <h1 className="text-4xl font-bold text-primary mb-6">About Madhu <span className="text-secondary">वन</span></h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Since 2009, Madhu वन Cafe & Restaurant has been the perfect venue for celebrations and events. 
            We specialize in birthday parties, kitty parties, anniversary celebrations, engagement parties, 
            pre-wedding shoots, bonfire events, and offer a fully equipped meeting hall.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="card-restaurant text-center">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Heritage</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Madhu वन was established as a comprehensive venue for all your celebration needs. 
                Located in the heart of Shaktifarm, we provide the perfect ambiance for intimate 
                gatherings to grand celebrations.
              </p>
              <p>
                Our spacious cafe and restaurant offers authentic cuisine with a variety of dishes 
                to suit every palate. From traditional Indian flavors to continental delights, 
                we cater to diverse tastes and preferences.
              </p>
              <p>
                Today, Madhu वन is the preferred choice for families and event organizers, 
                offering exceptional service, delicious food, and memorable experiences for 
                every special occasion.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="card-restaurant">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To be the premier destination for celebrations and events, providing exceptional 
                  food, outstanding service, and creating unforgettable memories for every occasion.
                </p>
              </CardContent>
            </Card>

            <Card className="card-restaurant">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Our Promise</h3>
                <p className="text-muted-foreground">
                  Quality food, professional event management, and personalized service for every 
                  celebration. We guarantee memorable experiences that exceed expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-restaurant">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;