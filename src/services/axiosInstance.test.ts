import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { afterEach, describe, expect, it, vi } from "vitest"
import { AUTH_EXPIRED } from "../utils"
import axiosInstance from "./axiosInstance"

const respond = (status: number) => (config: InternalAxiosRequestConfig) =>
  status < 400
    ? Promise.resolve({ data: {}, status, statusText: "", headers: {}, config })
    : Promise.reject(
        new AxiosError("fail", "ERR", config, undefined, {
          status,
        } as AxiosError["response"])
      )

afterEach(() => vi.restoreAllMocks())

describe("axiosInstance", () => {
  it("sends the stored token as a bearer header", async () => {
    localStorage.setItem("token", "jwt")
    let seen: unknown

    await axiosInstance.get("/x", {
      adapter: (config) => {
        seen = config.headers.Authorization
        return respond(200)(config)
      },
    })

    expect(seen).toBe("Bearer jwt")
  })

  it("sends no Authorization header without a token", async () => {
    let seen: unknown = "unset"

    await axiosInstance.get("/x", {
      adapter: (config) => {
        seen = config.headers.Authorization
        return respond(200)(config)
      },
    })

    expect(seen).toBeUndefined()
  })

  it("drops the token and broadcasts AUTH_EXPIRED on a 401", async () => {
    localStorage.setItem("token", "jwt")
    const onExpired = vi.fn()
    window.addEventListener(AUTH_EXPIRED, onExpired)

    await expect(axiosInstance.get("/x", { adapter: respond(401) })).rejects.toBeInstanceOf(
      AxiosError
    )

    window.removeEventListener(AUTH_EXPIRED, onExpired)
    expect(localStorage.getItem("token")).toBeNull()
    expect(onExpired).toHaveBeenCalledOnce()
  })

  it("keeps the session on other errors and on 401 without a token", async () => {
    const onExpired = vi.fn()
    window.addEventListener(AUTH_EXPIRED, onExpired)
    localStorage.setItem("token", "jwt")

    await expect(axiosInstance.get("/x", { adapter: respond(500) })).rejects.toBeInstanceOf(
      AxiosError
    )
    expect(localStorage.getItem("token")).toBe("jwt")

    localStorage.clear()
    await expect(axiosInstance.get("/x", { adapter: respond(401) })).rejects.toBeInstanceOf(
      AxiosError
    )

    window.removeEventListener(AUTH_EXPIRED, onExpired)
    expect(onExpired).not.toHaveBeenCalled()
  })
})
