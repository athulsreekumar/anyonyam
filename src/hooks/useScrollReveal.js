import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to an element and a boolean that flips to true
 * the first time that element scrolls into view. Pair with the .reveal /
 * .reveal-visible classes in styles/tokens.scss (or a local override) for
 * a fade+rise-in effect. Falls back to "always visible" when
 * IntersectionObserver isn't available (older browsers, some test
 * environments) so content is never hidden.
 */
export function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !ref.current) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
