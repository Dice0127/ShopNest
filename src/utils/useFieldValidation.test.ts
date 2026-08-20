import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFieldValidation } from "./useFieldValidation";
import type { ValidatorMap } from "../types";

interface TestForm {
  name: string;
  email: string;
}

const validators: ValidatorMap<TestForm> = {
  name: (v) => (!v.trim() ? "Name is required" : null),
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? "Enter a valid email" : null),
};

const emptyForm: TestForm = { name: "", email: "" };

describe("useFieldValidation", () => {
  it("has no errors before anything is touched", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    expect(result.current.errors).toEqual({});
  });

  it("does not show an error while typing before the field has been blurred", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    act(() => {
      result.current.handleChange("name", "", emptyForm);
    });
    // Real-time validation only kicks in once a field is `touched` (blurred),
    // so errors shouldn't appear while the user is still typing for the first time.
    expect(result.current.errors.name).toBeUndefined();
  });

  it("sets an error on blur when the field is invalid", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    act(() => {
      result.current.handleBlur("name", "", emptyForm);
    });
    expect(result.current.errors.name).toBe("Name is required");
  });

  it("clears the error on blur once the field becomes valid", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    act(() => {
      result.current.handleBlur("name", "", emptyForm);
    });
    expect(result.current.errors.name).toBe("Name is required");

    act(() => {
      result.current.handleBlur("name", "Juan", { ...emptyForm, name: "Juan" });
    });
    expect(result.current.errors.name).toBeUndefined();
  });

  it("re-validates on change once a field is already touched, so the error clears as the user types", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    act(() => {
      result.current.handleBlur("email", "not-an-email", { ...emptyForm, email: "not-an-email" });
    });
    expect(result.current.errors.email).toBe("Enter a valid email");

    act(() => {
      result.current.handleChange("email", "juan@example.com", { ...emptyForm, email: "juan@example.com" });
    });
    expect(result.current.errors.email).toBeUndefined();
  });

  it("does not re-validate on change for an untouched field", () => {
    const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
    act(() => {
      result.current.handleChange("email", "not-an-email", { ...emptyForm, email: "not-an-email" });
    });
    expect(result.current.errors.email).toBeUndefined();
  });

  describe("validateAll", () => {
    it("returns false and populates every invalid field when the form is empty", () => {
      const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
      let isValid = true;
      act(() => {
        isValid = result.current.validateAll(emptyForm);
      });
      expect(isValid).toBe(false);
      expect(result.current.errors.name).toBe("Name is required");
      expect(result.current.errors.email).toBe("Enter a valid email");
    });

    it("returns true and leaves no errors when the form is valid", () => {
      const { result } = renderHook(() => useFieldValidation<TestForm>(validators));
      const validForm: TestForm = { name: "Juan", email: "juan@example.com" };
      let isValid = false;
      act(() => {
        isValid = result.current.validateAll(validForm);
      });
      expect(isValid).toBe(true);
      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.errors.email).toBeUndefined();
    });
  });
});
