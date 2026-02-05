import { useEffect, useState } from "react";
import { getCartItems, getCartCount, CartItem } from "@/lib/cart";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(getCartItems());
  const [count, setCount] = useState<number>(getCartCount());

  useEffect(() => {
    const sync = () => {
      setItems(getCartItems());
      setCount(getCartCount());
    };

    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { items, count };
};
