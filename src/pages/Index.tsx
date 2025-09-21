import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import LocationSelector from "@/components/LocationSelector";
import RoleSelector from "@/components/RoleSelector";
import FarmerForm from "@/components/FarmerForm";
import VendorDashboard from "@/components/VendorDashboard";

type AppState = "location" | "role" | "farmer" | "vendor";

const Index = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<AppState>("location");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    } else if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
          if (data.location) {
            setSelectedLocation(data.location);
          }
          // Always show role selection when accessing home
          setCurrentState("role");
        }
      };
      fetchProfile();
    }
  }, [user, isLoading, navigate]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setCurrentState("role");
  };

  const handleRoleSelect = (role: "farmer" | "vendor") => {
    setCurrentState(role);
  };

  const handleBack = () => {
    if (currentState === "farmer" || currentState === "vendor") {
      setCurrentState("role");
    } else if (currentState === "role") {
      setCurrentState("location");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (currentState) {
      case "location":
        return <LocationSelector onLocationSelect={handleLocationSelect} />;
      case "role":
        return <RoleSelector onRoleSelect={handleRoleSelect} location={selectedLocation} />;
      case "farmer":
        return <FarmerForm location={selectedLocation} onBack={handleBack} userProfile={userProfile} />;
      case "vendor":
        return <VendorDashboard location={selectedLocation} onBack={handleBack} />;
      default:
        return <LocationSelector onLocationSelect={handleLocationSelect} />;
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Logout button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Index;
