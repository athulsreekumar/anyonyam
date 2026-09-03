import React from "react";
import { render, screen } from "@testing-library/react";
import Event from "./event";

test("renders vision and mission content", () => {
  render(<Event />);
  expect(screen.getByText("Vision")).toBeInTheDocument();
  expect(screen.getByText("Mission")).toBeInTheDocument();
});
