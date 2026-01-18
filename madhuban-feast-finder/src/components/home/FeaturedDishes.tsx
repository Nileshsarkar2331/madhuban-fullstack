import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Clock, Flame, ArrowRight } from 'lucide-react';
import samosaImage from '@/assets/samosa.jpg';
import biryaniImage from '@/assets/biryani.jpg';
import naanImage from '@/assets/naan.jpg';
import gulabJamunImage from '@/assets/gulab-jamun.jpg';

const FeaturedDishes = () => {
  const dishes = [
    {
      id: 1,
      name: 'Crispy Samosas',
      description: 'Golden crispy pastries filled with spiced potatoes and peas',
      price: 120,
      image: samosaImage,
      rating: 4.8,
      cookTime: '15 min',
      spiceLevel: 2,
      category: 'Starter',
      isVeg: true,
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken and exotic spices',
      price: 280,
      image: biryaniImage,
      rating: 4.9,
      cookTime: '25 min',
      spiceLevel: 3,
      category: 'Main Course',
      isVeg: false,
    },
    {
      id: 3,
      name: 'Butter Naan',
      description: 'Soft, fluffy bread brushed with butter and fresh herbs',
      price: 80,
      image: naanImage,
      rating: 4.7,
      cookTime: '10 min',
      spiceLevel: 0,
      category: 'Bread',
      isVeg: true,
    },
    {
      id: 4,
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings soaked in rose-flavored syrup',
      price: 150,
      image: gulabJamunImage,
      rating: 4.9,
      cookTime: '5 min',
      spiceLevel: 0,
      category: 'Dessert',
      isVeg: true,
    },
  ];

  const getSpiceIcons = (level: number) => {
    return Array(3).fill(0).map((_, i) => (
      <Flame
        key={i}
        className={`h-3 w-3 ${i < level ? 'text-red-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Our Specialties
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Featured Dishes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most beloved dishes, crafted with authentic recipes and premium ingredients
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <Card key={dish.id} className="card-restaurant group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm"
                >
                  {dish.category}
                </Badge>

                {/* Veg/Non-veg indicator */}
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${
                  dish.isVeg ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full mx-auto mt-0.5 ${
                    dish.isVeg ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>

                {/* Quick Add Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Rating and Time */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{dish.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{dish.cookTime}</span>
                  </div>
                </div>

                {/* Dish Name */}
                <h3 className="font-semibold text-lg text-primary group-hover:text-primary-hover transition-colors">
                  {dish.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {dish.description}
                </p>

                {/* Spice Level */}
                {dish.spiceLevel > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">Spice Level:</span>
                    <div className="flex space-x-0.5">
                      {getSpiceIcons(dish.spiceLevel)}
                    </div>
                  </div>
                )}

                {/* Price and Add Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-primary">₹{dish.price}</span>
                  <Button variant="secondary" size="sm" className="group/btn">
                    Add to Cart
                    <Plus className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Menu CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group">
            View Full Menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;