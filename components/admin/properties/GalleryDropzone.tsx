"use client";

import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { ImagePlus, Loader2, X, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImagePreviewModal } from "./ImagePreviewModal";
import {
  PROPERTY_IMAGE_ACCEPT,
  GALLERY_IMAGE_MAX_COUNT,
  PROPERTY_IMAGE_EXTENSIONS,
  GALLERY_IMAGE_MAX_SIZE_BYTES,
} from "@/lib/constants/upload";
import {
  validateGalleryFiles,
  getZodErrorMessage,
  getGalleryUploadErrorMessage,
} from "@/lib/validations/upload.schema";

type UploadItemStatus = "uploading" | "done" | "error";

interface GalleryUploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadItemStatus;
  url?: string;
  error?: string;
  previewUrl?: string;
}

const ACCEPT_STR = Object.keys(PROPERTY_IMAGE_ACCEPT).join(",");
const MAX_MB = GALLERY_IMAGE_MAX_SIZE_BYTES / 1024 / 1024;

interface GalleryDropzoneProps {
  value: string[];
  onValueChange: (urls: string[]) => void;
  onFilesSelect?: (files: File[]) => void;
  propertyId: string | null;
  /** Files selected but not yet uploaded (e.g. when creating new property) */
  pendingFiles?: File[];
  disabled?: boolean;
  /** Notify parent when any gallery upload is in progress (for disabling submit) */
  onUploadingChange?: (uploading: boolean) => void;
  /** AbortSignal to cancel in-flight uploads when sheet closes or tab changes */
  uploadAbortSignal?: AbortSignal | null;
}

/**
 * Uploads one gallery image to Supabase Storage via the API.
 * Uses axios for progress tracking. Runs in parallel with other files.
 */
async function uploadGalleryFile(
  propertyId: string,
  file: File,
  options: { signal?: AbortSignal },
): Promise<string> {
  const formData = new FormData();
  formData.set("propertyId", propertyId);
  formData.set("type", "gallery");
  formData.append("files", file);

  const { data } = await axios.post<{ urls?: string[]; error?: string }>(
    "/api/admin/properties/upload",
    formData,
    {
      withCredentials: true,
      signal: options.signal,
    },
  );

  const url = data?.urls?.[0];
  if (typeof url === "string") return url;
  throw new Error(data?.error ?? "Invalid response");
}

