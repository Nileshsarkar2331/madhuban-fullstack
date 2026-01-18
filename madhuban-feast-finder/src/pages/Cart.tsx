import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';

const Cart = () => {
  // Mock cart data - this would come from a state management solution
  const cartItems = [
    {
      id: 1,
      name: 'Chicken Biryani',
      price: 280,
      quantity: 2,
      image: '/placeholder-dish.jpg',
    },
    {
      id: 2,
      name: 'Crispy Samosas',
      price: 120,
      quantity: 1,
      image: '/placeholder-dish.jpg',
    },
    {
      id: 3,
      name: 'Butter Naan',
      price: 80,
      quantity: 3,
      image: '/placeholder-dish.jpg',
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 100 ? 0 : 40;
  const total = subtotal + deliveryFee;
  const deliveryDistance = 2.8; // km

  const updateQuantity = (id: number, change: number) => {
    // Handle quantity update
    console.log(`Update item ${id} by ${change}`);
  };

  const removeItem = (id: number) => {
    // Handle item removal
    console.log(`Remove item ${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Your Cart</h1>
            <p className="text-lg text-muted-foreground">
              Review your order before checkout
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-primary mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
            <Button variant="secondary" size="lg">
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-primary mb-4">Order Items</h2>
              
              {cartItems.map((item) => (
                <Card key={item.id} className="card-restaurant">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Item Image Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">IMG</span>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">{item.name}</h3>
                        <p className="text-muted-foreground">₹{item.price} each</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{item.price * item.quantity}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="card-restaurant sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delivery Status */}
                  {deliveryFee === 0 ? (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-green-800 font-medium">Free Delivery!</p>
                        <p className="text-green-600 text-sm">You're eligible for free delivery</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-amber-800 font-medium">Almost there!</p>
                      <p className="text-amber-600 text-sm">
                        Add ₹{100 - subtotal} more for free delivery
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee ({deliveryDistance} km)</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold text-primary">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <Button variant="secondary" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By proceeding, you agree to our Terms & Privacy Policy
                  </p>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="card-restaurant">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Delivery Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <span className="font-medium">25-35 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">{deliveryDistance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Free Delivery:</span>
                      <span className="font-medium">Orders ≥ ₹100 & ≤ 3.5 km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;