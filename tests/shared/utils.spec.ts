import { describe, expect, test } from "vitest";
import { cn } from "@/shared/utils";

/* AI-generated */
describe("cn (class name utility)", () => {
  test("should merge class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  test("should handle conditional classes", () => {
    expect(cn("base", true && "conditional")).toBe("base conditional");
    expect(cn("base", false && "conditional")).toBe("base");
  });

  test("should handle arrays", () => {
    expect(cn("base", ["class1", "class2"])).toBe("base class1 class2");
  });

  test("should handle objects", () => {
    expect(cn("base", { class1: true, class2: false, class3: true })).toBe(
      "base class1 class3"
    );
  });

  test("should handle mixed inputs", () => {
    expect(cn("base", "class1", { class2: true }, ["class3", "class4"])).toBe(
      "base class1 class2 class3 class4"
    );
  });

  test("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn("base", "")).toBe("base");
  });

  test("should handle undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
    expect(cn(undefined, null, "base")).toBe("base");
  });

  test("should handle duplicate classes", () => {
    expect(cn("class1", "class1")).toBe("class1 class1");
  });

  test("should handle complex scenarios", () => {
    const isActive = true;
    const isDisabled = false;
    const size = "large";

    expect(
      cn(
        "button",
        "base-button",
        isActive && "active",
        isDisabled && "disabled",
        size === "large" && "large",
        ["primary", "rounded"]
      )
    ).toBe("button base-button active large primary rounded");
  });
});
