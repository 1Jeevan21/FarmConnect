import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Briefcase } from "lucide-react";

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

const USER_ROLES = [
  { value: "farmer", label: "Farmer" },
  { value: "vendor", label: "Vendor" }
];

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    location: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile(data);
      setFormData({
        display_name: data.display_name || "",
        location: data.location || "",
        role: data.role || "",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });

    setProfile({ ...profile, ...formData });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>{profile?.display_name || user.email}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
                    }
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {profile?.location || "No location set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {profile?.role || "No role set"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;