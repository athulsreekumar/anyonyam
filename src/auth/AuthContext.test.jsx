import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";
import { readAuth } from "./authStorage";

function Probe() {
  const { isAuthenticated, isAdmin, name, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? "in" : "out"}</span>
      <span data-testid="role">{isAdmin ? "admin" : "not-admin"}</span>
      <span data-testid="name">{name || ""}</span>
      <button onClick={() => login({ token: "t", role: "admin", memberNo: 5, name: "Admin User" })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => localStorage.clear());

  it("starts logged out when localStorage is empty", () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByTestId("status")).toHaveTextContent("out");
  });

  it("login() updates context state and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<AuthProvider><Probe /></AuthProvider>);

    await act(async () => {
      await user.click(screen.getByText("login"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("in");
    expect(screen.getByTestId("role")).toHaveTextContent("admin");
    expect(screen.getByTestId("name")).toHaveTextContent("Admin User");
    expect(readAuth().token).toBe("t");
  });

  it("logout() clears context state and localStorage", async () => {
    const user = userEvent.setup();
    render(<AuthProvider><Probe /></AuthProvider>);

    await act(async () => {
      await user.click(screen.getByText("login"));
    });
    await act(async () => {
      await user.click(screen.getByText("logout"));
    });

    expect(screen.getByTestId("status")).toHaveTextContent("out");
    expect(readAuth().token).toBeNull();
  });

  it("useAuth throws outside of an AuthProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useAuth must be used within an AuthProvider/);
    spy.mockRestore();
  });
});
