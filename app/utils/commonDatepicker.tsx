 // app/utils/commonDatepicker.tsx
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  name: string; // Make name required
  required?: boolean;
  "data-validate"?: string;
  id: string; // Make id required
  minDate?: Date; // Minimum allowed date
  maxDate?: Date; // Maximum allowed date
  disableFuture?: boolean; // Optional shortcut
  disablePast?: boolean; // Optional shortcut
  initialDate?: Date; // Prop for setting initial date
  
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
  initialDate,
}) => {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    return d;
  }, []);

  // Use a single state for the selected date
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialDate
  );
  // Derived state for the input field display
  const [inputValue, setInputValue] = React.useState(formatDate(initialDate));
  const [open, setOpen] = React.useState(false);
  // Month for the calendar view, defaults to selectedDate or today
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(
    initialDate || today
  );

  // Effect to sync initialDate prop with internal state,
  // and set default to today if required or if disableFuture/Past is true and no initialDate
  React.useEffect(() => {
    if (initialDate !== undefined && !areDatesEqual(initialDate, selectedDate)) {
      // If initialDate prop changes and it's different from current selectedDate
      setSelectedDate(initialDate);
      setInputValue(formatDate(initialDate));
      setCalendarMonth(initialDate); // Set calendar to the initial date's month
    } else if (initialDate === undefined && selectedDate === undefined) {
      // If no initialDate prop, and nothing is selected, check for default behavior
      if (required || disableFuture || disablePast) {
        // Set to today if required or constraints apply and no date is set
        setSelectedDate(today);
        setInputValue(formatDate(today));
        setCalendarMonth(today);
      } else {
        // Otherwise, ensure no date is selected and input is empty
        setSelectedDate(undefined);
        setInputValue("");
        setCalendarMonth(today); // Calendar still opens to today
      }
    }
    // Note: If selectedDate is already set and matches initialDate, do nothing.
    // This prevents infinite loops or unnecessary updates.
  }, [initialDate, required, disableFuture, disablePast, today, selectedDate]);


  // Helper to compare dates without time for useEffect dependency
  const areDatesEqual = (date1: Date | undefined, date2: Date | undefined) => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parts = value.split("/");
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr, 10);
      const monthNum = parseInt(monthStr, 10); // month-1 for Date constructor
      const year = parseInt(yearStr, 10);

      if (!isNaN(day) && !isNaN(monthNum) && !isNaN(year)) {
        const parsedDate = new Date(year, monthNum - 1, day);
        parsedDate.setHours(0, 0, 0, 0);

        if (isValidDate(parsedDate)) {
          const isDateAllowed =
            (!minDate || parsedDate >= minDate) &&
            (!maxDate || parsedDate <= maxDate) &&
            (!disableFuture || parsedDate <= today) &&
            (!disablePast || parsedDate >= today);

          if (isDateAllowed) {
            setSelectedDate(parsedDate);
            setCalendarMonth(parsedDate); // Update calendar month on valid manual input
          } else {
            setSelectedDate(undefined); // Clear if out of range
          }
        } else {
          setSelectedDate(undefined); // Clear if invalid date
        }
      } else {
        setSelectedDate(undefined); // Clear if parts are not numbers
      }
    } else if (value === "") {
      setSelectedDate(undefined); // Clear if input is empty
    } else {
      setSelectedDate(undefined); // Clear if not a complete DD/MM/YYYY
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    // This is the crucial part: `date` argument is the selected date from the calendar.
    if (date) {
      date.setHours(0, 0, 0, 0); // Normalize selected date
    }
    setSelectedDate(date); // Set the selected date state
    setInputValue(formatDate(date)); // Update the input field display
    if (date) {
      setCalendarMonth(date); // Keep calendar on the selected month
    } else {
        setCalendarMonth(today); // If cleared, go back to today's month
    }
    setOpen(false); // Close the popover
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={formatDate(selectedDate)} // Always format for the hidden input
        required={required}
        data-validate={dataValidate}
      />

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
              selected={selectedDate} // Bind calendar to selectedDate state
              captionLayout="dropdown"
              month={calendarMonth} // Control calendar's displayed month
              onMonthChange={setCalendarMonth}
              onSelect={handleCalendarSelect} // This is where the selected date is handled
              defaultMonth={calendarMonth} // Default calendar to its controlled month
              disabled={(dateToCheck) => {
                const normalizedDateToCheck = new Date(
                  dateToCheck.getFullYear(),
                  dateToCheck.getMonth(),
                  dateToCheck.getDate()
                );
                const normalizedToday = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );

                if (disableFuture && normalizedDateToCheck > normalizedToday)
                  return true;
                if (disablePast && normalizedDateToCheck < normalizedToday)
                  return true;
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