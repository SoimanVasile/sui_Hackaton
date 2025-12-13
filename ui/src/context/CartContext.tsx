import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  img: string;
  date: string;
  loc: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    setIsOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, isOpen, addToCart, updateQuantity, removeFromCart, toggleCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
