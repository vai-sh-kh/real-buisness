"use client";

import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Single image URL or array for gallery with navigation */
  images: string | string[];
  /** Current index when images is array (0-based) */
  currentIndex?: number;
  /** Called when user navigates (only when images is array) */
  onIndexChange?: (index: number) => void;
  /** Optional label e.g. "Cover" or "1 / 5" */
  label?: string;
}

export function ImagePreviewModal({
  open,
  onOpenChange,
  images,
  currentIndex = 0,
  onIndexChange,
  label,
}: ImagePreviewModalProps) {
  const urls = Array.isArray(images) ? images : [images];
  const hasMultiple = urls.length > 1;
  const currentUrl = urls[Math.min(currentIndex, urls.length - 1)] ?? null;

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    const next = currentIndex <= 0 ? urls.length - 1 : currentIndex - 1;
    onIndexChange?.(next);
  }, [hasMultiple, currentIndex, urls.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    const next = currentIndex >= urls.length - 1 ? 0 : currentIndex + 1;
    onIndexChange?.(next);
  }, [hasMultiple, currentIndex, urls.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange, goPrev, goNext]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/90" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-[1200px] h-[95vh] max-h-[900px] translate-x-[-50%] translate-y-[-50%] p-0 border-0 bg-transparent overflow-hidden focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onPointerDownOutside={() => onOpenChange(false)}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <DialogTitle className="sr-only">
            Image preview {label ? `- ${label}` : ""}
          </DialogTitle>
          <div className="relative flex items-center justify-center min-w-[280px] min-h-[200px] w-[85vw] h-[85vh] max-w-[1200px] max-h-[900px]">
            {currentUrl && (
              <img
                src={currentUrl}
                alt={label ?? "Preview"}
                className="max-w-full max-h-full object-contain rounded-lg"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev / Next for gallery */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm font-medium">
                  {currentIndex + 1} / {urls.length}
                </div>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