export function GalleryDropzone({
  value,
  onValueChange,
  onFilesSelect,
  propertyId,
  pendingFiles = [],
  disabled,
  onUploadingChange,
  uploadAbortSignal,
}: GalleryDropzoneProps) {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeUploads, setActiveUploads] = useState<GalleryUploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const valueRef = useRef<string[]>(value);
  valueRef.current = value;

  const pendingUrls = useMemo(() => {
    return pendingFiles.map((f) => URL.createObjectURL(f));
  }, [pendingFiles]);
  useEffect(() => {
    return () => pendingUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingUrls]);

  const totalCount = value.length + pendingFiles.length + activeUploads.length;
  const hasFailedUploads = activeUploads.some((u) => u.status === "error");

  const runOneUpload = useCallback(
    (item: GalleryUploadItem): Promise<string | null> => {
      if (!propertyId) return Promise.resolve(null);
      return uploadGalleryFile(propertyId, item.file, {
        signal: uploadAbortSignal ?? undefined,
      })
        .then((url) => {
          setActiveUploads((prev) =>
            prev.filter((u) => {
              if (u.id !== item.id) return true;
              if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
              return false;
            }),
          );
          const next = [...valueRef.current, url];
          valueRef.current = next;
          onValueChange(next);
          return url;
        })
        .catch((e) => {
          if (
            axios.isCancel(e) ||
            (e instanceof Error && e.name === "AbortError")
          ) {
            setActiveUploads((prev) => prev.filter((u) => u.id !== item.id));
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            return null;
          }
          const apiMessage =
            axios.isAxiosError(e) && e.response?.data?.error
              ? String(e.response.data.error)
              : e instanceof Error
                ? e.message
                : "Upload failed";
          const userMessage = getGalleryUploadErrorMessage(apiMessage);
          setActiveUploads((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, status: "error" as const, error: userMessage }
                : u,
            ),
          );
          toast.error(`${item.file.name}: ${userMessage}`);
          return null;
        });
    },
    [propertyId, uploadAbortSignal, onValueChange],
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      const currentTotal = value.length + pendingFiles.length;
      const zodErr = validateGalleryFiles(files, currentTotal);
      if (zodErr) {
        const msg = getZodErrorMessage(zodErr);
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!propertyId) {
        onFilesSelect?.([...pendingFiles, ...files]);
        setError(null);
        return;
      }
      setError(null);
      setUploading(true);
      onUploadingChange?.(true);
      const items: GalleryUploadItem[] = files.map((file, i) => ({
        id: `upload-${Date.now()}-${i}-${file.name}`,
        file,
        progress: 0,
        status: "uploading" as const,
        previewUrl: URL.createObjectURL(file),
      }));
      setActiveUploads((prev) => [...prev, ...items]);

      try {
        await Promise.all(items.map((item) => runOneUpload(item)));
      } finally {
        setActiveUploads((prev) => prev.filter((u) => u.status === "error"));
        setUploading(false);
        onUploadingChange?.(false);
      }
    },
    [
      value.length,
      pendingFiles,
      propertyId,
      onFilesSelect,
      onUploadingChange,
      runOneUpload,
    ],
  );

  const retryFailed = useCallback(
    (itemId: string) => {
      const item = activeUploads.find((u) => u.id === itemId);
      if (!item || item.status !== "error" || !propertyId) return;
      setActiveUploads((prev) =>
        prev.map((u) =>
          u.id === itemId
            ? {
                ...u,
                status: "uploading" as const,
                progress: 0,
                error: undefined,
              }
            : u,
        ),
      );
      setUploading(true);
      onUploadingChange?.(true);
      runOneUpload({
        ...item,
        progress: 0,
        status: "uploading",
        error: undefined,
      }).finally(() => {
        setUploading(false);
        onUploadingChange?.(false);
      });
    },
    [activeUploads, propertyId, onUploadingChange, runOneUpload],
  );

  const removeFailed = useCallback((itemId: string) => {
    setActiveUploads((prev) => {
      const item = prev.find((u) => u.id === itemId);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((u) => u.id !== itemId);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled || uploading) return;
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length === 0) return;
      processFiles(files);
    },
    [disabled, uploading, processFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      e.target.value = "";
      if (files.length === 0 || disabled || uploading) return;
      processFiles(files);
    },
    [disabled, uploading, processFiles],
  );

  const removePendingAt = useCallback(
    (i: number) => {
      if (disabled) return;
      const next = pendingFiles.filter((_, j) => j !== i);
      onFilesSelect?.(next);
      setError(null);
    },
    [disabled, pendingFiles, onFilesSelect],
  );

  const removeAt = useCallback(
    (i: number) => {
      if (disabled) return;
      onValueChange(value.filter((_, j) => j !== i));
      setError(null);
    },
    [disabled, value, onValueChange],
  );

  const canAdd = totalCount < GALLERY_IMAGE_MAX_COUNT;
  const allUrls = [...value, ...pendingUrls];

  const openPreview = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }, []);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={`url-${i}-${url.slice(-20)}`}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPreview(i);
              }}
              className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus:outline-none"
              aria-label={`Preview image ${i + 1}`}
            >
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="absolute top-1 right-1 z-20 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {pendingUrls.map((url, i) => (
          <div
            key={`pending-${i}`}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-dashed border-amber-300 group"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPreview(value.length + i);
              }}
              className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus:outline-none"
              aria-label={`Preview pending image ${i + 1}`}
            >
              <img
                src={url}
                alt={`Pending ${i + 1}`}
                className="w-full h-full object-cover opacity-90 pointer-events-none"
              />
            </button>
            <span className="absolute bottom-1 left-1 z-20 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
              Pending
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePendingAt(i);
                }}
                className="absolute top-1 right-1 z-20 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {activeUploads.map((item) => (
          <div
            key={item.id}
            className={cn(
              "relative flex aspect-square flex-col gap-2 rounded-xl border-2 border-dashed p-2",
              item.status === "error"
                ? "border-red-200 bg-red-50/50"
                : "border-indigo-200 bg-indigo-50/50",
            )}
          >
            <div className="relative flex-1 min-h-0 overflow-hidden rounded-lg bg-gray-100">
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                </div>
              )}
              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white drop-shadow" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="truncate font-medium text-gray-600">
                  {item.file.name}
                </span>
                {item.status === "uploading" && (
                  <span className="shrink-0 font-semibold text-indigo-600">
                    Uploading…
                  </span>
                )}
                {item.status === "error" && (
                  <span className="shrink-0 font-semibold text-red-600">
                    Failed
                  </span>
                )}
              </div>
              {item.status === "error" ? (
                <>
                  <p className="text-[10px] text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {item.error}
                  </p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => retryFailed(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFailed(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ))}
        {canAdd && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled && !uploading) setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            className={cn(
              "relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all min-h-[100px] p-4",
              drag
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 scale-[1.02]"
                : "border-gray-300 bg-gray-50/80 hover:border-gray-400 hover:bg-gray-100/80",
              (disabled || uploading) && "opacity-70 pointer-events-none",
            )}
          >
            <input
              type="file"
              accept={ACCEPT_STR}
              multiple
              onChange={handleChange}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              disabled={disabled || uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-indigo-100 p-2">
                  <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  See progress per image above
                </span>
                <span className="text-[10px] text-gray-400">
                  {activeUploads.filter((u) => u.status === "uploading").length}{" "}
                  uploading
                </span>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "rounded-full p-2.5 transition-colors",
                    drag ? "bg-indigo-100" : "bg-gray-200/80",
                  )}
                >
                  <ImagePlus
                    className={cn(
                      "h-7 w-7",
                      drag ? "text-indigo-600" : "text-gray-500",
                    )}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  Add images
                </span>
                <span className="text-[10px] text-gray-500 text-center">
                  Drop here or click to browse
                </span>
                <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                  {totalCount} / {GALLERY_IMAGE_MAX_COUNT}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {allUrls.length > 0 && (
        <ImagePreviewModal
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          images={allUrls}
          currentIndex={previewIndex}
          onIndexChange={setPreviewIndex}
          label={`Gallery ${previewIndex + 1} / ${allUrls.length}`}
        />
      )}
      {(canAdd || totalCount > 0) && !uploading && (
        <p className="text-xs text-gray-400">
          {PROPERTY_IMAGE_EXTENSIONS.join(", ")} · Max {MAX_MB}MB each · Up to{" "}
          {GALLERY_IMAGE_MAX_COUNT} images
        </p>
      )}
      {hasFailedUploads && (
        <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Some images failed to upload. Use Retry or Remove on each card, then
          save.
        </p>
      )}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
