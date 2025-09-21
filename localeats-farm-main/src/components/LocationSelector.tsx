import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const CHENNAI_AREAS = [
  "Adyar",
  "Anna Nagar",
  "T. Nagar",
  "Velachery",
  "Tambaram",
  "Chrompet",
  "Perungudi",
  "OMR (Old Mahabalipuram Road)",
  "ECR (East Coast Road)",
  "Guindy",
  "Mylapore",
  "Triplicane",
  "Egmore",
  "Central Chennai",
  "Porur",
  "Pallavaram",
  "Sholinganallur",
  "Thiruvanmiyur"
];

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
}

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleContinue = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-medium">
          <CardHeader className="text-center space-y-4">
            <motion.div 
              className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                rotateY: [0, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl text-primary">FarmConnect</CardTitle>
              <CardDescription className="text-base mt-2">
                Select your location to connect with local farmers and vendors
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="text-sm font-medium text-foreground">
                Choose your area in Chennai
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {CHENNAI_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
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
                  onClick={handleContinue}
                  disabled={!selectedLocation}
                  className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 text-primary-foreground font-medium py-6 transition-all duration-300"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LocationSelector;