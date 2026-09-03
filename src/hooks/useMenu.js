import { useState } from "react";

// The mobile nav's open/closed state, shared between the two topbar
// variants and the page shell that renders whichever one is active.
export function useMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  return { menuOpen, setMenuOpen };
}
