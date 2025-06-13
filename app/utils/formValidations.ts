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
      // Handle SearchableSelect (custom component with hidden input)
      if (inputElement.type === "hidden") {
        if (inputElement.value.trim() === "") {
          isValid = false;
          // Look for the placeholder text in the visible div to determine field name
          const visibleDiv = element.parentElement?.querySelector('.form-control');
          const fieldName = getFieldName(element, visibleDiv);
          errorMessage = `${fieldName} is required.`;
        }
      }
      // Handle standard form inputs
      else if ('value' in inputElement && inputElement.value.trim() === "") {
        isValid = false;
        errorMessage = `${getFieldName(element)} is required.`;
      } 
      // Handle radio button groups (wrapper div)
      else if (inputElement.tagName === "DIV" && element.getAttribute("data-validate")?.includes("required")) {
        const radioInputs = element.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        if (radioInputs.length > 0) {
          const isChecked = Array.from(radioInputs).some(radio => radio.checked);
          if (!isChecked) {
            isValid = false;
            const labelText = element.parentElement?.querySelector(".form-label")?.textContent?.replace('*', '').trim() || radioInputs[0].name;
            errorMessage = `${labelText} is required.`;
            displayErrorMessage(element, errorMessage);
            return false;
          }
        }
      }
    }
    else if (rule.startsWith("minlength:")) {
      const minLength = parseInt(rule.split(":")[1], 10);
      if ('value' in inputElement && inputElement.value.length < minLength) {
        isValid = false;
        errorMessage = `${getFieldName(element)} must be at least ${minLength} characters long.`;
      }
    } 
    else if (rule.startsWith("maxlength:")) {
      const maxLength = parseInt(rule.split(":")[1], 10);
      if ('value' in inputElement && inputElement.value.length > maxLength) {
        isValid = false;
        errorMessage = `${getFieldName(element)} cannot exceed ${maxLength} characters.`;
      }
    }
  });

  displayErrorMessage(element, errorMessage);
  return isValid;
}

/**
 * Helper function to get field name for error messages
 * @param element The form element
 * @param visibleElement Optional visible element (for custom components)
 * @returns The field name to use in error messages
 */
function getFieldName(element: HTMLElement, visibleElement?: Element | null): string {
  // Try to get from previous sibling label
  const labelFromSibling = element.previousElementSibling?.textContent?.replace('*', '').trim();
  if (labelFromSibling) return labelFromSibling;
  
  // Try to get from parent's label
  const labelFromParent = element.parentElement?.querySelector("label")?.textContent?.replace('*', '').trim();
  if (labelFromParent) return labelFromParent;
  
  // For SearchableSelect, try to get from placeholder or name attribute
  if (visibleElement) {
    const placeholder = visibleElement.textContent?.trim();
    if (placeholder && placeholder !== "Select an option" && !placeholder.startsWith("Select")) {
      return placeholder;
    }
  }
  
  // Fallback to name attribute or generic "Field"
  return element.getAttribute('name') || 'Field';
}

/**
 * Displays an error message for a given form field.
 * @param element The HTML element that failed validation.
 * @param message The error message to display.
 */
function displayErrorMessage(element: HTMLElement, message: string) {
  // For SearchableSelect (hidden input), attach error to parent container
  let container: Element | null = null;
  
  if ((element as HTMLInputElement).type === "hidden") {
    // This is likely a SearchableSelect - find the parent container
    container = element.parentElement;
  } else {
    // Standard form field
    container = element.closest('.flex-grow.flex.flex-col') || element.parentElement;
  }
  
  if (!container) return;

  let errorContainer = container.querySelector('.error-message') as HTMLElement;

  if (!errorContainer) {
    errorContainer = document.createElement('p');
    errorContainer.className = 'error-message text-red-500 text-xs mt-1';
    container.appendChild(errorContainer);
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
  
  // Get all elements with data-validate attribute (including hidden inputs from SearchableSelect)
  const formFields = formElement.querySelectorAll<HTMLElement>('[data-validate]');

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