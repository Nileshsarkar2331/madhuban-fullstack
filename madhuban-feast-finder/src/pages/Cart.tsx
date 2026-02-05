import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { removeFromCart, updateCartQuantity } from "@/lib/cart";

const Cart = () => {
  const { items: cartItems } = useCart();

  const updateQuantity = (dishId: string, change: number) => {
    const item = cartItems.find((i) => i.dishId === dishId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty <= 0) {
      removeFromCart(dishId);
      return;
    }

    updateCartQuantity(dishId, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
      </div>
    );
  }

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.dishId}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name || "Dish"}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.name || "Dish"}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price ? `₹${item.price}` : `ID: ${item.dishId}`}
                  </p>
                </div>
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
                onClick={() => removeFromCart(item.dishId)}
              >
                <Trash2 size={18} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold">Grand Total</span>
        <span className="text-xl font-bold">₹{grandTotal}</span>
      </div>

      <Button className="w-full" size="lg">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Cart;
