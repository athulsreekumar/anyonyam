import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element (fade/slide in) the first time it enters the
 * viewport. Reimplementation of the previous app's hook of the same name,
 * kept as a hook (not just a CSS animation) so it can skip work entirely
 * when the user has `prefers-reduced-motion` set.
 */
export function useScrollReveal<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}
