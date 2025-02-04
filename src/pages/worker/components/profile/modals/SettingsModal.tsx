import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Bahasa'>('English');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace('+62', '').replace(/^0+/, '');
    return cleanNumber.length >= 8 && cleanNumber.length <= 12;
  };

  const formatPhoneNumber = (number: string) => {
    return number.replace('+62', '').replace(/^0+/, '');
  };

  const handleEmailUpdate = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        email: email,
        updated_at: new Date()
      });
      toast({
        title: t('common.toast.success'),
        description: t('worker.profile.modals.settings.toast.email.success'),
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: t('common.toast.error'),
        description: error.message || t('worker.profile.modals.settings.toast.email.error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!profile?.id) return;
    if (!validatePhoneNumber(phone)) {
      toast({
        title: t('common.toast.error'),
        description: t('worker.profile.modals.settings.sections.phone.validation'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        phone_number: `+62${formatPhoneNumber(phone)}`,
        updated_at: new Date()
      });
      toast({
        title: t('common.toast.success'),
        description: t('worker.profile.modals.settings.toast.phone.success'),
      });
    } catch (error: any) {
      toast({
        title: t('common.toast.error'),
        description: error.message || t('worker.profile.modals.settings.toast.phone.error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenderUpdate = async (value: 'male' | 'female') => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        gender: value,
        updated_at: new Date()
      });
      setGender(value);
      toast({
        title: t('common.toast.success'),
        description: t('worker.profile.modals.settings.toast.gender.success'),
      });
    } catch (error: any) {
      console.error('Error updating gender:', error);
      toast({
        title: t('common.toast.error'),
        description: error.message || t('worker.profile.modals.settings.toast.gender.error'),
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
          <SheetTitle>{t('worker.profile.modals.settings.title')}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.email.title')}</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('worker.profile.modals.settings.sections.email.label')}</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('worker.profile.modals.settings.sections.email.placeholder')}
                  disabled={isLoading}
                />
                <Button onClick={handleEmailUpdate} disabled={isLoading}>
                  {t('worker.profile.modals.settings.buttons.save')}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.phone.title')}</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('worker.profile.modals.settings.sections.phone.label')}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+62</span>
                  </div>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className="pl-12"
                    placeholder={t('worker.profile.modals.settings.sections.phone.placeholder')}
                    disabled={isLoading}
                  />
                </div>
                <Button onClick={handlePhoneUpdate} disabled={isLoading}>
                  {t('worker.profile.modals.settings.buttons.save')}
                </Button>
              </div>
              {phone && !validatePhoneNumber(phone) && (
                <p className="text-sm text-destructive">
                  {t('worker.profile.modals.settings.sections.phone.validation')}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.gender.title')}</h3>
            </div>
            <RadioGroup value={gender} onValueChange={handleGenderUpdate}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">{t('worker.profile.modals.settings.sections.gender.options.male')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">{t('worker.profile.modals.settings.sections.gender.options.female')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.language.title')}</h3>
            </div>
            <Select value={language} onValueChange={(value: 'English' | 'Bahasa') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('worker.profile.modals.settings.sections.language.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">{t('worker.profile.modals.settings.sections.language.options.english')}</SelectItem>
                <SelectItem value="Bahasa">{t('worker.profile.modals.settings.sections.language.options.bahasa')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.password.title')}</h3>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/reset-password')}
            >
              {t('worker.profile.modals.settings.sections.password.changeButton')}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-medium">{t('worker.profile.modals.settings.sections.notifications.title')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">
                  {t('worker.profile.modals.settings.sections.notifications.push')}
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">
                  {t('worker.profile.modals.settings.sections.notifications.email')}
                </Label>
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
            {t('worker.profile.modals.settings.buttons.signOut')}
          </Button>

          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('worker.profile.modals.settings.buttons.deleteAccount')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsModal;
