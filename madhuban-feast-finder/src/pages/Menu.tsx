import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Star, Clock, Flame } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAddToCart = async (dishId: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      setLoadingId(dishId);

      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dishId: String(dishId),
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }

      alert('✅ Added to cart');
    } catch (err) {
      alert('❌ Error adding to cart');
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const dishes = [
    { id: 67, name: 'Chicken Biryani', description: 'Fragrant basmati rice with chicken', price: 80, rating: 4.9, cookTime: '30 min', spiceLevel: 2, isVeg: false, popular: true },
    { id: 15, name: 'Paneer Butter Masala', description: 'Creamy paneer curry', price: 220, rating: 4.9, cookTime: '25 min', spiceLevel: 1, isVeg: true, popular: true },
  ];

  const getSpiceIcons = (level: number) =>
    Array(3)
      .fill(0)
      .map((_, i) => (
        <Flame
          key={i}
          className={`h-3 w-3 ${
            i < level ? 'text-red-500 fill-current' : 'text-gray-300'
          }`}
        />
      ));

  return (
    <div className="min-h-screen bg-background px-4 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Our Menu
      </h1>

      <div className="mb-6 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {dishes.map((dish) => (
          <Card key={dish.id} className="card-restaurant">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{dish.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dish.description}
                  </p>
                </div>
                {dish.popular && <Badge>Popular</Badge>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  {dish.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {dish.cookTime}
                </div>
                <div className="flex">{getSpiceIcons(dish.spiceLevel)}</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-bold">₹{dish.price}</span>
                <Button
                  size="sm"
                  disabled={loadingId === dish.id}
                  onClick={() => handleAddToCart(dish.id)}
                >
                  {loadingId === dish.id ? 'Adding...' : 'Add to Cart'}
                  <Plus className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Menu;
