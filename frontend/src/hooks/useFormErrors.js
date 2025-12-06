import { useState } from "react";

// Generic form validation and error handling hook
export default function useFormErrors(initialErrors = {}) {
  const [errors, setErrors] = useState(initialErrors);

  function setFieldError(field, message) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function clearFieldError(field) {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }

  // Clear ALL errors
  function clearAllErrors() {
    setErrors({});
  }

  // Get error message for a specific field
  function getFieldError(field) {
    return errors[field] || "";
  }

  // Validate fields based on provided rules
  function validate(fields, rules) {
    const newErrors = {};

    Object.entries(fields).forEach(([field, value]) => {
      const validator = rules[field];
      if (typeof validator === "function") {
        const msg = validator(value, fields);
        if (msg) {
          newErrors[field] = msg;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    validate,
  };
}