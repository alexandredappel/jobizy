import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { WorkExperience } from "@/types/database.types";

const experienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrentJob: z.boolean(),
  description: z.string(),
});

type FormData = z.infer<typeof experienceSchema>;

interface WorkExperienceModalProps {
  experiences: WorkExperience[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (experiences: WorkExperience[]) => Promise<void>;
}

export function WorkExperienceModal({
  experiences,
  isOpen,
  onClose,
  onSave,
}: WorkExperienceModalProps) {
  const { toast } = useToast();
  const [localExperiences, setLocalExperiences] = React.useState<WorkExperience[]>(experiences);
  const form = useForm<FormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      companyName: "",
      position: "",
      startDate: new Date(),
      isCurrentJob: false,
      description: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const newExperience: WorkExperience = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedExperiences = [...localExperiences, newExperience];
      setLocalExperiences(updatedExperiences);
      form.reset();
      
      toast({
        title: "Experience added",
        description: "Work experience has been added successfully.",
      });
    } catch (error) {
      console.error("Add experience error:", error);
      toast({
        title: "Error",
        description: "Failed to add experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    setLocalExperiences(localExperiences.filter((exp) => exp.id !== id));
    toast({
      title: "Experience removed",
      description: "Work experience has been removed.",
    });
  };

  const handleSave = async () => {
    try {
      await onSave(localExperiences);
      onClose();
      toast({
        title: "Changes saved",
        description: "Your work experiences have been updated.",
      });
    } catch (error) {
      console.error("Save experiences error:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Work Experience</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Experience List */}
          <div className="space-y-4">
            {localExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">
                    {exp.companyName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(exp.startDate, "MMM yyyy")} -{" "}
                    {exp.isCurrentJob
                      ? "Present"
                      : exp.endDate && format(exp.endDate, "MMM yyyy")}
                  </p>
                  <p className="mt-2 text-sm">{exp.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleDelete(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Experience Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={form.watch("isCurrentJob")}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < form.watch("startDate") ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isCurrentJob"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Current Position</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        I currently work here
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </form>
          </Form>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}