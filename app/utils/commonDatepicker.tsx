 "use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
 
  name?: string;
  required?: boolean;
  "data-validate"?: string;
  id?: string;
 
}

// Format date as DD/MM/YYYY
function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime());
}

const DatePicker: React.FC<DatePickerProps> = ({
  date: propDate,
  setDate,
  className,
  placeholder = "Select date",
  name,
  required = false,
  "data-validate": dataValidate,
  id
}) => {
  const today = new Date();
  const [date, setLocalDate] = React.useState<Date | undefined>(propDate ?? today);
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(propDate ?? today);
  const [inputValue, setInputValue] = React.useState(formatDate(propDate ?? today));

  // Sync prop date changes
  React.useEffect(() => {
    if (propDate) {
      setLocalDate(propDate);
      setInputValue(formatDate(propDate));
    }
  }, [propDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (isValidDate(parsedDate)) {
        setLocalDate(parsedDate);
        setDate(parsedDate);
        setMonth(parsedDate);
      }
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setLocalDate(selectedDate);
    setDate(selectedDate);
    setInputValue(formatDate(selectedDate));
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const getFormattedValue = () => {
    return date ? date.toLocaleDateString("en-GB") : "";
  };

  return (
 
    <div className={cn("relative", className)}>
      {/* Hidden input for form submission */}
 
      {name && (
        <input
          type="hidden"
          name={name}
          value={getFormattedValue()}
          required={required}
          data-validate={dataValidate}
        />
      )}
 

      <div className="relative flex gap-2">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              defaultMonth={date || new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
 
    </div>
  );
};

export default DatePicker;
