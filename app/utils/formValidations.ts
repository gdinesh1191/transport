 // utils/formValidations.ts

export type ValidationRule = "required" | `minlength:${number}` | `maxlength:${number}`;

// Defines the structure for validation results for a single field
export interface FieldValidationResult {
    isValid: boolean;
    errorMessage: string;
}

// Defines the structure for all form errors
export interface FormErrors {
    [fieldName: string]: string; // Maps field name to its error message
}

/**
 * Validates a single form field based on the provided rules.
 * @param element The HTML element to validate.
 * @param rules The validation rules to apply.
 * @returns An object containing isValid and errorMessage.
 */
function validateField(element: HTMLElement, rules: ValidationRule[]): FieldValidationResult {
    let isValid = true;
    let errorMessage = "";

    const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    for (const rule of rules) {
        if (!isValid) break; // Exit if an error is already found for this field

        if (rule === "required") {
            // Handle SearchableSelect (custom component with hidden input)
            if (inputElement.type === "hidden") {
                if (inputElement.value.trim() === "") {
                    isValid = false;
                    const visibleDiv = element.parentElement?.querySelector('.form-control');
                    const fieldName = getFieldName(element, visibleDiv);
                    errorMessage = `${fieldName} is required.`;
                }
            }
            // Handle standard form inputs (text, select, textarea)
            else if ('value' in inputElement && inputElement.value.trim() === "") {
                isValid = false;
                errorMessage = `${getFieldName(element)} is required.`;
            }
            // Handle radio button groups (the wrapper DIV that has data-validate)
            else if (element.tagName === "DIV" && element.getAttribute("data-validate")?.includes("required")) {
                const radioInputs = element.querySelectorAll<HTMLInputElement>('input[type="radio"]');
                const isChecked = Array.from(radioInputs).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                    // Improved label text retrieval for radio groups
                    const labelText = element.closest('.mb-\\[10px\\]')?.querySelector(".form-label")?.textContent?.replace('*', '').trim() || radioInputs[0]?.name || "Option";
                    errorMessage = `${labelText} is required.`;
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
    }
    return { isValid, errorMessage };
}

/**
 * Helper function to get field name for error messages
 * @param element The form element
 * @param visibleElement Optional visible element (for custom components)
 * @returns The field name to use in error messages
 */
function getFieldName(element: HTMLElement, visibleElement?: Element | null): string {
    const nameAttribute = element.getAttribute('name');
    if (nameAttribute) return formatToTitleCase(nameAttribute); // Modified line

    const id = element.id;
    if (id) {
        const labelForId = document.querySelector(`label[for="${id}"]`);
        if (labelForId) return formatToTitleCase(labelForId.textContent?.replace('*', '').trim() || 'Field'); // Modified line
    }

    const formFieldParent = element.closest('.mb-\\[10px\\]');
    if (formFieldParent) {
        const labelElement = formFieldParent.querySelector('.form-label');
        if (labelElement) {
            return formatToTitleCase(labelElement.textContent?.replace('*', '').trim() || 'Field'); // Modified line
        }
    }

    if (visibleElement) {
        const placeholder = (visibleElement as HTMLInputElement).placeholder || (visibleElement as HTMLElement).textContent?.trim();
        if (placeholder && placeholder !== "Select an option" && !placeholder.startsWith("Select")) {
            return formatToTitleCase(placeholder.replace('Enter ', '').replace('Select ', '').trim()); // Modified line
        }
    }

    // For RadioGroup, if none of the above, try to get name from first child radio
    if (element.tagName === "DIV") {
        const radioInputs = element.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        if (radioInputs.length > 0 && radioInputs[0].name) {
            return formatToTitleCase(radioInputs[0].name);
        }
    }


    return 'Field';
}

/**
 * Helper function to convert camelCase or kebab-case to Title Case.
 * @param inputString The string to convert.
 * @returns The converted string in Title Case.
 */
function formatToTitleCase(inputString: string): string {
    if (!inputString) return 'Field';

    // Replace hyphens and underscores with spaces, then split by uppercase letters (for camelCase)
    const words = inputString
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/[-_]/g, ' ')      // Replace hyphens and underscores with spaces
        .split(' ')                 // Split by spaces
        .filter(word => word.length > 0); // Remove empty strings from split

    // Capitalize the first letter of each word and join them
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

/**
 * Validates an entire form.
 * @param formElement The HTML form element to validate.
 * @returns A FormErrors object containing error messages for invalid fields.
 */
export function validateForm(formElement: HTMLFormElement): FormErrors {
    const errors: FormErrors = {};

    const formFields = formElement.querySelectorAll<HTMLElement>('[data-validate], input[name], select[name], textarea[name]'); // Include elements with a name attribute

    formFields.forEach(field => {
        const validateAttribute = field.getAttribute('data-validate');
        let fieldName = field.getAttribute('name'); // Get the name attribute for storing errors

        // Special handling for RadioGroup where data-validate is on the parent div
        // and the 'name' attribute is on its *child* radio inputs.
        if (field.tagName === "DIV" && field.hasAttribute("data-validate") && validateAttribute?.includes("required")) {
            const radioInputs = field.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            // Find the name from one of the actual radio inputs
            if (!fieldName && radioInputs.length > 0) {
                fieldName = radioInputs[0].name;
            }

            if (fieldName && validateAttribute) { // Only proceed if a fieldName is found
                const rules = validateAttribute!.split(',').map(rule => rule.trim()) as ValidationRule[];
                const result = validateField(field, rules); // Pass the DIV itself for validation
                if (!result.isValid) {
                    errors[fieldName] = result.errorMessage;
                }
            }
        }
        // Standard input/select/textarea or hidden input for SearchableSelect
        else if (fieldName) { // Ensure field has a name to store its error
            if (validateAttribute) {
                const rules = validateAttribute.split(',').map(rule => rule.trim()) as ValidationRule[];
                const result = validateField(field, rules);
                if (!result.isValid) {
                    errors[fieldName] = result.errorMessage;
                }
            }
        }
    });

    return errors;
}