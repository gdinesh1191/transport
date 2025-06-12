"use client";

import { useState, useRef, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

interface CommonDatePickerProps {
  name: string;
  value?: Dayjs | null;
  onChange?: (newValue: Dayjs | null) => void;
  required?: boolean;
  className?: string;
}

const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  name,
  value: propValue,
  onChange,
  required = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Dayjs | null>(propValue || dayjs()); // Initialize with propValue or current day
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Update internal value if propValue changes
  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  const handleDateChange = (newValue: Dayjs | null) => {
    setInternalValue(newValue);
    setOpen(false); // auto-close after selection
    onChange?.(newValue); // Call the onChange prop
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format="DD/MM/YYYY"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={internalValue}
        onChange={handleDateChange}
        slotProps={{
          textField: {
            inputRef: inputRef,
            name: name, // Important for form submission
            placeholder: 'DD/MM/YYYY',
            readOnly: true,
            className: `form-control py-[6px] px-3 text-[13px] h-9 focus:outline-none focus:ring-1 focus:ring-[#009333] focus:border-[#009333] ${className}`,
            onClick: () => setOpen(true),
            InputProps: {
              readOnly: true,
              sx: {
                height: '36px',
                fontSize: '13px',
              },
            },
            // Add data-validate for form validation if required
            ...(required ? { "data-validate": "required" } : {}),
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CommonDatePicker;