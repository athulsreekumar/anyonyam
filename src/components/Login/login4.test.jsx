import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./login4";
import { AuthProvider } from "../../auth/AuthContext";
import { ToastProvider } from "../../components/Toast/ToastContext";
import { api } from "../../api/client";
import { readAuth } from "../../auth/authStorage";

jest.mock("../../api/client", () => ({
  api: { post: jest.fn() },
}));

function renderLogin(onLoggedIn = jest.fn()) {
  return render(
    <AuthProvider>
      <ToastProvider>
        <Login onLoggedIn={onLoggedIn} />
      </ToastProvider>
    </AuthProvider>
  );
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
    api.post.mockReset();
  });

  it("shows a validation error for a phone number that isn't 10 digits", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/phone number/i), "123");
    await user.click(screen.getByRole("button", { name: /get otp/i }));

    expect(await screen.findByText(/valid 10-digit phone number/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("requests an OTP and advances to the code screen on a valid phone number", async () => {
    api.post.mockResolvedValueOnce({ data: { message: "OTP sent" } });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/phone number/i), "9876543210");
    await user.click(screen.getByRole("button", { name: /get otp/i }));

    expect(await screen.findByRole("button", { name: /submit otp/i })).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledWith("/login", { phone: "9876543210" });
  });

  it("shows a friendly message when the phone number isn't found (404)", async () => {
    api.post.mockRejectedValueOnce({ response: { status: 404 } });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText(/phone number/i), "9876543210");
    await user.click(screen.getByRole("button", { name: /get otp/i }));

    expect(await screen.findByText(/does not exist/i)).toBeInTheDocument();
  });

  it("logs in and persists auth state after a correct OTP", async () => {
    api.post.mockResolvedValueOnce({ data: {} }); // /login
    api.post.mockResolvedValueOnce({
      data: { token: "jwt-token", role: "user", memberNo: 42, name: "Test User" },
    }); // /auth
    const onLoggedIn = jest.fn();
    const user = userEvent.setup();
    renderLogin(onLoggedIn);

    await user.type(screen.getByPlaceholderText(/phone number/i), "9876543210");
    await user.click(screen.getByRole("button", { name: /get otp/i }));
    await screen.findByRole("button", { name: /submit otp/i });

    const otpInputs = screen.getAllByRole("textbox").filter((el) => el.maxLength === 1);
    for (let i = 0; i < 6; i += 1) {
      await user.type(otpInputs[i], String(i + 1));
    }
    await user.click(screen.getByRole("button", { name: /submit otp/i }));

    await waitFor(() => expect(onLoggedIn).toHaveBeenCalledWith(42));
    expect(readAuth()).toMatchObject({ token: "jwt-token", role: "user", memberNo: 42 });
  });
});
