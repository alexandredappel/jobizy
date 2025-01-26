import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Globe2, 
  Lock, 
  LogOut, 
  Mail, 
  Phone,
  Trash2,
  UserCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { WorkerUser } from '@/types/firebase.types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: WorkerUser | null;
}

export const SettingsModal = ({ open, onClose, profile }: SettingsModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Bahasa'>('English');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailUpdate = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        email: email,
        updated_at: new Date()
      });
      toast({
        title: "Success",
        description: "Email updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        phone_number: phone,
        updated_at: new Date()
      });
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenderUpdate = async (newGender: 'male' | 'female') => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        gender: newGender,
        updated_at: new Date()
      });
      setGender(newGender);
      toast({
        title: "Success",
        description: "Gender updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
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
                  disabled={isLoading}
                />
                <Button onClick={handleEmailUpdate} disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Separator />

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
                  disabled={isLoading}
                />
                <Button onClick={handlePhoneUpdate} disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <h3 className="font-medium">Gender</h3>
            </div>
            <RadioGroup value={gender} onValueChange={handleGenderUpdate}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

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

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <h3 className="font-medium">Password</h3>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/reset-password')}
            >
              Change Password
            </Button>
          </div>

          <Separator />

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

          <Button variant="outline" className="w-full" onClick={() => auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          {/* Delete Account Section */}
          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsModal;
