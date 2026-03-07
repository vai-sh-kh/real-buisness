"use client";

import { useCallback, useState, useMemo, useEffect, useId } from "react";
import axios from "axios";
import { ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ImagePreviewModal } from "./ImagePreviewModal";
import {
  PROPERTY_IMAGE_ACCEPT,
  PROPERTY_IMAGE_EXTENSIONS,
} from "@/lib/constants/upload";
import {
  validateCoverFile,
  getZodErrorMessage,
} from "@/lib/validations/upload.schema";

const ACCEPT_STR = Object.keys(PROPERTY_IMAGE_ACCEPT).join(",");
const MAX_MB = 5;

interface CoverImageDropzoneProps {
  value: string | null;
  onValueChange: (url: string | null) => void;
  onFileSelect?: (file: File | null) => void;
  propertyId: string | null;
  /** Preview when file is selected but not yet uploaded (e.g. creating new property) */
  pendingFile?: File | null;
  disabled?: boolean;
  /** Called when Zod validation fails so the form can set field error */
  onValidationError?: (message: string) => void;
  /** Called when error is cleared (e.g. after successful upload or remove) */
  onErrorClear?: () => void;
}

export function CoverImageDropzone({
  value,
  onValueChange,
  onFileSelect,
  propertyId,
  pendingFile,
  disabled,
  onValidationError,
  onErrorClear,
}: CoverImageDropzoneProps) {
  const inputId = useId();
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearError = useCallback(() => {
    setError(null);
    onErrorClear?.();
  }, [onErrorClear]);

  const uploadFile = useCallback(
    async (file: File) => {
      const zodErr = validateCoverFile(file);
      if (zodErr) {
        const msg = getZodErrorMessage(zodErr);
        setError(msg);
        toast.error(msg);
        onValidationError?.(msg);
        return;
      }
      if (!propertyId) {
        onFileSelect?.(file);
        clearError();
        return;
      }
      clearError();
      setUploading(true);
      setUploadProgress(0);
      try {
        const fd = new FormData();
        fd.set("propertyId", propertyId);
        fd.set("type", "cover");
        fd.set("file", file);
        const res = await axios.post<{ url?: string; error?: string }>(
          "/api/admin/properties/upload",
          fd,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (ev) => {
              if (ev.total != null && ev.total > 0) {
                const pct = Math.round((ev.loaded / ev.total) * 100);
                setUploadProgress(pct);
              }
            },
          },
        );
        const json = res.data;
        if (res.status !== 200) {
          const msg =
            typeof json.error === "string"
              ? json.error
              : "Cover image upload failed";
          setError(msg);
          toast.error(msg);
          onValidationError?.(msg);
          return;
        }
        if (typeof json.url !== "string") {
          const msg = "Invalid response from server";
          setError(msg);
          toast.error(msg);
          onValidationError?.(msg);
          return;
        }
        setUploadProgress(100);
        onValueChange(json.url);
        onFileSelect?.(null);
        onErrorClear?.();
      } catch (e) {
        const msg =
          axios.isAxiosError(e) && e.response?.data?.error
            ? String(e.response.data.error)
            : e instanceof Error
              ? e.message
              : "Upload failed";
        setError(msg);
        toast.error(msg);
        onValidationError?.(msg);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [
      propertyId,
      onValueChange,
      onFileSelect,
      onValidationError,
      onErrorClear,
      clearError,
    ],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled || uploading) return;
      const file = e.dataTransfer.files[0];
      if (!file) return;
      uploadFile(file);
    },
    [disabled, uploading, uploadFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || disabled || uploading) return;
      uploadFile(file);
    },
    [disabled, uploading, uploadFile],
  );

  const handleRemove = useCallback(() => {
    if (disabled) return;
    onValueChange(null);
    onFileSelect?.(null);
    clearError();
  }, [disabled, onValueChange, onFileSelect, clearError]);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-colors min-h-[200px]",
          drag
            ? "border-indigo-500 bg-indigo-50/50"
            : "border-gray-200 bg-gray-50/50",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={ACCEPT_STR}
          onChange={handleChange}
          className="sr-only"
          disabled={disabled || uploading}
          aria-label="Cover image file input"
        />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 py-12 px-6 min-h-[200px]">
          {uploading ? (
            <div className="flex w-full max-w-xs flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium text-gray-600">
                Uploading… {uploadProgress}%
              </span>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          ) : value || pendingFile ? (
            <div className="relative w-full max-w-[280px] aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPreviewOpen(true);
                }}
                className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus:outline-none"
                aria-label="Preview cover image"
              >
                <img
                  src={value || previewUrl || ""}
                  alt="Cover preview"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md"
                  aria-label="Remove cover image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ImagePreviewModal
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                images={value || previewUrl || ""}
                label="Cover image"
              />
            </div>
          ) : (
            <label
              htmlFor={inputId}
              className={cn(
                "flex flex-col items-center justify-center gap-2 cursor-pointer focus-within:outline-none",
                (disabled || uploading) &&
                  "pointer-events-none cursor-not-allowed",
              )}
            >
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Drop cover image or click to browse
              </p>
              <p className="text-xs text-gray-400">
                {PROPERTY_IMAGE_EXTENSIONS.join(", ")} · Max {MAX_MB}MB
              </p>
            </label>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
