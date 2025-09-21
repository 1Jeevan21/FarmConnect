import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  farmer_name: string;
  farmer_id: string;
  unit: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [user]);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product_name === newItem.product_name && item.farmer_id === newItem.farmer_id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...newItem,
        id: `${newItem.farmer_id}_${newItem.product_name}_${Date.now()}`,
      };
      setCartItems(prev => [...prev, cartItem]);
    }

    toast({
      title: "Added to cart",
      description: `${newItem.product_name} added to your cart`,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};