import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./footer";

test("renders the copyright line", () => {
  render(<Footer />);
  expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
});
