 // app/utils/form-controls.tsx
"use client";

import React from "react";

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
  id, // Destructure the id prop
  ...props // Capture any other props, including data-validate if passed directly
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  id?: string; // Define the id prop
  [key: string]: any; // Allow other props like data-validate
}) => (
  <div
    id={id} // Apply the id to the main div
    className="flex flex-col"
    {...(required ? { 'data-validate': 'required' } : {})}
    {...props} // Pass through any other props (like 'data-validate' if explicitly passed)
  >
    <div className="flex flex-wrap items-center gap-6">
      {options.map((option) => (
        <label key={option.value} className="inline-flex items-center text-sm">
          <input
            type="radio"
            name={name}
            value={option.value}
            className="form-radio text-[#009333] focus:ring-[#009333]"
          />
          <span className="ml-2">{option.label}</span>
        </label>
      ))}
    </div>
    {/* This error message will now be managed by the parent component's error prop */}
    {/* You should remove this line if error display is fully managed by FormField component in NewVehicle.tsx */}
    {/* <p className="error-message text-red-500 text-xs mt-1 hidden"></p> */}
  </div>
);