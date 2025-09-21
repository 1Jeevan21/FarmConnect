import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, LogOut, Info, Bell, Moon } from "lucide-react";

const Settings = () => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotifications(true);
          toast({
            title: "Notifications enabled",
            description: "You'll receive push notifications for updates",
          });
        } else {
          toast({
            title: "Permission denied",
            description: "Enable notifications in your browser settings",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Not supported",
          description: "Push notifications not supported in this browser",
          variant: "destructive",
        });
      }
    } else {
      setNotifications(false);
      toast({
        title: "Notifications disabled",
        description: "You won't receive push notifications",
      });
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Push Notifications
                </Label>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={handleNotificationToggle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="dark-mode" className="text-sm font-medium">
                  Dark Mode
                </Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About FarmConnect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>FarmConnect</strong> bridges the gap between farmers and vendors, 
                creating a direct marketplace for fresh agricultural products.
              </p>
              <p>
                Our platform empowers farmers to showcase their produce and connect 
                directly with vendors, ensuring fair prices and fresh deliveries.
              </p>
              <div className="pt-2 border-t">
                <p className="text-xs">Version 1.0.0</p>
                <p className="text-xs">Built with ❤️ for the farming community</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;