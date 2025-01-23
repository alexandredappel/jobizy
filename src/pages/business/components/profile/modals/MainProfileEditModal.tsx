import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BusinessUser } from '@/types/firebase.types';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  business_type: z.enum(['Restaurant', 'Hotel', 'Property Management', 'Guest House', 'Club'] as const),
  location: z.enum(['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'] as const),
  description: z.string().optional(),
});

interface MainProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: BusinessUser | null;
  updateProfile: (data: Partial<BusinessUser>) => Promise<void>;
}

const MainProfileEditModal = ({ open, onClose, profile, updateProfile }: MainProfileEditModalProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: profile?.company_name || '',
      business_type: profile?.business_type || 'Restaurant',
      location: profile?.location || 'Seminyak',
      description: profile?.description || '',
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile) return;
    
    try {
      console.log('Updating profile with values:', values);
      // Capitalize company name
      const updatedValues = {
        ...values,
        company_name: values.company_name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      };
      
      await updateProfile(updatedValues);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Restaurant', 'Hotel', 'Property Management', 'Guest House', 'Club'].map((type) => (
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
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'].map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MainProfileEditModal;
