import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BusinessUser } from '@/types/firebase.types';
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

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: BusinessUser | null;
}

export const SettingsModal = ({ open, onClose, profile }: SettingsModalProps) => {
  const handleLogout = async () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  const handleDeleteAccount = async () => {
    // Implement delete account logic
    console.log('Delete account clicked');
  };

  const settingsOptions = [
    { icon: Mail, label: "Email", onClick: () => console.log("Email settings") },
    { icon: Phone, label: "Phone", onClick: () => console.log("Phone settings") },
    { icon: Lock, label: "Change Password", onClick: () => console.log("Change password") },
    { icon: Bell, label: "Notifications", onClick: () => console.log("Notifications settings") },
    { icon: Globe2, label: "Language", onClick: () => console.log("Language settings") },
    { icon: CreditCard, label: "Billing", onClick: () => console.log("Billing settings") },
    { icon: HelpCircle, label: "Contact Support", onClick: () => console.log("Contact support") },
    { icon: ArrowUpCircle, label: "Upgrade Account", onClick: () => console.log("Upgrade account") },
    { icon: LogOut, label: "Sign Out", onClick: handleLogout, variant: "outline" as const },
    { icon: Trash2, label: "Delete Account", onClick: handleDeleteAccount, variant: "destructive" as const },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-4">
          {settingsOptions.map((option, index) => (
            <React.Fragment key={option.label}>
              <Button
                variant={option.variant || "ghost"}
                className="w-full justify-start"
                onClick={option.onClick}
              >
                <option.icon className="mr-2 h-4 w-4" />
                {option.label}
              </Button>
              {index < settingsOptions.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};