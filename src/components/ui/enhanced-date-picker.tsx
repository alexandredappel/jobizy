import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedDatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  label?: string;
}

export function EnhancedDatePicker({ 
  date, 
  onSelect, 
  disabled,
  label 
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayedMonth, setDisplayedMonth] = React.useState(date || new Date());
  
  // Generate years for the past 50 years
  const years = Array.from({ length: 50 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Generate months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleSelect = (newDate: Date | undefined) => {
    onSelect(newDate);
    setIsOpen(false);
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMonthChange = (value: string) => {
    const newDate = new Date(displayedMonth);
    newDate.setMonth(parseInt(value));
    setDisplayedMonth(newDate);
  };

  const handleYearChange = (value: string) => {
    const newDate = new Date(displayedMonth);
    newDate.setFullYear(parseInt(value));
    setDisplayedMonth(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{label || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        onClick={handleCalendarClick}
        style={{ pointerEvents: 'auto' }}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          month={displayedMonth}
          onMonthChange={setDisplayedMonth}
          initialFocus
          className="rounded-md border"
          classNames={{
            head_cell: "w-10 font-normal text-muted-foreground",
            cell: cn(
              "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent",
              "hover:bg-accent hover:text-accent-foreground focus-within:relative focus-within:z-20"
            ),
            nav_button: cn(
              "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent",
              "absolute top-1"
            ),
            nav_button_previous: "left-1",
            nav_button_next: "right-1",
            caption: "flex justify-center pt-1 relative items-center px-10",
            caption_label: "text-sm font-medium",
          }}
          components={{
            Caption: ({ displayMonth }: { displayMonth: Date }) => {
              const displayYear = displayMonth.getFullYear();
              return (
                <div className="flex justify-center space-x-2 py-2" onClick={handleCalendarClick}>
                  <Select
                    value={displayMonth.getMonth().toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={displayYear.toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue>{displayYear}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}