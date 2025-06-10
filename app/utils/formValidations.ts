export const validateFormFields = (form: HTMLFormElement): boolean => {
    let isValid = true;
  
    // Clear previous errors
    const previousErrors = form.querySelectorAll('.input-error');
    previousErrors.forEach((el) => el.remove());
  
    const fields = form.querySelectorAll('[data-validate]') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  
    fields.forEach((field) => {
      const validationType = field.dataset.validate;
      const label = field.closest('[data-label]')?.getAttribute('data-label') || field.name || 'This field';
      const value = field.value.trim();
  
      let errorMessage = '';
  
      if (validationType?.includes('required') && !value) {
        errorMessage = `${label} is required`;
      }
  
      const minLength = field.getAttribute('minlength');
      const maxLength = field.getAttribute('maxlength');
  
      if (!errorMessage && minLength && value.length < parseInt(minLength)) {
        errorMessage = `${label} must be at least ${minLength} characters`;
      }
  
      if (!errorMessage && maxLength && value.length > parseInt(maxLength)) {
        errorMessage = `${label} must not exceed ${maxLength} characters`;
      }
  
      if (errorMessage) {
        isValid = false;
  
        const errorEl = document.createElement('div');
        errorEl.className = 'text-sm text-red-600 mt-1 input-error';
        errorEl.textContent = errorMessage;
  
        field.parentElement?.appendChild(errorEl);
      }
    });
  
    return isValid;
  };
  