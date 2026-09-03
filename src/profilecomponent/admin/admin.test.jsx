import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Admin from "./admin";
import { AuthProvider } from "../../auth/AuthContext";
import { ToastProvider } from "../../components/Toast/ToastContext";
import { api } from "../../api/client";

jest.mock("../../api/client", () => ({
  api: { get: jest.fn(), put: jest.fn(), post: jest.fn() },
}));

// @mui/x-charts animates via @react-spring, which needs browser APIs jsdom
// doesn't implement (ResizeObserver, real layout). Stub the chart itself -
// this test suite verifies *our* data/wiring, not MUI's chart internals.
jest.mock("@mui/x-charts/PieChart", () => ({
  PieChart: ({ series }) => (
    <div data-testid="pie-chart">{JSON.stringify(series[0].data)}</div>
  ),
}));

const SUMMARY = {
  paidSubscriptions: [
    { UNIQUEID: "A1", MemberNo: 1, Name: "Alice", Mobile: "9876543210", Subscription: 500 },
  ],
  totalMembers: [{ MemberNo: 1 }, { MemberNo: 2 }],
  totalPending: 500,
};

function renderAdmin() {
  return render(
    <AuthProvider>
      <ToastProvider>
        <Admin />
      </ToastProvider>
    </AuthProvider>
  );
}

describe("Admin", () => {
  beforeEach(() => {
    api.get.mockReset();
    api.put.mockReset();
    api.post.mockReset();
  });

  it("loads and displays the subscription summary", async () => {
    api.get.mockResolvedValueOnce({ data: SUMMARY });
    renderAdmin();

    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // total members
  });

  it("records a payment through the query-param PUT contract the backend expects", async () => {
    api.get.mockResolvedValueOnce({ data: SUMMARY });
    api.put.mockResolvedValueOnce({ data: { message: "ok" } });
    api.get.mockResolvedValueOnce({ data: { ...SUMMARY, paidSubscriptions: [] } });
    const user = userEvent.setup();
    renderAdmin();

    await user.click(await screen.findByText("Alice"));
    await user.type(screen.getByLabelText("Amount"), "500");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/recordPayment", null, {
        params: { amount: "500", UNIQUEID: "A1" },
      })
    );
  });
});
