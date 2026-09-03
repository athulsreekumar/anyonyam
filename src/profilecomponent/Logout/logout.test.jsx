import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Logout from "./logout";
import { AuthProvider } from "../../auth/AuthContext";
import { writeAuth, readAuth } from "../../auth/authStorage";

test("logging out clears auth and redirects home", () => {
  writeAuth({ token: "t", role: "user", memberNo: 1, name: "X" });

  render(
    <MemoryRouter initialEntries={["/Logout"]}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<div>home page</div>} />
          <Route path="/Logout" element={<Logout />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText("home page")).toBeInTheDocument();
  expect(readAuth().token).toBeNull();
});
