import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { toast } = useToast();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCallFarmers = () => {
    // Get unique farmers from cart items
    const farmers = cartItems.reduce((acc, item) => {
      if (!acc.find(f => f.farmer_id === item.farmer_id)) {
        acc.push({
          farmer_id: item.farmer_id,
          farmer_name: item.farmer_name,
          items: cartItems.filter(cartItem => cartItem.farmer_id === item.farmer_id)
        });
      }
      return acc;
    }, [] as any[]);

    if (farmers.length === 1) {
      // If only one farmer, call directly
      const farmer = farmers[0];
      const itemsList = farmer.items.map(item => `${item.quantity} ${item.unit} ${item.product_name}`).join(', ');
      
      toast({
        title: `Calling ${farmer.farmer_name}`,
        description: `Order: ${itemsList}`,
      });
      
      // In a real app, you would get the farmer's phone number from the database
      // For now, we'll use a placeholder
      window.open(`tel:+919876543210`, '_self');
    } else {
      // If multiple farmers, show options
      toast({
        title: "Multiple farmers in cart",
        description: "Please contact each farmer individually for your orders",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground">
                Add some products to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.product_name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{item.farmer_name}</Badge>
                      <span className="font-medium">₹{item.price}/{item.unit}</span>
                    </div>

                    <div className="flex items-center justify-end">
                      <span className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <Button onClick={handleCallFarmers} className="w-full bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Call to Place Order
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;