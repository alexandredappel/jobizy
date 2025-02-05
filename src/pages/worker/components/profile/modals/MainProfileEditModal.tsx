import React, { useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import type { WorkerUser, JobType, Language, WorkArea } from '@/types/firebase.types';

const JOB_TYPES: JobType[] = ['Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 'Gardener', 'Pool guy', 'Bartender', 'Seller'];
const LANGUAGES: Language[] = ['English', 'Bahasa'];
const WORK_AREAS: WorkArea[] = ['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'];
const CONTRACT_TYPES = ['Full time', 'Part time'] as const;

const formSchema = z.object({
  job: z.enum(['Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 'Gardener', 'Pool guy', 'Bartender', 'Seller'] as const),
  type_contract: z.enum(['Full time', 'Part time'] as const),
  languages: z.array(z.enum(['English', 'Bahasa'] as const)).default([]),
  location: z.array(z.enum(['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'] as const)).default([]),
  profile_picture_url: z.string().optional(),
});

interface MainProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: WorkerUser;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
}

const MainProfileEditModal = ({ open, onClose, profile, onSave }: MainProfileEditModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { uploadFile, getUrl } = useStorage();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: profile?.job || "Waiter",
      type_contract: profile?.type_contract || "Full time",
      languages: profile?.languages || [],
      location: profile?.location || [],
      profile_picture_url: profile?.profile_picture_url || "",
    },
  });

  console.log("Current form values:", form.watch());

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      const file = e.target.files[0];
      const path = `profile-pictures/${profile.id}/${file.name}`;
      await uploadFile(path, file);
      const url = await getUrl(path);
      form.setValue('profile_picture_url', url);
      
      toast({
        title: t('worker.profile.modals.mainProfile.toast.image.success.title'),
        description: t('worker.profile.modals.mainProfile.toast.image.success.description'),
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('worker.profile.modals.mainProfile.toast.image.error.title'),
        description: t('worker.profile.modals.mainProfile.toast.image.error.description'),
        variant: "destructive",
      });
    }
  }, [profile.id, uploadFile, getUrl, form, toast, t]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log('Form values before save:', values);
      
      const updateData: Partial<WorkerUser> = {
        job: values.job,
        type_contract: values.type_contract,
        languages: values.languages || [],
        location: values.location || [],
        profile_picture_url: values.profile_picture_url,
      };

      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      console.log('Formatted update data:', updateData);
      
      await onSave(updateData);
      toast({
        title: t('worker.profile.modals.mainProfile.toast.profile.success.title'),
        description: t('worker.profile.modals.mainProfile.toast.profile.success.description'),
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t('worker.profile.modals.mainProfile.toast.profile.error.title'),
        description: t('worker.profile.modals.mainProfile.toast.profile.error.description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-[95vw] md:w-[50vw] max-w-[95vw] max-h-[90vh] p-0 gap-0 sm:px-6">
        <DialogHeader className="px-4 sm:px-6 pt-6 mb-8 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            {t('worker.profile.modals.mainProfile.title')}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto px-4 sm:px-6 pb-20">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={form.watch('profile_picture_url')} />
                  <AvatarFallback>
                    {profile.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="picture-upload"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('picture-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('worker.profile.modals.mainProfile.fields.profilePicture.upload')}
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('worker.profile.modals.mainProfile.fields.job.label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('worker.profile.modals.mainProfile.fields.job.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((job) => (
                          <SelectItem key={job} value={job}>
                            {t(`jobs.${job.toUpperCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_contract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('worker.profile.modals.mainProfile.fields.workSchedule.label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('worker.profile.modals.mainProfile.fields.workSchedule.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTRACT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('worker.profile.modals.mainProfile.fields.languages.label')}</FormLabel>
                    <FormControl>
                      <ToggleGroup 
                        type="multiple"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-2"
                      >
                        {LANGUAGES.map((language) => (
                          <ToggleGroupItem
                            key={language}
                            value={language}
                            aria-label={language}
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          >
                            {language}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('worker.profile.modals.mainProfile.fields.workAreas.label')}</FormLabel>
                    <FormControl>
                      <ToggleGroup 
                        type="multiple"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-2"
                      >
                        {WORK_AREAS.map((area) => (
                          <ToggleGroupItem
                            key={area}
                            value={area}
                            aria-label={area}
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          >
                            {area}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="border-t p-4 sm:px-6 bg-background flex-shrink-0">
          <div className="flex justify-start">
            <Button 
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
            >
              {isLoading ? t('common.button.saving') : t('common.button.saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MainProfileEditModal;
