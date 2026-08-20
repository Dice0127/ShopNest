import { useState } from "react";
import type { FieldErrors, ValidatorMap } from "../types";

// Small shared helper for real-time form validation: validates a single
// field on blur (so errors don't shout at the user while they're still
// typing), and re-validates on change once a field already has an error
// (so the message clears the moment they fix it).
export function useFieldValidation<T>(validators: ValidatorMap<T>) {
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (key: keyof T, value: string, allValues: T): string | null => {
    const validator = validators[key];
    if (!validator) return null;
    return validator(value, allValues);
  };

  const handleBlur = (key: keyof T, value: string, allValues: T) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const message = validateField(key, value, allValues);
    setErrors((e) => ({ ...e, [key]: message || undefined }));
  };

  const handleChange = (key: keyof T, value: string, allValues: T) => {
    if (touched[key]) {
      const message = validateField(key, value, allValues);
      setErrors((e) => ({ ...e, [key]: message || undefined }));
    }
  };

  const validateAll = (allValues: T): boolean => {
    const nextErrors: FieldErrors<T> = {};
    (Object.keys(validators) as (keyof T)[]).forEach((key) => {
      const message = validateField(key, String(allValues[key] ?? ""), allValues);
      if (message) nextErrors[key] = message;
    });
    setErrors(nextErrors);
    setTouched(
      Object.fromEntries((Object.keys(validators) as (keyof T)[]).map((k) => [k, true])) as Partial<
        Record<keyof T, boolean>
      >
    );
    return Object.keys(nextErrors).length === 0;
  };

  return { errors, handleBlur, handleChange, validateAll };
}
