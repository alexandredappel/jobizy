import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BusinessUser } from '@/types/firebase.types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  CreditCard, 
  Globe2, 
  HelpCircle, 
  Lock, 
  LogOut, 
  Mail, 
  Phone, 
  Trash2, 
  ArrowUpCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: BusinessUser | null;
}

export const SettingsModal = ({ open, onClose, profile }: SettingsModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Bahasa'>('English');

  const handleEmailChange = async () => {
    try {
      // Implement email change logic
      console.log('Changing email to:', email);
      toast({
        title: "Success",
        description: "Email updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handlePhoneChange = async () => {
    try {
      // Implement phone change logic
      console.log('Changing phone to:', phone);
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = () => {
    // Implement password change logic
    console.log('Opening password change dialog');
  };

  const handleLogout = async () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  const handleDeleteAccount = async () => {
    // Implement delete account logic
    console.log('Delete account clicked');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Email Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <h3 className="font-medium">Email</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <Button onClick={handleEmailChange}>Save</Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Phone Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <h3 className="font-medium">Phone</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
                <Button onClick={handlePhoneChange}>Save</Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <h3 className="font-medium">Password</h3>
            </div>
            <Button onClick={handlePasswordChange} variant="outline" className="w-full">
              Change Password
            </Button>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <h3 className="font-medium">Language</h3>
            </div>
            <Select value={language} onValueChange={(value: 'English' | 'Bahasa') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Bahasa">Bahasa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Other Settings */}
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => console.log("Billing settings")}>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
            
            <Button variant="outline" className="w-full" onClick={() => console.log("Contact support")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            
            <Button variant="outline" className="w-full" onClick={() => console.log("Upgrade account")}>
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Upgrade Account
            </Button>
            
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            
            <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
