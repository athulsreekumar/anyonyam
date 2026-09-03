import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireAdmin from "./RequireAdmin";
import { AuthProvider } from "./AuthContext";
import { writeAuth } from "./authStorage";

function renderWithRoute(Guard, path = "/protected") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/Login" element={<div>login page</div>} />
          <Route path="/Profile/:memberNo" element={<div>own profile</div>} />
          <Route path={path} element={<Guard><div>secret content</div></Guard>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("RequireAuth", () => {
  beforeEach(() => localStorage.clear());

  it("redirects to /Login when logged out", () => {
    renderWithRoute(RequireAuth);
    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    writeAuth({ token: "t", role: "user", memberNo: 1, name: "X" });
    renderWithRoute(RequireAuth);
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});

describe("RequireAdmin", () => {
  beforeEach(() => localStorage.clear());

  it("redirects to /Login when logged out", () => {
    renderWithRoute(RequireAdmin);
    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("redirects a non-admin to their own profile", () => {
    writeAuth({ token: "t", role: "user", memberNo: 7, name: "X" });
    renderWithRoute(RequireAdmin);
    expect(screen.getByText("own profile")).toBeInTheDocument();
  });

  it("renders children for an admin", () => {
    writeAuth({ token: "t", role: "admin", memberNo: 7, name: "X" });
    renderWithRoute(RequireAdmin);
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});
