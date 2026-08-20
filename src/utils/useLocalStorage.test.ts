import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes with the given default when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("test:key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("persists updates to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test:key", "default"));
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("test:key") ?? "null")).toBe("updated");
  });

  it("rehydrates from an existing localStorage value on mount", () => {
    window.localStorage.setItem("test:key", JSON.stringify({ foo: "bar" }));
    const { result } = renderHook(() => useLocalStorage("test:key", null));
    expect(result.current[0]).toEqual({ foo: "bar" });
  });

  it("falls back to the default when stored JSON is corrupted", () => {
    window.localStorage.setItem("test:key", "{not valid json");
    const { result } = renderHook(() => useLocalStorage("test:key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });
});
