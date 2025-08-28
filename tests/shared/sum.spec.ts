import { sum } from "@/shared/sum";
import { describe } from "node:test";
import { expect, test } from "vitest";

describe("sum", () => {
  test("should return the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
