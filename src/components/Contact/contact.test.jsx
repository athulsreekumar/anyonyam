import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "./contact";

test("renders contact details", () => {
  render(<Contact />);
  expect(screen.getByText(/anyonyam2005@gmail.com/i)).toBeInTheDocument();
});
