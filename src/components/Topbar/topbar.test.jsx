import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Topbar from "./topbar";

test("renders the public nav links", () => {
  render(<Topbar menuOpen={false} setMenuOpen={jest.fn()} />, { wrapper: MemoryRouter });
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
});

test("toggles the mobile menu open state on click", async () => {
  const setMenuOpen = jest.fn();
  const user = userEvent.setup();
  const { container } = render(<Topbar menuOpen={false} setMenuOpen={setMenuOpen} />, {
    wrapper: MemoryRouter,
  });

  await user.click(container.querySelector(".menu"));
  expect(setMenuOpen).toHaveBeenCalledWith(true);
});
