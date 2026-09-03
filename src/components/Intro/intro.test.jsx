import React from "react";
import { render } from "@testing-library/react";
import Intro from "./intro";

test("renders without crashing", () => {
  const { container } = render(<Intro />);
  expect(container.querySelector(".intro")).toBeInTheDocument();
});
