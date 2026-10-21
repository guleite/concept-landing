import { useMediaQuery } from "@/hooks/use-media-query"

/** true quando o sistema pede menos movimento. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
