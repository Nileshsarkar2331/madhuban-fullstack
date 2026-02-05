export type CartItem = {
  dishId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
};

const CART_KEY = "cart_items_v1";

const safeParse = (value: string | null): CartItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(CART_KEY));
};

const writeCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
};

export const getCartItems = (): CartItem[] => readCart();

export const getCartCount = (): number =>
  readCart().reduce((sum, item) => sum + item.quantity, 0);

export const addToCart = (
  dishId: string,
  quantity = 1,
  meta?: Pick<CartItem, "name" | "price" | "image">
) => {
  const items = readCart();
  const existing = items.find((i) => i.dishId === dishId);

  if (existing) {
    existing.quantity += quantity;
    if (meta) {
      existing.name = meta.name ?? existing.name;
      existing.price = meta.price ?? existing.price;
      existing.image = meta.image ?? existing.image;
    }
  } else {
    items.push({
      dishId,
      quantity,
      name: meta?.name,
      price: meta?.price,
      image: meta?.image,
    });
  }

  writeCart(items);
};

export const updateCartQuantity = (dishId: string, quantity: number) => {
  const items = readCart()
    .map((item) => (item.dishId === dishId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(items);
};

export const removeFromCart = (dishId: string) => {
  const items = readCart().filter((item) => item.dishId !== dishId);
  writeCart(items);
};

export const clearCart = () => {
  writeCart([]);
};
