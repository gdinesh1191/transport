 // app/utils/commonDatepicker.tsx
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming this is your utility for Tailwind classes
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Assuming these are from Shadcn UI
import { Button } from "@/components/ui/button"; // Assuming these are from Shadcn UI
import { Calendar } from "@/components/ui/calendar"; // Assuming these are from Shadcn UI
import { Input } from "@/components/ui/input"; // Assuming this is your Input component, likely from Shadcn UI

interface DatePickerProps {
  date: Date | undefined; // Back to Date object
  setDate: (date: Date | undefined) => void; // Back to Date object
  className?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  "data-validate"?: string;
  id?: string;
  minDate?: Date; // 👈 Minimum allowed date
  maxDate?: Date; // 👈 Maximum allowed date
  disableFuture?: boolean; // 👈 Optional shortcut
  disablePast?: boolean; // 👈 Optional shortcut
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
  date: propDate, // Renamed to propDate to avoid conflict with local state
  setDate, // This setDate expects a Date object now
  className,
  placeholder = "Select date",
  name,
  required = false,
  "data-validate": dataValidate,
  id,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
}) => {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    return d;
  }, []);

  const [localDate, setLocalDate] = React.useState<Date | undefined>(propDate);
  const [inputValue, setInputValue] = React.useState(formatDate(propDate));
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(propDate);

  // --- Combined Effect for Initialization and Prop Syncing ---
  React.useEffect(() => {
    const shouldSetInitialDefault = propDate === undefined && (required || disableFuture || disablePast);

    if (shouldSetInitialDefault) {
      const initialDateToSet = new Date();
      initialDateToSet.setHours(0, 0, 0, 0);

      setLocalDate(initialDateToSet);
      setInputValue(formatDate(initialDateToSet));
      setDate(initialDateToSet); // Correct: Pass Date object
      setMonth(initialDateToSet);
    } else if (propDate !== undefined) {
      setLocalDate(propDate);
      setInputValue(formatDate(propDate));
      setMonth(propDate);
    } else {
      setLocalDate(undefined);
      setInputValue("");
      setDate(undefined); // Correct: Pass undefined
      setMonth(today);
    }
  }, [propDate, required, setDate, disableFuture, disablePast, today]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse DD/MM/YYYY
    const parts = value.split("/");
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10); // month-1 for Date constructor
      const year = parseInt(yearStr, 10);

      // Basic validity check for numbers
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month - 1, day);
        parsedDate.setHours(0, 0, 0, 0); // Normalize parsed date to start of day

        if (isValidDate(parsedDate)) {
          // Check if parsed date is within allowed min/max range
          const isDateAllowed =
            (!minDate || parsedDate >= minDate) &&
            (!maxDate || parsedDate <= maxDate) &&
            (!disableFuture || parsedDate <= today) &&
            (!disablePast || parsedDate >= today); // Use `today` which is normalized

          if (isDateAllowed) {
            setLocalDate(parsedDate);
            setDate(parsedDate); // Correct: Update parent state with Date object
            setMonth(parsedDate); // Sync month for calendar view
          } else {
            // If date is invalid or out of range, clear parent state
            setDate(undefined); // Correct: Clear parent state with undefined
            setLocalDate(undefined); // Clear local state if invalid
          }
        } else {
          // If date is invalid, clear parent state
          setDate(undefined); // Correct: Clear parent state with undefined
          setLocalDate(undefined); // Clear local state if invalid
        }
      } else {
        // If parts are not numbers, clear parent state
        setDate(undefined); // Correct: Clear parent state with undefined
        setLocalDate(undefined); // Clear local state if invalid
      }
    } else {
      // If input is not a complete DD/MM/YYYY, clear parent state
      setDate(undefined); // Correct: Clear parent state with undefined
      setLocalDate(undefined); // Clear local state if invalid
    }
    // If the input is empty, clear the date
    if (value === "") {
      setLocalDate(undefined);
      setDate(undefined); // Correct: Clear parent state with undefined
    }
  };


  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0); // Normalize selected date to start of day
    }
    setLocalDate(selectedDate);
    setDate(selectedDate); // Correct: Update parent state with Date object
    setInputValue(formatDate(selectedDate));
    if (selectedDate) {
      setMonth(selectedDate); // Set calendar to selected month
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  // The hidden input should reflect the actual date in local state
  const getHiddenInputValue = () => {
    return localDate ? localDate.toLocaleDateString("en-GB") : ""; // Consistent with input display
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden input for form submission */}
      {name && ( // Only render if name is provided
        <input
          type="hidden"
          name={name}
          value={getHiddenInputValue()} // Use localDate for value, which is formatted as DD/MM/YYYY by getHiddenInputValue
          required={required} // Propagate required to hidden input
          data-validate={dataValidate} // Propagate data-validate to hidden input
        />
      )}

      <div className="relative flex gap-2">
        <Input
          id={id} // ID for linking with FormField label's htmlFor
          value={inputValue} // Bind to inputValue for manual input control
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button" // Important: Prevent form submission
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
              selected={localDate} // Use localDate for selected
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              defaultMonth={localDate || today} // Default calendar to selected date or today
              disabled={(dateToCheck) => {
                // Normalize dates to start of day for comparison
                const normalizedDateToCheck = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
                const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                if (disableFuture && normalizedDateToCheck > normalizedToday) return true;
                if (disablePast && normalizedDateToCheck < normalizedToday) return true;
                if (minDate && normalizedDateToCheck < minDate) return true;
                if (maxDate && normalizedDateToCheck > maxDate) return true;
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;