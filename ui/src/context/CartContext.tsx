import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: number | string;
  title: string;
  price: number;
  img: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    // Determine a unique ID for the cart instance (simple timestamp based)
    // allowing multiple of the same ticket
    const newItem = { ...item, cartId: Date.now() }; 
    setItems((prev) => [...prev, item]);
    setIsOpen(true); // Auto open cart when adding
  };

  const removeFromCart = (id: number | string) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index > -1) {
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      }
      return prev;
    });
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isOpen, setIsOpen, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
