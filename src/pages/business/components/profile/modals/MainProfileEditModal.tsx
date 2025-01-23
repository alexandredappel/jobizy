import React from 'react';
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
import { BusinessUser, BusinessType, WorkArea } from '@/types/firebase.types';
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

const BUSINESS_TYPES: BusinessType[] = ['Restaurant', 'Hotel', 'Property Management', 'Guest House', 'Club'];
const WORK_AREAS: WorkArea[] = ['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'];

const formSchema = z.object({
  business_type: z.enum(['Restaurant', 'Hotel', 'Property Management', 'Guest House', 'Club'] as const),
  location: z.enum(['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'] as const),
  description: z.string().max(300, "Description must be less than 300 characters").optional(),
  profile_picture_url: z.string().optional(),
});

interface MainProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: BusinessUser;
  onSave: (values: Partial<BusinessUser>) => Promise<void>;
}

export const MainProfileEditModal = ({ open, onClose, profile, onSave }: MainProfileEditModalProps) => {
  const { toast } = useToast();
  const { uploadFile, getUrl } = useStorage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_type: profile?.business_type || "Restaurant",
      location: profile?.location || "Seminyak",
      description: profile?.description || "",
      profile_picture_url: profile?.profile_picture_url || "",
    },
  });

  console.log("Current form values:", form.watch());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Form values before save:', values);
      await onSave(values);
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
    <Sheet open={open} onOpenChange={handleCancel}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Business Profile</SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={form.watch('profile_picture_url')} />
                <AvatarFallback>
                  <Building2 className="w-12 h-12 text-muted-foreground" />
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
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORK_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About the Company</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      maxLength={300}
                      placeholder="Tell us about your company (max 300 characters)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
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