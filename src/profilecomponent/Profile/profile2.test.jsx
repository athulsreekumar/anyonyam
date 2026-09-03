import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Profile from "./profile2";
import { AuthProvider } from "../../auth/AuthContext";
import { ToastProvider } from "../../components/Toast/ToastContext";
import { writeAuth } from "../../auth/authStorage";
import { api } from "../../api/client";

jest.mock("../../api/client", () => ({
  api: { get: jest.fn(), put: jest.fn(), delete: jest.fn(), post: jest.fn() },
}));

const MEMBER = {
  UNIQUEID: "ANYONYAM103_1",
  SNO: 55,
  MemberNo: 103,
  Name: "Test Member",
  Illam: "Testam",
  DOB: "1990-01-01",
  Mobile: "9876543210",
  RELATIONSHIP: "MEMBER",
  Area: "Tripunithura",
  IMAGE: null,
};

function renderProfile(memberNo = "103") {
  return render(
    <MemoryRouter initialEntries={[`/Profile/${memberNo}`]}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/Profile/:memberNo" element={<Profile />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Profile", () => {
  beforeEach(() => {
    localStorage.clear();
    api.get.mockReset();
    api.put.mockReset();
    api.delete.mockReset();
  });

  it("shows the family member list from GET /profile", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [MEMBER] } });
    renderProfile();

    expect(await screen.findByText(/Test Member/)).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/profile", { params: { MemberNo: "103" } });
  });

  it("does not show manage controls (Create User) to a member viewing someone else's family", async () => {
    writeAuth({ token: "t", role: "user", memberNo: 999, name: "Someone Else" });
    api.get.mockResolvedValueOnce({ data: { data: [MEMBER] } });
    renderProfile();

    await screen.findByText(/Test Member/);
    expect(screen.queryByText("CREATE USER")).not.toBeInTheDocument();
  });

  it("shows manage controls to the member viewing their own family", async () => {
    writeAuth({ token: "t", role: "user", memberNo: 103, name: "Test Member" });
    api.get.mockResolvedValueOnce({ data: { data: [MEMBER] } });
    renderProfile();

    await screen.findByText(/Test Member/);
    expect(screen.getByText("CREATE USER")).toBeInTheDocument();
  });

  it("saving edits only sends the whitelisted fields, never SNO/IMAGE/UNIQUEID as an edited value", async () => {
    writeAuth({ token: "t", role: "admin", memberNo: 1, name: "Admin" });
    api.get.mockResolvedValueOnce({ data: { data: [MEMBER] } });
    api.put.mockResolvedValueOnce({ data: { message: "Member updated" } });
    api.get.mockResolvedValueOnce({ data: { data: [MEMBER] } });
    const user = userEvent.setup();
    renderProfile();

    await user.click(await screen.findByText("Show More"));
    await user.click(screen.getAllByText("Edit")[0]);
    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => expect(api.put).toHaveBeenCalled());
    const [, payload] = api.put.mock.calls[0];
    expect(payload).not.toHaveProperty("SNO");
    expect(payload).not.toHaveProperty("IMAGE");
    expect(payload.UNIQUEID).toBe("ANYONYAM103_1");
    expect(payload.Name).toBe("Test Member");
  });
});
