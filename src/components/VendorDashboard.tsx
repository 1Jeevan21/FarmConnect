import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Phone, MapPin, Search, Filter, Plus } from "lucide-react";

// Mock data - in a real app, this would come from a database
const MOCK_FARMERS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    location: "Adyar",
    distance: "2.5 km",
    products: [
      { name: "Tomatoes", quantity: "100", unit: "kg", price: "45" },
      { name: "Onions", quantity: "50", unit: "kg", price: "30" },
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 9876543211",
    location: "Velachery",
    distance: "5.2 km",
    products: [
      { name: "Carrots", quantity: "75", unit: "kg", price: "40" },
      { name: "Potatoes", quantity: "200", unit: "kg", price: "25" },
    ]
  },
  {
    id: 3,
    name: "Murugan S",
    phone: "+91 9876543212",
    location: "Tambaram",
    distance: "8.1 km",
    products: [
      { name: "Rice", quantity: "10", unit: "bags", price: "2500" },
      { name: "Wheat", quantity: "5", unit: "bags", price: "2000" },
    ]
  },
  {
    id: 4,
    name: "Lakshmi Devi",
    phone: "+91 9876543213",
    location: "Chrompet",
    distance: "3.8 km",
    products: [
      { name: "Spinach", quantity: "20", unit: "kg", price: "60" },
      { name: "Coriander", quantity: "15", unit: "kg", price: "80" },
    ]
  }
];

interface VendorDashboardProps {
  location: string;
  onBack: () => void;
}

const VendorDashboard = ({ location, onBack }: VendorDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFarmers = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // First get all farmers (excluding current user if they are a farmer)
        const { data: farmersData, error: farmersError } = await supabase
          .from("farmers")
          .select("*")
          .neq("user_id", user?.id || ""); // Exclude current user

        if (farmersError) throw farmersError;

        // Get all profiles (don't filter by role since users might have farmer products regardless of role)
        const { data: allProfiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) throw profilesError;

        // Filter profiles to exclude current user only
        const profilesData = allProfiles?.filter(profile => 
          profile.user_id !== (user?.id || "")
        );

        // Combine the data
        const formattedFarmers = farmersData?.map((farmer: any) => {
          const profile = profilesData?.find(p => p.user_id === farmer.user_id);
          return {
            id: farmer.id,
            name: profile?.display_name || "Unknown Farmer",
            phone: profile?.phone_number || "",
            location: profile?.location || "",
            distance: calculateDistance(location, profile?.location || ""),
            products: Array.isArray(farmer.products) ? farmer.products : []
          };
        }) || [];

        setFarmers(formattedFarmers);
      } catch (error) {
        console.error("Error loading farmers:", error);
        // Fallback to mock data if database fails
        setFarmers(MOCK_FARMERS);
      } finally {
        setIsLoading(false);
      }
    };

    loadFarmers();
  }, [location]);

  const calculateDistance = (vendorLocation: string, farmerLocation: string) => {
    // Simple distance calculation - in a real app you'd use geolocation
    if (vendorLocation === farmerLocation) return "0.5 km";
    return `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)} km`;
  };

  const filteredFarmers = farmers.filter(farmer => {
    // Filter by search term only
    const searchMatch = !searchTerm || 
      farmer.products.some(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  const handleContactFarmer = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleAddToCart = (product: any, farmer: any) => {
    addToCart({
      product_name: product.name,
      price: parseInt(product.price),
      quantity: 1,
      farmer_name: farmer.name,
      farmer_id: farmer.id,
      unit: product.unit,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Vendor Dashboard</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Showing all farmers
              </p>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products or farmers..."
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id} className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary">{farmer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {farmer.location} • {farmer.distance} away
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleContactFarmer(farmer.phone, farmer.name)}
                    className="bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90 text-accent-foreground"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Available Products:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {farmer.products.map((product, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-card to-muted/30 rounded-lg border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-foreground">{product.name}</h5>
                            <Badge variant="secondary" className="bg-success/10 text-success-foreground">
                              ₹{product.price}/{product.unit}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {product.quantity} {product.unit}
                          </p>
                          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                            <p className="text-lg font-semibold text-primary">
                              ₹{parseInt(product.price)}/{product.unit}
                            </p>
                            <Button
                              onClick={() => handleAddToCart(product, farmer)}
                              size="sm"
                              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl text-muted-foreground mb-2">No farmers found</CardTitle>
              <CardDescription>
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No farmers are currently listing products in your area"}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;