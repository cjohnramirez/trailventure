import { describe, expect, it } from "vitest";

import { codeSchema, loginSchema, registerSchema } from "./schemas";

const validRegistration = {
  first_name: "Juan",
  last_name: "Dela Cruz",
  email: "juan@example.com",
  password: "a-long-password",
  password_confirm: "a-long-password",
};

describe("registerSchema", () => {
  it("accepts a complete registration", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects mismatched passwords on the confirm field", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password_confirm: "different-one",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["password_confirm"]);
  });

  it("requires at least 10 password characters", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "short",
      password_confirm: "short",
    });
    expect(result.error?.issues.map((issue) => issue.path[0])).toContain("password");
  });
});

describe("loginSchema", () => {
  it("explains a malformed email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.error?.issues[0]?.message).toBe("Enter a valid email address.");
  });
});

describe("codeSchema", () => {
  it.each(["123456", "000000"])("accepts %s", (code) => {
    expect(codeSchema.safeParse({ code }).success).toBe(true);
  });

  it.each(["12345", "12345a", "1234567"])("rejects %s", (code) => {
    expect(codeSchema.safeParse({ code }).success).toBe(false);
  });
});
