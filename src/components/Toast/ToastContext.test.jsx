import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./ToastContext";

function Trigger() {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={() => showToast("Saved!", "success")}>trigger success</button>
      <button onClick={() => showToast("Something broke", "error")}>trigger error</button>
    </>
  );
}

test("shows a toast with the given message when showToast is called", async () => {
  const user = userEvent.setup();
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  );

  expect(screen.queryByText("Saved!")).not.toBeInTheDocument();

  await user.click(screen.getByText("trigger success"));

  await waitFor(() => expect(screen.getByText("Saved!")).toBeInTheDocument());
});

test("useToast throws outside of a ToastProvider", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  const Bare = () => {
    useToast();
    return null;
  };
  expect(() => render(<Bare />)).toThrow(/useToast must be used within a ToastProvider/);
  spy.mockRestore();
});
