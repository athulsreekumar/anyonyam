import { api } from "./client";
import { writeAuth, clearAuth } from "../auth/authStorage";

// Exercise the real interceptors (unmocked) by swapping in a stub adapter
// that just captures the outgoing config instead of hitting the network.
function captureRequestConfig(response = { status: 200, data: {} }) {
  let captured;
  api.defaults.adapter = (config) => {
    captured = config;
    return Promise.resolve({ ...response, config, headers: {} });
  };
  return () => captured;
}

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches the stored Bearer token to outgoing requests", async () => {
    writeAuth({ token: "my-jwt", role: "user", memberNo: 1, name: "X" });
    const getConfig = captureRequestConfig();

    await api.get("/profile");

    expect(getConfig().headers.Authorization).toBe("Bearer my-jwt");
  });

  it("sends no Authorization header when logged out", async () => {
    clearAuth();
    const getConfig = captureRequestConfig();

    await api.get("/profile");

    expect(getConfig().headers.Authorization).toBeUndefined();
  });

  it("clears auth and redirects to /Login on a 401 response", async () => {
    writeAuth({ token: "stale", role: "user", memberNo: 1, name: "X" });
    const originalLocation = window.location;
    const assign = jest.fn();
    delete window.location;
    window.location = { ...originalLocation, assign };

    api.defaults.adapter = () =>
      Promise.reject({ response: { status: 401, data: {} }, config: {} });

    await expect(api.get("/profile")).rejects.toBeTruthy();

    expect(assign).toHaveBeenCalledWith("/Login");
    expect(localStorage.getItem("anyonyam.auth")).toBeNull();

    window.location = originalLocation;
  });
});
