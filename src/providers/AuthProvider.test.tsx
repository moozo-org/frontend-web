import { useEffect } from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import { AxiosError } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuth } from "../hooks/useAuth"
import loginRequest from "../services/auth/login"
import verifyRequest from "../services/auth/verify"
import getMe from "../services/users/me"
import { AUTH_EXPIRED } from "../utils"
import { AuthProvider } from "./AuthProvider"

vi.mock("../services/auth/login")
vi.mock("../services/auth/verify")
vi.mock("../services/users/me")

let current: ReturnType<typeof useAuth>

const Probe = () => {
  const auth = useAuth()
  useEffect(() => {
    current = auth
  })
  return (
    <p>
      {auth.status} {auth.role ?? "none"}
    </p>
  )
}

const mount = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  )

const httpError = (status: number) =>
  new AxiosError("fail", "ERR", undefined, undefined, { status } as AxiosError["response"])

beforeEach(() => vi.resetAllMocks())

describe("AuthProvider session restore", () => {
  it("is anonymous without a token and never calls the API", () => {
    mount()

    expect(screen.getByText("anonymous none")).toBeTruthy()
    expect(getMe).not.toHaveBeenCalled()
  })

  it("restores the role from /users/me", async () => {
    localStorage.setItem("token", "jwt")
    vi.mocked(getMe).mockResolvedValue({ role: "PROVIDER" })

    mount()

    expect(screen.getByText("loading none")).toBeTruthy()
    await waitFor(() => expect(screen.getByText("authenticated PROVIDER")).toBeTruthy())
  })

  it.each([401, 403])("drops the token on %i", async (status) => {
    localStorage.setItem("token", "jwt")
    vi.mocked(getMe).mockRejectedValue(httpError(status))

    mount()

    await waitFor(() => expect(screen.getByText("anonymous none")).toBeTruthy())
    expect(localStorage.getItem("token")).toBeNull()
  })

  it("reports an error and keeps the token on other failures", async () => {
    localStorage.setItem("token", "jwt")
    vi.mocked(getMe).mockRejectedValue(httpError(500))

    mount()

    await waitFor(() => expect(screen.getByText("error none")).toBeTruthy())
    expect(localStorage.getItem("token")).toBe("jwt")
  })

  it("ignores a late answer after unmount", async () => {
    localStorage.setItem("token", "jwt")
    let resolve!: (me: { role: "ADMIN" }) => void
    vi.mocked(getMe).mockReturnValue(new Promise((r) => (resolve = r)))

    const { unmount } = mount()
    unmount()

    await act(async () => resolve({ role: "ADMIN" }))
  })
})

describe("AuthProvider actions", () => {
  it("login and verify authenticate and return the role", async () => {
    vi.mocked(loginRequest).mockResolvedValue({ token: "t", role: "ORGANIZER" })
    vi.mocked(verifyRequest).mockResolvedValue({ token: "t", role: "ADMIN" })
    mount()

    await act(async () => {
      expect(await current.login("a@b.co", "pw")).toBe("ORGANIZER")
    })
    expect(screen.getByText("authenticated ORGANIZER")).toBeTruthy()

    await act(async () => {
      expect(await current.verify("a@b.co", "123456")).toBe("ADMIN")
    })
    expect(screen.getByText("authenticated ADMIN")).toBeTruthy()
  })

  it("logout clears the session", async () => {
    localStorage.setItem("token", "jwt")
    vi.mocked(getMe).mockResolvedValue({ role: "ORGANIZER" })
    mount()
    await waitFor(() => expect(screen.getByText("authenticated ORGANIZER")).toBeTruthy())

    act(() => current.logout())

    expect(screen.getByText("anonymous none")).toBeTruthy()
    expect(localStorage.getItem("token")).toBeNull()
  })

  it("resets when the API reports an expired token", async () => {
    localStorage.setItem("token", "jwt")
    vi.mocked(getMe).mockResolvedValue({ role: "ORGANIZER" })
    mount()
    await waitFor(() => expect(screen.getByText("authenticated ORGANIZER")).toBeTruthy())

    act(() => {
      window.dispatchEvent(new Event(AUTH_EXPIRED))
    })

    expect(screen.getByText("anonymous none")).toBeTruthy()
  })
})

describe("useAuth", () => {
  it("throws outside a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<Probe />)).toThrow("useAuth must be used within an AuthProvider")
  })
})
