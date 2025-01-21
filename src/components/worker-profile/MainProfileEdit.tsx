import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { JobType, Language, WorkArea } from "@/types/database.types";

const formSchema = z.object({
  profilePicture: z.string().optional(),
  job: z.string(),
  workAreas: z.array(z.string()),
  languages: z.array(z.string()),
  aboutMe: z.string().max(300).optional(),
  isAvailable: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface MainProfileEditProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
}

export function MainProfileEdit({ initialData, onSubmit }: MainProfileEditProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePicture: initialData?.profilePicture || "",
      job: initialData?.job || "",
      workAreas: initialData?.workAreas || [],
      languages: initialData?.languages || [],
      aboutMe: initialData?.aboutMe || "",
      isAvailable: initialData?.isAvailable || false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Profile Picture */}
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={field.value} />
                    <AvatarFallback>
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    Upload Photo
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Selection */}
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(JobType).map((job) => (
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

        {/* Work Areas */}
        <FormField
          control={form.control}
          name="workAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Areas</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange([...field.value, value])
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work areas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(WorkArea).map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((area) => (
                  <Button
                    key={area}
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      field.onChange(field.value.filter((a) => a !== area))
                    }
                  >
                    {area} ×
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Languages */}
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange([...field.value, value])
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Language).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((lang) => (
                  <Button
                    key={lang}
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      field.onChange(field.value.filter((l) => l !== lang))
                    }
                  >
                    {lang} ×
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* About Section */}
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
              <p className="text-sm text-muted-foreground">
                {field.value?.length || 0}/300 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availability Toggle */}
        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Availability</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Show that you're available for work
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}