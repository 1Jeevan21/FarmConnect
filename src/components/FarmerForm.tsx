import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, Phone, Package, IndianRupee, Plus, Trash2 } from "lucide-react";

interface Product {
  name: string;
  quantity: string;
  unit: string;
  price: string;
}

interface FarmerFormProps {
  location: string;
  onBack: () => void;
  userProfile: any;
}

const FarmerForm = ({ location, onBack, userProfile }: FarmerFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [farmerName, setFarmerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: "", unit: "kg", price: "" }
  ]);

  // Load existing data from userProfile
  useEffect(() => {
    if (userProfile) {
      setFarmerName(userProfile.display_name || "");
      setPhoneNumber(userProfile.phone_number || "");
    }
    
    // Load existing farmer products
    const loadProducts = async () => {
      if (user) {
        const { data } = await supabase
          .from("farmers")
          .select("products")
          .eq("user_id", user.id)
          .single();
        
        if (data && data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products as unknown as Product[]);
        }
      }
    };
    loadProducts();
  }, [userProfile, user]);

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: "", unit: "kg", price: "" }]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    // If no products left, add an empty one
    if (updatedProducts.length === 0) {
      setProducts([{ name: "", quantity: "", unit: "kg", price: "" }]);
    } else {
      setProducts(updatedProducts);
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!farmerName || !phoneNumber) {
      toast({
        title: "Please fill all required fields",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }

    // Validate products section - must have at least one complete product
    const validProducts = products.filter(p => p.name.trim() && p.quantity.trim() && p.price.trim());
    if (validProducts.length === 0) {
      toast({
        title: "Products section is required",
        description: "Please add at least one product with name, quantity, and price",
        variant: "destructive",
      });
      return;
    }

    // Check if there are incomplete products
    if (products.some(p => (p.name.trim() || p.quantity.trim() || p.price.trim()) && (!p.name.trim() || !p.quantity.trim() || !p.price.trim()))) {
      toast({
        title: "Please complete all product details",
        description: "Either remove incomplete products or fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update profile with farmer details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: farmerName,
          phone_number: phoneNumber,
          location,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update or insert farmer products
      const { error: farmerError } = await supabase
        .from("farmers")
        .upsert({
          user_id: user.id,
          products: products as unknown as any,
        });

      if (farmerError) throw farmerError;

      toast({
        title: "Profile Saved Successfully!",
        description: "Your products are now visible to vendors in your area.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Farmer Registration</h1>
            <p className="text-muted-foreground">Location: {location}</p>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>Create Your Farmer Profile</CardTitle>
            <CardDescription>
              Add your details and products to connect with vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Products *</Label>
                  <Button
                    type="button"
                    onClick={addProduct}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </div>

                {products.map((product, index) => (
                  <Card key={index} className="p-4 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <div className="relative">
                          <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(index, "name", e.target.value)}
                            placeholder="e.g., Tomatoes"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          value={product.quantity}
                          onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                          placeholder="100"
                          type="number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <select
                          value={product.unit}
                          onChange={(e) => updateProduct(index, "unit", e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="kg">kg</option>
                          <option value="tons">tons</option>
                          <option value="bags">bags</option>
                          <option value="pieces">pieces</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              value={product.price}
                              onChange={(e) => updateProduct(index, "price", e.target.value)}
                              placeholder="50"
                              className="pl-10"
                              type="number"
                              required
                            />
                          </div>
                          {(
                            <Button
                              type="button"
                              onClick={() => removeProduct(index)}
                              variant="outline"
                              size="sm"
                              className="px-3 hover:bg-destructive/10 hover:text-destructive"
                              title="Delete this product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 text-primary-foreground font-medium py-6"
              >
                {isLoading ? "Saving..." : "Save Farmer Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerForm;