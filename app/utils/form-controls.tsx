 // app/utils/formControls.tsx
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
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div
    className="flex flex-col"
    {...(required ? { 'data-validate': 'required' } : {})}
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
    <p className="error-message text-red-500 text-xs mt-1 hidden"></p>
  </div>
);
