"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Session-scoped boolean flag. SSR-safe: always returns `false` on server
 * and first client render, then hydrates from `sessionStorage` on mount.
 * Calling the setter persists `"1"` to the key and flips state to `true`.
 */
export function useSessionFlag(key: string): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(key) === "1") {
        setValue(true);
      }
    } catch {
      // sessionStorage may be unavailable (private mode / disabled) — treat as false.
    }
  }, [key]);

  const set = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        // ignore
      }
    }
    setValue(true);
  }, [key]);

  return [value, set];
}
