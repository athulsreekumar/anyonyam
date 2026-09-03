import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import History from "./history";

test("renders the organization's story", () => {
  render(<History />, { wrapper: MemoryRouter });
  expect(screen.getByText("Our Story")).toBeInTheDocument();
  expect(screen.getByText(/formed in 1998/i)).toBeInTheDocument();
});
