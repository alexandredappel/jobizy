import React, { useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Textarea } from "@/components/ui/textarea";
import { WorkerUser, JobType, Language, WorkArea } from "@/types/firebase.types";
import { useToast } from "@/hooks/use-toast";
import { X, Upload } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useStorage } from "@/hooks/useStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JOB_TYPES: JobType[] = ['Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 'Gardener', 'Pool guy', 'Bartender', 'Seller'];
const LANGUAGES: Language[] = ['English', 'Bahasa'];
const WORK_AREAS: WorkArea[] = ['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'];

const formSchema = z.object({
  job: z.string(),
  languages: z.array(z.string()),
  location: z.array(z.string()),
  about_me: z.string().max(300, "About me must be less than 300 characters").optional(),
  profile_picture_url: z.string().optional(),
});

interface MainProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: WorkerUser;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
}

const MainProfileEditModal = ({ open, onClose, profile, onSave }: MainProfileEditModalProps) => {
  const { toast } = useToast();
  const { uploadFile, getUrl } = useStorage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: profile?.job || "",
      languages: profile?.languages || [],
      location: profile?.location || [],
      about_me: profile?.about_me || "",
      profile_picture_url: profile?.profile_picture_url || "",
    },
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      const file = e.target.files[0];
      const path = `profile-pictures/${profile.id}/${file.name}`;
      await uploadFile(path, file);
      const url = await getUrl(path);
      form.setValue('profile_picture_url', url);
      
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  }, [profile.id, uploadFile, getUrl, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSave(values);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Edit Profile</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
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
                  Upload Picture
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_TYPES.map((job) => (
                        <SelectItem key={job} value={job}>
                          {job}
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
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value}
                      options={LANGUAGES}
                      onChange={field.onChange}
                      placeholder="Select languages"
                    />
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
                  <FormLabel>Work Areas</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value}
                      options={WORK_AREAS}
                      onChange={field.onChange}
                      placeholder="Select work areas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about_me"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      maxLength={300}
                      placeholder="Tell us about yourself (max 300 characters)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default MainProfileEditModal;