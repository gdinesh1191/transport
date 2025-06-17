 // app/utils/form-controls.tsx
"use client";

import React, { useState, useEffect } from "react"; // Import useState and useEffect

export const Input = ({
  name,
  placeholder,
  type = "text",
  className = "",
  ...props
}: {
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className={`form-control ${className}`}
    {...props}
  />
);

export const RadioGroup = ({
  name,
  options,
  required = false,
  id,
  defaultValue, // Keep defaultValue for initial state
  onChange: externalOnChange, // Accept an optional external onChange handler
  ...props
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  id?: string;
  defaultValue?: string; // Type for defaultValue
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional external onChange
  [key: string]: any;
}) => {
  // Use internal state to manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || "");

  // Use useEffect to update internal state if defaultValue changes (e.g., when edit_id changes)
  useEffect(() => {
    setSelectedValue(defaultValue || "");
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue); // Update internal state

    // If an external onChange handler is provided, call it
    if (externalOnChange) {
      externalOnChange(event);
    }
  };

  return (
    <div
      id={id}
      className="flex flex-col"
      {...(required ? { "data-validate": "required" } : {})}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-6">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center text-sm">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="form-radio text-[#009333] focus:ring-[#009333]"
              checked={selectedValue === option.value} // Controlled by internal state
              onChange={handleChange} // Use internal change handler
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};