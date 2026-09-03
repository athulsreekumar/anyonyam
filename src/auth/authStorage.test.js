import { readAuth, writeAuth, clearAuth } from "./authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty auth object when nothing is stored", () => {
    expect(readAuth()).toEqual({ token: null, role: null, memberNo: null, name: null });
  });

  it("round-trips a written auth object", () => {
    const auth = { token: "abc", role: "admin", memberNo: 103, name: "Test User" };
    writeAuth(auth);
    expect(readAuth()).toEqual(auth);
  });

  it("returns an empty object if the stored value is corrupted JSON", () => {
    localStorage.setItem("anyonyam.auth", "{not json");
    expect(readAuth()).toEqual({ token: null, role: null, memberNo: null, name: null });
  });

  it("clearAuth removes the stored auth and legacy keys", () => {
    writeAuth({ token: "abc", role: "user", memberNo: 1, name: "X" });
    localStorage.setItem("user-auth-token", "legacy");
    localStorage.setItem("isAdmin", "true");

    clearAuth();

    expect(readAuth().token).toBeNull();
    expect(localStorage.getItem("user-auth-token")).toBeNull();
    expect(localStorage.getItem("isAdmin")).toBeNull();
  });
});
