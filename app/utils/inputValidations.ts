 // utils/inputValidations.ts
'use client';

import { useEffect } from 'react';

const useInputValidation = () => {
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      let value = target.value;

      if (target.classList.contains('only_number')) {
        value = value.replace(/[^\d]/g, '');
      }

      if (target.classList.contains('alphabet_only')) {
        value = value.replace(/[^a-zA-Z\s]/g, '');
      }

      if (target.classList.contains('number_with_decimal')) {
         value = value.replace(/[^0-9.]/g, '');
        const match = value.match(/^(\d+(\.\d{0,2})?)?/);
        value = match ? match[0] : '';
      }

      if (target.classList.contains('alphanumeric')) {
        value = value.replace(/[^a-zA-Z0-9\s]/g, '');
      }

      if (target.classList.contains('capitalize')) {
        value = value.replace(/\b\w/g, char => char.toUpperCase());
      }

      if (target.classList.contains('no_space')) {
        value = value.replace(/\s+/g, '');
      }

      if (target.classList.contains('all_uppercase')) {
        value = value.toUpperCase();
      }

      if (target.classList.contains('whole_number')) {
        
        value = value.replace(/[^\d]/g, '');
      }

      
      target.value = value;
    };

    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('input', handleInput);
    };
  }, []);
};

export default useInputValidation;
