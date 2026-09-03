import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "./gallery";

const MANIFEST = {
  Varshikam: ["/assets/Gallery/Varshikam/1.jpg"],
  PathanaShipiram: ["/assets/Gallery/PathanaShipiram/1.jpg"],
  Football: ["/assets/Gallery/Football/1.jpg", "/assets/Gallery/Football/2.jpg"],
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => MANIFEST,
  });
});

afterEach(() => {
  delete global.fetch;
});

test("renders the gallery heading and category tabs, loading the default category", async () => {
  render(<Gallery />);

  expect(screen.getByText("Gallery")).toBeInTheDocument();
  expect(screen.getByText("Varshikam")).toBeInTheDocument();
  expect(screen.getByText("Football Mela")).toBeInTheDocument();

  await waitFor(() => expect(screen.getAllByRole("img")).toHaveLength(1));
});

test("switches categories on click", async () => {
  const user = userEvent.setup();
  render(<Gallery />);
  await waitFor(() => expect(screen.getAllByRole("img")).toHaveLength(1));

  await user.click(screen.getByText("Football Mela"));

  await waitFor(() => expect(screen.getAllByRole("img")).toHaveLength(2));
});

test("shows an error message if the manifest can't be loaded", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
  render(<Gallery />);

  expect(await screen.findByText(/couldn't load photos/i)).toBeInTheDocument();
});
