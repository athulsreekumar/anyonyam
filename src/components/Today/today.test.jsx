import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Today from "./today";

test("renders without crashing", () => {
  render(<Today />, { wrapper: MemoryRouter });
  expect(screen.getAllByText("Our Story").length).toBeGreaterThan(0);
});
