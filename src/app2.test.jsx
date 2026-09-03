import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./app2";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./components/Toast/ToastContext";

jest.mock("./api/client", () => ({
  api: { get: jest.fn().mockResolvedValue({ data: {} }) },
}));

function renderApp(initialEntry) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

test("shows the public home page and public nav when logged out", () => {
  renderApp("/");
  expect(screen.getByText("Home")).toBeInTheDocument(); // public Topbar link
  expect(screen.getByText("Login")).toBeInTheDocument();
});

test("redirects an unauthenticated visitor away from a protected route to /Login", () => {
  renderApp("/Admin");
  expect(screen.getByText("Hello!")).toBeInTheDocument(); // Login page heading
});
