"use client";

import { useEffect } from "react";

/**
 * Get the first error field key from react-hook-form errors.
 */
function getFirstErrorKey(errors: Record<string, unknown>): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? keys[0] : null;
}

/**
 * Find a focusable element for the given field name.
 * Tries: id, name, data-field, and common wrapper patterns.
 * Prefers visible elements (offsetParent check).
 */
function findFieldElement(fieldName: string): HTMLElement | null {
  const candidates: HTMLElement[] = [];

  const idEl = document.getElementById(fieldName);
  if (idEl) candidates.push(idEl);

  const nameEls = document.querySelectorAll<HTMLElement>(`[name="${fieldName}"]`);
  nameEls.forEach((el) => candidates.push(el));

  const dataEl = document.querySelector<HTMLElement>(`[data-field="${fieldName}"]`);
  if (dataEl) candidates.push(dataEl);

  const dataNameEl = document.querySelector<HTMLElement>(`[data-error-field="${fieldName}"]`);
  if (dataNameEl) candidates.push(dataNameEl);

  const visible = candidates.find((el) => el.offsetParent !== null || el.getBoundingClientRect().width > 0);
  return visible ?? candidates[0] ?? null;
}

export interface UseScrollToFirstErrorOptions {
  /** Callback when first error is found - e.g. to switch tab before scrolling */
  onFirstError?: (fieldName: string) => void;
  /** Map field names to element IDs when they differ */
  fieldIdMap?: Record<string, string>;
}

/**
 * Scroll to and focus the first field with a validation error.
 * Use with react-hook-form's formState.errors.
 */
export function useScrollToFirstError(
  errors: Record<string, unknown>,
  options?: UseScrollToFirstErrorOptions
): void {
  const { onFirstError, fieldIdMap } = options ?? {};

  useEffect(() => {
    const firstKey = getFirstErrorKey(errors);
    if (!firstKey) return;

    onFirstError?.(firstKey);

    const scrollAndFocus = () => {
      const mappedId = fieldIdMap?.[firstKey];
      const el =
        (mappedId ? document.getElementById(mappedId) : null) ??
        findFieldElement(firstKey);

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable =
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
            ? el
            : el.querySelector<HTMLElement>(
                "input, select, textarea, [tabindex]:not([tabindex='-1'])"
              );
        focusable?.focus();
      }
    };

    if (onFirstError) {
      setTimeout(scrollAndFocus, 320);
    } else {
      requestAnimationFrame(scrollAndFocus);
    }
  }, [errors, onFirstError, fieldIdMap]);
}
