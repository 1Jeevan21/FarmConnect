import { Link, useLocation } from "react-router-dom";
import { Home, User, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        
        if (data?.role) {
          setUserRole(data.role);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  const getHomeLabel = () => {
    return "Home";
  };

  const getHomePath = () => {
    // Navigate to "/home" for authenticated content
    return "/home";
  };

  const navItems = [
    { path: getHomePath(), icon: Home, label: getHomeLabel() },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/cart", icon: ShoppingCart, label: "Cart" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;