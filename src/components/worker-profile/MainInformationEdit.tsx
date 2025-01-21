import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobType, Language, WorkArea } from "@/types/database.types";

const formSchema = z.object({
  job: z.string(),
  workAreas: z.array(z.string()),
  languages: z.array(z.string()),
  aboutMe: z.string().max(300, "About section cannot exceed 300 characters"),
});

type MainInformationFormValues = z.infer<typeof formSchema>;

interface MainInformationEditProps {
  initialData: {
    job: JobType;
    workAreas: WorkArea[];
    languages: Language[];
    aboutMe?: string;
  };
  onSave: (data: MainInformationFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MainInformationEdit({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}: MainInformationEditProps) {
  const { toast } = useToast();
  const form = useForm<MainInformationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: initialData.job,
      workAreas: initialData.workAreas,
      languages: initialData.languages,
      aboutMe: initialData.aboutMe || "",
    },
  });

  const onSubmit = async (data: MainInformationFormValues) => {
    try {
      await onSave(data);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
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
                onValueChange={(value) => {
                  const currentAreas = field.value || [];
                  const newAreas = currentAreas.includes(value)
                    ? currentAreas.filter((area) => area !== value)
                    : [...currentAreas, value];
                  field.onChange(newAreas);
                }}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work areas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Seminyak">Seminyak</SelectItem>
                  <SelectItem value="Kuta">Kuta</SelectItem>
                  <SelectItem value="Canggu">Canggu</SelectItem>
                  <SelectItem value="Ubud">Ubud</SelectItem>
                  <SelectItem value="Uluwatu">Uluwatu</SelectItem>
                  <SelectItem value="Denpasar">Denpasar</SelectItem>
                  <SelectItem value="Sanur">Sanur</SelectItem>
                  <SelectItem value="Jimbaran">Jimbaran</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((area) => (
                  <Button
                    key={area}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      field.onChange(field.value.filter((a) => a !== area));
                    }}
                    disabled={isLoading}
                  >
                    {area} ×
                  </Button>
                ))}
              </div>
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
                onValueChange={(value) => {
                  const currentLanguages = field.value || [];
                  const newLanguages = currentLanguages.includes(value)
                    ? currentLanguages.filter((lang) => lang !== value)
                    : [...currentLanguages, value];
                  field.onChange(newLanguages);
                }}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Bahasa">Bahasa</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((language) => (
                  <Button
                    key={language}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      field.onChange(field.value.filter((l) => l !== language));
                    }}
                    disabled={isLoading}
                  >
                    {language} ×
                  </Button>
                ))}
              </div>
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}