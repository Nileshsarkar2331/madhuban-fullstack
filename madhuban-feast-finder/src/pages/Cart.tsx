import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CartItem {
  dishId: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔹 Fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update quantity
  const updateQuantity = async (dishId: string, change: number) => {
    const item = cartItems.find((i) => i.dishId === dishId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty <= 0) return removeItem(dishId);

    await fetch(`${API_BASE_URL}/api/cart/${dishId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQty }),
    });

    fetchCart();
  };

  // 🔹 Remove item
  const removeItem = async (dishId: string) => {
    await fetch(`${API_BASE_URL}/api/cart/${dishId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.dishId}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="font-semibold">Dish ID</p>
                <p className="text-sm text-muted-foreground">{item.dishId}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.dishId, -1)}
                >
                  <Minus size={16} />
                </Button>

                <span className="w-6 text-center">{item.quantity}</span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.dishId, 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>

              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => removeItem(item.dishId)}
              >
                <Trash2 size={18} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <Button className="w-full" size="lg">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Cart;
