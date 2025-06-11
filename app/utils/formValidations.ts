 // utils/formValidator.ts

export type ValidationRule = "required" | `minlength:${number}` | `maxlength:${number}`;

export interface ValidationConfig {
  element: HTMLElement;
  rules: ValidationRule[];
  errorMessageContainer?: HTMLElement;
}

/**
 * Validates a single form field based on the provided rules.
 * @param element The HTML element to validate.
 * @param rules The validation rules to apply.
 * @returns True if the field is valid, false otherwise.
 */
function validateField(element: HTMLElement, rules: ValidationRule[]): boolean {
  let isValid = true;
  let errorMessage = "";

  rules.forEach(rule => {
    if (!isValid) return;  
     const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (rule === "required") {
      if ('value' in inputElement && inputElement.value.trim() === "") {
        isValid = false;
        errorMessage = `${element.previousElementSibling?.textContent?.replace('*', '').trim() || element.getAttribute('name') || 'Field'} is required.`;
      } else if (inputElement.tagName === "INPUT" && (inputElement as HTMLInputElement).type === "radio") {
        const radioGroupName = (inputElement as HTMLInputElement).name;
        const form = element.closest('form');
        if (form && !form.querySelector(`input[name="${radioGroupName}"]:checked`)) {
          isValid = false;
           
          errorMessage = `${(element.closest('.form-label') || element.parentElement?.querySelector('.form-label'))?.textContent?.replace('*', '').trim() || radioGroupName || 'Field'} is required.`;
        }
      }
    } else if (rule.startsWith("minlength:")) {
      const minLength = parseInt(rule.split(":")[1], 10);
      if ('value' in inputElement && inputElement.value.length < minLength) {
        isValid = false;
        errorMessage = `${element.previousElementSibling?.textContent?.replace('*', '').trim() || element.getAttribute('name') || 'Field'} must be at least ${minLength} characters long.`;
      }
    } else if (rule.startsWith("maxlength:")) {
      const maxLength = parseInt(rule.split(":")[1], 10);
      if ('value' in inputElement && inputElement.value.length > maxLength) {
        isValid = false;
        errorMessage = `${element.previousElementSibling?.textContent?.trim().replace('*', '') || element.getAttribute('name') || 'Field'} cannot exceed ${maxLength} characters.`;
      }
    }
  });

  displayErrorMessage(element, errorMessage);
  return isValid;
}

/**
 * Displays an error message for a given form field.
 * @param element The HTML element that failed validation.
 * @param message The error message to display.
 */
function displayErrorMessage(element: HTMLElement, message: string) {
  // Find the parent div of the input (FormField's flex-grow div)
  const formFieldChildrenWrapper = element.closest('.flex-grow.flex.flex-col') || element.parentElement;
  if (!formFieldChildrenWrapper) return; // Should not happen if structure is consistent

  let errorContainer = formFieldChildrenWrapper.querySelector('.error-message') as HTMLElement;

  if (!errorContainer) {
    errorContainer = document.createElement('p');
    errorContainer.className = 'error-message text-red-500 text-xs mt-1';
    formFieldChildrenWrapper.appendChild(errorContainer);
  }

  errorContainer.textContent = message;
  errorContainer.style.display = message ? 'block' : 'none';
}

/**
 * Validates an entire form.
 * @param formElement The HTML form element to validate.
 * @returns True if the form is valid, false otherwise.
 */
export function validateForm(formElement: HTMLFormElement): boolean {
  let isFormValid = true;
  const formFields = formElement.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-validate]');

  // Clear all previous error messages
  formElement.querySelectorAll('.error-message').forEach(el => el.remove());

  formFields.forEach(field => {
    const validateAttribute = field.getAttribute('data-validate');
    if (validateAttribute) {
      const rules = validateAttribute.split(',').map(rule => rule.trim()) as ValidationRule[];
      if (!validateField(field, rules)) {
        isFormValid = false;
      }
    }
  });

  return isFormValid;
}