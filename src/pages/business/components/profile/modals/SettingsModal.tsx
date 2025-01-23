import React, { useState } from 'react';
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
  ArrowUpCircle,
  Bell, 
  CreditCard, 
  Globe2, 
  HelpCircle, 
  Lock, 
  LogOut, 
  Mail, 
  Phone, 
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from '@/lib/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { BusinessUser } from '@/types/firebase.types';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: BusinessUser | null;
}

export const SettingsModal = ({ open, onClose, profile }: SettingsModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Bahasa'>('English');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailUpdate = async () => {
    if (!auth.currentUser || !profile?.id) return;
    setIsLoading(true);
    try {
      await updateEmail(auth.currentUser, email);
      await updateDoc(doc(db, 'users', profile.id), {
        email: email
      });
      toast({
        title: "Success",
        description: "Email updated successfully",
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

  const handlePhoneUpdate = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        phone_number: phone
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

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser) return;
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
          {/* Upgrade Account Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              <h3 className="font-medium">Upgrade Account</h3>
            </div>
            <Button variant="outline" className="w-full">
              Upgrade to Premium
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

          {/* Billing Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-medium">Billing</h3>
            </div>
            <Button variant="outline" className="w-full">
              Manage Billing
            </Button>
          </div>

          <Separator />

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
                  disabled={isLoading}
                />
                <Button onClick={handleEmailUpdate} disabled={isLoading}>
                  Save
                </Button>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handlePasswordUpdate} 
                className="w-full"
                disabled={isLoading}
              >
                Update Password
              </Button>
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
                  disabled={isLoading}
                />
                <Button onClick={handlePhoneUpdate} disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Support Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <h3 className="font-medium">Support</h3>
            </div>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>

          <Separator />

          {/* Sign Out Section */}
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