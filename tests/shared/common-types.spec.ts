import { describe, expect, test } from "vitest";
import type { StringId, Timestamp, ApiResponse } from "@/shared/common-types";

/* AI-generated */
describe("Common Types", () => {
  describe("StringId", () => {
    test("should accept string values", () => {
      const id: StringId = "test-id";
      expect(typeof id).toBe("string");
    });

    test("should work with various string formats", () => {
      const ids: StringId[] = [
        "simple-id",
        "id-with-numbers-123",
        "id_with_underscores",
        "ID-WITH-UPPERCASE",
        "id.with.dots",
        "id-with-特殊文字-漢字",
      ];

      ids.forEach((id) => {
        expect(typeof id).toBe("string");
      });
    });
  });

  describe("Timestamp", () => {
    test("should accept number values", () => {
      const timestamp: Timestamp = 1642233600000; // 2022-01-15
      expect(typeof timestamp).toBe("number");
    });

    test("should work with various timestamp values", () => {
      const timestamps: Timestamp[] = [
        0, // Unix epoch
        1642233600000, // 2022-01-15
        Date.now(), // Current time
        9999999999999, // Far future
      ];

      timestamps.forEach((timestamp) => {
        expect(typeof timestamp).toBe("number");
        expect(Number.isInteger(timestamp)).toBe(true);
      });
    });
  });

  describe("ApiResponse", () => {
    test("should have correct structure with required fields", () => {
      const response: ApiResponse<string> = {
        data: "test data",
        success: true,
      };

      expect(response.data).toBe("test data");
      expect(response.success).toBe(true);
      expect(response.message).toBeUndefined();
    });

    test("should work with optional message field", () => {
      const response: ApiResponse<number> = {
        data: 42,
        success: false,
        message: "Error occurred",
      };

      expect(response.data).toBe(42);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Error occurred");
    });

    test("should work with complex data types", () => {
      interface User {
        id: string;
        name: string;
        email: string;
      }

      const user: User = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
      };

      const response: ApiResponse<User> = {
        data: user,
        success: true,
        message: "User retrieved successfully",
      };

      expect(response.data.id).toBe("user-123");
      expect(response.data.name).toBe("John Doe");
      expect(response.data.email).toBe("john@example.com");
      expect(response.success).toBe(true);
      expect(response.message).toBe("User retrieved successfully");
    });

    test("should work with array data", () => {
      const response: ApiResponse<string[]> = {
        data: ["item1", "item2", "item3"],
        success: true,
      };

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toHaveLength(3);
      expect(response.data[0]).toBe("item1");
    });

    test("should work with null data", () => {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        message: "No data found",
      };

      expect(response.data).toBeNull();
      expect(response.success).toBe(false);
      expect(response.message).toBe("No data found");
    });
  });

  describe("Type compatibility", () => {
    test("should allow StringId to be used as string", () => {
      const id: StringId = "test-id";
      const str: string = id; // Should be compatible
      expect(str).toBe("test-id");
    });

    test("should allow Timestamp to be used as number", () => {
      const timestamp: Timestamp = 1642233600000;
      const num: number = timestamp; // Should be compatible
      expect(num).toBe(1642233600000);
    });

    test("should allow ApiResponse to be used with different generic types", () => {
      const stringResponse: ApiResponse<string> = {
        data: "test",
        success: true,
      };

      const numberResponse: ApiResponse<number> = {
        data: 42,
        success: true,
      };

      const booleanResponse: ApiResponse<boolean> = {
        data: true,
        success: false,
      };

      expect(typeof stringResponse.data).toBe("string");
      expect(typeof numberResponse.data).toBe("number");
      expect(typeof booleanResponse.data).toBe("boolean");
    });
  });
});
