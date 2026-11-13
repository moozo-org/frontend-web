import { beforeEach, describe, expect, it, vi } from "vitest"
import axiosInstance from "./axiosInstance"
import forgotPassword from "./auth/forgotPassword"
import login from "./auth/login"
import register from "./auth/register"
import registerProvider from "./auth/registerProvider"
import resendCode from "./auth/resendCode"
import resetPassword from "./auth/resetPassword"
import verify from "./auth/verify"
import changePassword from "./users/changePassword"
import getMe from "./users/me"

vi.mock("./axiosInstance", () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))

const http = vi.mocked(axiosInstance)

beforeEach(() => {
  vi.clearAllMocks()
  http.post.mockResolvedValue({ data: { token: "jwt", role: "ORGANIZER" } })
})

describe("auth services", () => {
  it.each([
    ["login", () => login("a@b.co", "pw"), "/auth/login", { identifier: "a@b.co", password: "pw" }],
    [
      "verify",
      () => verify("a@b.co", "123456"),
      "/auth/verify",
      { identifier: "a@b.co", code: "123456" },
    ],
  ])("%s posts and stores the token", async (_name, call, path, body) => {
    const data = await call()

    expect(http.post).toHaveBeenCalledWith(path, body)
    expect(data.token).toBe("jwt")
    expect(localStorage.getItem("token")).toBe("jwt")
  })

  it("register stores the token too", async () => {
    const payload = { firstName: "A", lastName: "B", identifier: "a@b.co", password: "longenough" }

    await register(payload)

    expect(http.post).toHaveBeenCalledWith("/auth/register", payload)
    expect(localStorage.getItem("token")).toBe("jwt")
  })

  it.each([
    ["forgotPassword", () => forgotPassword("a@b.co"), "/auth/forgot-password"],
    ["resendCode", () => resendCode("a@b.co"), "/auth/verify/resend"],
    [
      "resetPassword",
      () => resetPassword("a@b.co", "123456", "newpassword"),
      "/auth/reset-password",
    ],
  ])("%s posts to its endpoint", async (_name, call, path) => {
    await call()

    expect(http.post).toHaveBeenCalledWith(path, expect.any(Object))
  })

  it("registerProvider sends multipart with every document", async () => {
    const docs = [new File(["a"], "a.pdf"), new File(["b"], "b.pdf")]

    await registerProvider({
      firstName: "A",
      lastName: "B",
      companyName: "Acme",
      identifier: "a@b.co",
      password: "longenough",
      documents: docs,
    })

    const [path, body] = http.post.mock.calls[0] as [string, FormData]
    expect(path).toBe("/auth/register/provider")
    expect(body.get("companyName")).toBe("Acme")
    expect(body.getAll("documents")).toHaveLength(2)
  })
})

describe("user services", () => {
  it("changePassword patches the current user", async () => {
    http.patch.mockResolvedValue({})

    await changePassword("old", "new")

    expect(http.patch).toHaveBeenCalledWith("/users/me/password", {
      currentPassword: "old",
      newPassword: "new",
    })
  })

  it("getMe returns the response body", async () => {
    http.get.mockResolvedValue({ data: { role: "ADMIN" } })

    expect(await getMe()).toEqual({ role: "ADMIN" })
    expect(http.get).toHaveBeenCalledWith("/users/me")
  })
})
