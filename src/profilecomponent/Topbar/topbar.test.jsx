import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopbarProf from "./topbar";
import { AuthProvider } from "../../auth/AuthContext";
import { writeAuth } from "../../auth/authStorage";

function renderTopbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TopbarProf menuOpen={false} setMenuOpen={jest.fn()} />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("TopbarProf", () => {
  beforeEach(() => localStorage.clear());

  it("shows the Admin link for an admin", () => {
    writeAuth({ token: "t", role: "admin", memberNo: 1, name: "Admin User" });
    renderTopbar();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText(/Hi, Admin User/)).toBeInTheDocument();
  });

  it("hides the Admin and Search links for a regular member", () => {
    writeAuth({ token: "t", role: "user", memberNo: 1, name: "Regular User" });
    renderTopbar();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });
});
