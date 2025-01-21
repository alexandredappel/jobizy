import React from 'react';
import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/profile";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { JobType, Language, WorkArea } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { User, Upload } from 'lucide-react';

const formSchema = z.object({
  job: z.string(),
  workAreas: z.array(z.string()),
  languages: z.array(z.string()),
  aboutMe: z.string().max(300, "About me must be less than 300 characters"),
  profilePicture: z.any().optional()
});

interface MainProfileEditProps {
  image: string;
  name: string;
  role: string;
  isAvailable: boolean;
  badges: Array<{ label: string; value: string }>;
  onSave: (values: z.infer<typeof formSchema>) => Promise<void>;
}

const MainProfileEdit: React.FC<MainProfileEditProps> = ({
  image,
  name,
  role,
  isAvailable,
  badges,
  onSave
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: role,
      workAreas: ["Seminyak"],
      languages: ["English"],
      aboutMe: "",
    }
  });

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      form.setValue('profilePicture', file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('profilePicture', file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSave(values);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const workAreas: WorkArea[] = [
    'Seminyak', 'Kuta', 'Kerobokan', 'Canggu', 'Umalas', 'Ubud', 
    'Uluwatu', 'Denpasar', 'Sanur', 'Jimbaran', 'Pererenan', 'Nusa Dua'
  ];

  const languages: Language[] = ['English', 'Bahasa'];

  const jobs: JobType[] = [
    'Waiter', 'Cook', 'Cashier', 'Manager', 'Housekeeper', 
    'Gardener', 'Pool guy', 'Bartender', 'Seller'
  ];

  return (
    <ProfileContainer type="worker" mode="edit">
      <ProfileHeader
        image={image}
        name={name}
        role={role}
        isAvailable={isAvailable}
        badges={badges}
      />

      <div className="space-y-6 mt-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Change Profile Picture
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Update Profile Picture</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
              >
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-picture"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('profile-picture')?.click()}
                >
                  Select Image
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">Edit Profile Information</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Profile Information</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobs.map((job) => (
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
                  name="workAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Areas</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange([...field.value, value])}
                        value={field.value[0]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work areas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workAreas.map((area) => (
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
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange([...field.value, value])}
                        value={field.value[0]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select languages" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
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
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
    </ProfileContainer>
  );
};

export default MainProfileEdit;