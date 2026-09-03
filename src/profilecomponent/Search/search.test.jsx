import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Search from "./search";
import { ToastProvider } from "../../components/Toast/ToastContext";
import { api } from "../../api/client";

jest.mock("../../api/client", () => ({
  api: { get: jest.fn() },
}));

function renderSearch() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Search />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe("Search", () => {
  beforeEach(() => api.get.mockReset());

  it("does not search on an empty query", async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole("button", { name: /go/i }));

    expect(api.get).not.toHaveBeenCalled();
  });

  it("renders results returned from the search endpoint", async () => {
    api.get.mockResolvedValueOnce({
      data: [{ UNIQUEID: "A1", MemberNo: 1, Name: "Test User", Illam: "Testam" }],
    });
    const user = userEvent.setup();
    renderSearch();

    await user.type(screen.getByPlaceholderText(/search by name/i), "Test");
    await user.click(screen.getByRole("button", { name: /go/i }));

    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/search", { params: { name: "Test" } });
  });

  it("shows a no-results message on a 404", async () => {
    api.get.mockRejectedValueOnce({ response: { status: 404 } });
    const user = userEvent.setup();
    renderSearch();

    await user.type(screen.getByPlaceholderText(/search by name/i), "Nobody");
    await user.click(screen.getByRole("button", { name: /go/i }));

    expect(await screen.findByText(/no members found/i)).toBeInTheDocument();
  });
});
