import { AxiosError } from "axios"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  getErrorStatus,
  getStored,
  hasErrors,
  homeFor,
  normalizeIdentifier,
  removeStored,
  setStored,
  validateIdentifier,
  validateRegistration,
} from "."

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  identifier: "ada@example.com",
  password: "longenough",
}

describe("identifier", () => {
  it("keeps emails and strips separators from phone numbers", () => {
    expect(normalizeIdentifier("  ada@example.com ")).toBe("ada@example.com")
    expect(normalizeIdentifier("+33 6.12-34 56 78")).toBe("+33612345678")
  })

  it("returns an i18n key for empty and malformed values only", () => {
    expect(validateIdentifier("")).toBe("auth.errors.identifierRequired")
    expect(validateIdentifier("nope")).toBe("auth.errors.identifierInvalid")
    expect(validateIdentifier("ada@example.com")).toBeUndefined()
    expect(validateIdentifier("+33612345678")).toBeUndefined()
  })
})

describe("validateRegistration", () => {
  it("accepts a complete organizer form", () => {
    expect(hasErrors(validateRegistration(valid, true))).toBe(false)
  })

  it("reports every missing field", () => {
    const errors = validateRegistration(
      { firstName: "", lastName: "", identifier: "", password: "short" },
      false
    )

    expect(errors).toEqual({
      firstName: "auth.errors.firstNameRequired",
      lastName: "auth.errors.lastNameRequired",
      identifier: "auth.errors.identifierRequired",
      password: "auth.errors.passwordShort",
      terms: "auth.errors.termsRequired",
    })
  })

  it("checks company and documents only for providers", () => {
    expect(validateRegistration({ ...valid, companyName: "" }, true, [])).toMatchObject({
      companyName: "auth.errors.companyRequired",
      documents: "auth.errors.documentsRequired",
    })
    expect(
      hasErrors(
        validateRegistration({ ...valid, companyName: "Acme" }, true, [new File([], "a.pdf")])
      )
    ).toBe(false)
  })
})

describe("hasErrors", () => {
  it("ignores keys that hold undefined", () => {
    expect(hasErrors({ identifier: undefined })).toBe(false)
    expect(hasErrors({ identifier: "auth.errors.identifierInvalid" })).toBe(true)
  })
})

describe("homeFor", () => {
  it("maps each role to its home and falls back to login", () => {
    expect(homeFor("ORGANIZER")).toBe("/organizer")
    expect(homeFor("PROVIDER")).toBe("/provider")
    expect(homeFor("ADMIN")).toBe("/admin")
    expect(homeFor(null)).toBe("/login")
  })
})

describe("storage", () => {
  afterEach(() => vi.restoreAllMocks())

  it("round-trips a value", () => {
    setStored("k", "v")
    expect(getStored("k")).toBe("v")
    removeStored("k")
    expect(getStored("k")).toBeNull()
  })

  it("never throws when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked")
    })

    expect(getStored("k")).toBeNull()
    expect(() => setStored("k", "v")).not.toThrow()
    expect(() => removeStored("k")).not.toThrow()
  })
})

describe("getErrorStatus", () => {
  it("reads the status of axios errors only", () => {
    const err = new AxiosError("boom", "ERR", undefined, undefined, {
      status: 409,
    } as AxiosError["response"])

    expect(getErrorStatus(err)).toBe(409)
    expect(getErrorStatus(new Error("plain"))).toBeUndefined()
  })
})
