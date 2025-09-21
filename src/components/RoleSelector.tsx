import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sprout, ShoppingCart } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: "farmer" | "vendor") => void;
  location: string;
}

const RoleSelector = ({ onRoleSelect, location }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-primary">Welcome to FarmConnect</h1>
          <p className="text-muted-foreground text-lg">
            Location: <span className="text-primary font-medium">{location}</span>
          </p>
          <p className="text-foreground">Choose your role to get started</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer transition-all duration-300 h-full">
                <CardHeader className="text-center space-y-4 pb-6">
                  <motion.div 
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sprout className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-primary">I'm a Farmer</CardTitle>
                    <CardDescription className="text-base mt-2">
                      List your produce and connect with vendors
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      List your products with prices
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      Set quantities and availability
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      Get contacted by vendors directly
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Button 
                      onClick={() => onRoleSelect("farmer")}
                      className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 text-primary-foreground font-medium py-6 transition-all duration-300 hover:brightness-110"
                    >
                      Continue as Farmer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer transition-all duration-300 h-full">
                <CardHeader className="text-center space-y-4 pb-6">
                  <motion.div 
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    <ShoppingCart className="w-10 h-10 text-accent-foreground" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-accent-foreground">I'm a Vendor</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Browse and buy from local farmers
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      Browse available produce nearby
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      Compare prices from different farmers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      Contact farmers directly
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Button 
                      onClick={() => onRoleSelect("vendor")}
                      className="w-full bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90 text-accent-foreground font-medium py-6 transition-all duration-300 hover:brightness-110"
                    >
                      Continue as Vendor
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;