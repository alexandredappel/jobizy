import { useState } from "react";
import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JobType, Language, WorkArea } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  job: z.custom<JobType>(),
  workAreas: z.array(z.custom<WorkArea>()),
  languages: z.array(z.custom<Language>()),
  aboutMe: z.string().max(300).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MainProfileEditProps {
  initialData: {
    image: string;
    name: string;
    job: JobType;
    workAreas: WorkArea[];
    languages: Language[];
    aboutMe?: string;
    isAvailable: boolean;
    badges: { label: string; value: string; }[];
  };
  onUpdate: (data: FormData) => Promise<void>;
  onAvailabilityChange: (value: boolean) => Promise<void>;
}

const MainProfileEdit = ({ initialData, onUpdate, onAvailabilityChange }: MainProfileEditProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: initialData.job,
      workAreas: initialData.workAreas,
      languages: initialData.languages,
      aboutMe: initialData.aboutMe,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onUpdate(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContainer type="worker" mode="edit">
      <ProfileHeader
        image={initialData.image}
        name={initialData.name}
        role={initialData.job}
        isAvailable={initialData.isAvailable}
        badges={initialData.badges}
        onAvailabilityChange={onAvailabilityChange}
      />
      
      <ProfileSection title="Main Information">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your job" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Waiter">Waiter</SelectItem>
                      <SelectItem value="Cook">Cook</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Housekeeper">Housekeeper</SelectItem>
                      <SelectItem value="Gardener">Gardener</SelectItem>
                      <SelectItem value="Pool guy">Pool Guy</SelectItem>
                      <SelectItem value="Bartender">Bartender</SelectItem>
                      <SelectItem value="Seller">Seller</SelectItem>
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
                    onValueChange={(value) => field.onChange([...field.value, value as WorkArea])}
                    value={field.value[field.value.length - 1]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Add work area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Seminyak">Seminyak</SelectItem>
                      <SelectItem value="Kuta">Kuta</SelectItem>
                      <SelectItem value="Kerobokan">Kerobokan</SelectItem>
                      <SelectItem value="Canggu">Canggu</SelectItem>
                      <SelectItem value="Umalas">Umalas</SelectItem>
                      <SelectItem value="Ubud">Ubud</SelectItem>
                      <SelectItem value="Uluwatu">Uluwatu</SelectItem>
                      <SelectItem value="Denpasar">Denpasar</SelectItem>
                      <SelectItem value="Sanur">Sanur</SelectItem>
                      <SelectItem value="Jimbaran">Jimbaran</SelectItem>
                      <SelectItem value="Pererenan">Pererenan</SelectItem>
                      <SelectItem value="Nusa Dua">Nusa Dua</SelectItem>
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
                    onValueChange={(value) => field.onChange([...field.value, value as Language])}
                    value={field.value[field.value.length - 1]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Add language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Bahasa">Bahasa</SelectItem>
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
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      {...field}
                      maxLength={300}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </ProfileSection>
    </ProfileContainer>
  );
};

export default MainProfileEdit;