"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  name?: string; // Add name prop for form submission
  required?: boolean; // Add required prop
  'data-validate'?: string; // Add data-validate prop for validation rules
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  date, 
  setDate, 
  className, 
  placeholder,
  name,
  required = false,
  'data-validate': dataValidate
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false); 
  };

  // Format date for form submission (ISO string or empty string)
  const getFormattedValue = () => {
    return date ? date.toISOString() : '';
  };

  return (
    <div className="relative">
      {/* Hidden input for form submission and validation */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={getFormattedValue()}
          required={required}
          data-validate={dataValidate}
        />
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button" // Prevent form submission when clicking the button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal", 
              !date && "text-muted-foreground", 
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder || "Pick a date"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            captionLayout="dropdown"
            defaultMonth={date || new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;