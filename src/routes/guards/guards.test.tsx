import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuth } from "../../hooks/useAuth"
import RequireAnonymous from "./RequireAnonymous"
import RequireEventGuest from "./RequireEventGuest"
import RequireRole from "./RequireRole"

vi.mock("../../hooks/useAuth")
vi.mock("../../pages", () => ({ ErrorPage: () => <p>error page</p> }))
vi.mock("../../molecules", () => ({ PageLoader: () => <p>loading</p> }))

const auth = (status: string, role: string | null = null) =>
  vi.mocked(useAuth).mockReturnValue({ status, role } as ReturnType<typeof useAuth>)

const Where = () => {
  const { pathname, state } = useLocation()
  return (
    <p>
      at {pathname} from {state?.from ?? "none"}
    </p>
  )
}

// `/login` is guarded only when asked, otherwise a redirect to it would loop through the guard
const renderAt = (path: string, guard: React.ReactElement, state?: unknown, guardLogin = false) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: path, state }]}>
      <Routes>
        <Route element={guard}>
          <Route path="/secret/*" element={<p>secret</p>} />
          {guardLogin && <Route path="/login" element={<p>login form</p>} />}
          <Route path="/event/:eventId/photos" element={<p>photos</p>} />
        </Route>
        {!guardLogin && <Route path="/login" element={<Where />} />}
        <Route path="/organizer" element={<Where />} />
        <Route path="/event/:eventId" element={<Where />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => vi.resetAllMocks())

describe("RequireAnonymous", () => {
  it("shows the page to anonymous visitors", () => {
    auth("anonymous")
    renderAt("/login", <RequireAnonymous />, undefined, true)
    expect(screen.getByText("login form")).toBeTruthy()
  })

  it("waits while the session is restored", () => {
    auth("loading")
    renderAt("/login", <RequireAnonymous />, undefined, true)
    expect(screen.getByText("loading")).toBeTruthy()
  })

  it("sends a signed-in user home", () => {
    auth("authenticated", "ORGANIZER")
    renderAt("/login", <RequireAnonymous />, undefined, true)
    expect(screen.getByText(/at \/organizer/)).toBeTruthy()
  })

  it("sends a signed-in user back to the page they came for", () => {
    auth("authenticated", "ORGANIZER")
    renderAt("/login", <RequireAnonymous />, { from: "/somewhere" }, true)
    expect(screen.getByText(/at \/somewhere/)).toBeTruthy()
  })
})

describe("RequireRole", () => {
  it("waits while the session is restored", () => {
    auth("loading")
    renderAt("/secret", <RequireRole />)
    expect(screen.getByText("loading")).toBeTruthy()
  })

  it("shows the error page when the session check failed", () => {
    auth("error")
    renderAt("/secret", <RequireRole />)
    expect(screen.getByText("error page")).toBeTruthy()
  })

  it("redirects anonymous visitors to login and remembers the page", () => {
    auth("anonymous")
    renderAt("/secret/a?b=1#c", <RequireRole />)
    expect(screen.getByText("at /login from /secret/a?b=1#c")).toBeTruthy()
  })

  it("lets any signed-in user in when no role is required", () => {
    auth("authenticated", "PROVIDER")
    renderAt("/secret", <RequireRole />)
    expect(screen.getByText("secret")).toBeTruthy()
  })

  it("lets the matching role in", () => {
    auth("authenticated", "ADMIN")
    renderAt("/secret", <RequireRole role="ADMIN" />)
    expect(screen.getByText("secret")).toBeTruthy()
  })

  it("sends another role to its own home", () => {
    auth("authenticated", "ORGANIZER")
    renderAt("/secret", <RequireRole role="ADMIN" />)
    expect(screen.getByText(/at \/organizer/)).toBeTruthy()
  })
})

describe("RequireEventGuest", () => {
  it("lets a guest with a token for this event in", () => {
    localStorage.setItem("guest-token:42", "tok")
    renderAt("/event/42/photos", <RequireEventGuest />)
    expect(screen.getByText("photos")).toBeTruthy()
  })

  it("sends everyone else to the event page", () => {
    localStorage.setItem("guest-token:other", "tok")
    renderAt("/event/42/photos", <RequireEventGuest />)
    expect(screen.getByText(/at \/event\/42 /)).toBeTruthy()
  })
})
