import React from 'react';
import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/profile";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { JobType, Language, WorkArea } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  job: z.string(),
  workAreas: z.array(z.string()),
  languages: z.array(z.string()),
  aboutMe: z.string().max(300, "About me must be less than 300 characters"),
  availability_status: z.boolean()
});

const MainProfileEdit = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: "Waiter",
      workAreas: ["Seminyak"],
      languages: ["English"],
      aboutMe: "",
      availability_status: true
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form values:", values);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <ProfileHeader
        image="/placeholder.svg"
        name="John Doe"
        role="Waiter"
        isAvailable={true}
        badges={[
          { label: "Experience", value: "2 years" },
          { label: "Languages", value: "2" }
        ]}
        onAvailabilityChange={(value) => {
          form.setValue("availability_status", value);
          console.log("Availability changed:", value);
        }}
      />

      <div className="space-y-6 mt-6">
        <ProfileSection title="Main Information" onEdit={() => console.log("Edit main info")}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {["Waiter", "Cook", "Cashier", "Manager"].map((job) => (
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

              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </ProfileSection>

        <ProfileSection title="Work Experience" onEdit={() => console.log("Edit work experience")}>
          <div className="text-muted-foreground">
            No work experience added yet.
          </div>
        </ProfileSection>

        <ProfileSection title="Education" onEdit={() => console.log("Edit education")}>
          <div className="text-muted-foreground">
            No education added yet.
          </div>
        </ProfileSection>
      </div>
    </ProfileContainer>
  );
};

export default MainProfileEdit;