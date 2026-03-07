"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
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
}

export function GalleryDropzone({
  value,
  onValueChange,
  onFilesSelect,
  propertyId,
  pendingFiles = [],
  disabled,
}: GalleryDropzoneProps) {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeUploads, setActiveUploads] = useState<GalleryUploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const pendingUrls = useMemo(() => {
    return pendingFiles.map((f) => URL.createObjectURL(f));
  }, [pendingFiles]);
  useEffect(() => {
    return () => pendingUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingUrls]);

  const totalCount = value.length + pendingFiles.length + activeUploads.length;

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
      const items: GalleryUploadItem[] = files.map((file, i) => ({
        id: `upload-${Date.now()}-${i}-${file.name}`,
        file,
        progress: 0,
        status: "uploading" as const,
        previewUrl: URL.createObjectURL(file),
      }));
      setActiveUploads(items);

      const uploadOne = (item: GalleryUploadItem): Promise<string | null> =>
        new Promise((resolve) => {
          const fd = new FormData();
          fd.set("propertyId", propertyId);
          fd.set("type", "gallery");
          fd.append("files", item.file);
          axios
            .post<{ urls?: string[]; error?: string }>(
              "/api/admin/properties/upload",
              fd,
              {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ev) => {
                  if (ev.total != null && ev.total > 0) {
                    const pct = Math.round((ev.loaded / ev.total) * 100);
                    setActiveUploads((prev) =>
                      prev.map((u) =>
                        u.id === item.id ? { ...u, progress: pct } : u,
                      ),
                    );
                  }
                },
              },
            )
            .then((res) => {
              const url = res.data?.urls?.[0];
              if (typeof url === "string") {
                setActiveUploads((prev) =>
                  prev.map((u) =>
                    u.id === item.id
                      ? { ...u, progress: 100, status: "done", url }
                      : u,
                  ),
                );
                resolve(url);
              } else {
                setActiveUploads((prev) =>
                  prev.map((u) =>
                    u.id === item.id
                      ? { ...u, status: "error", error: "Invalid response" }
                      : u,
                  ),
                );
                resolve(null);
              }
            })
            .catch((e) => {
              const errMsg =
                axios.isAxiosError(e) && e.response?.data?.error
                  ? String(e.response.data.error)
                  : e instanceof Error
                    ? e.message
                    : "Upload failed";
              setActiveUploads((prev) =>
                prev.map((u) =>
                  u.id === item.id
                    ? { ...u, status: "error", error: errMsg }
                    : u,
                ),
              );
              toast.error(`${item.file.name}: ${errMsg}`);
              resolve(null);
            });
        });

      try {
        const results = await Promise.all(items.map((item) => uploadOne(item)));
        const successUrls = results.filter(
          (u): u is string => typeof u === "string",
        );
        if (successUrls.length > 0) {
          onValueChange([...value, ...successUrls]);
        }
      } finally {
        setActiveUploads((prev) => {
          prev.forEach(
            (u) => u.previewUrl && URL.revokeObjectURL(u.previewUrl),
          );
          return [];
        });
        setUploading(false);
      }
    },
    [propertyId, value, pendingFiles, onValueChange, onFilesSelect],
  );

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
            className="relative flex aspect-square flex-col gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-2"
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
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="truncate font-medium text-gray-600">
                  {item.file.name}
                </span>
                <span className="shrink-0 tabular-nums text-indigo-600">
                  {item.status === "error" ? "Failed" : `${item.progress}%`}
                </span>
              </div>
              {item.status === "error" ? (
                <p className="text-[10px] text-destructive">{item.error}</p>
              ) : (
                <Progress value={item.progress} className="h-1.5" />
              )}
            </div>
          </div>
        ))}
        {canAdd && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            className={cn(
              "relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors min-h-[100px]",
              drag
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-gray-200 bg-gray-50/50",
              disabled && "opacity-60 pointer-events-none",
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
              <div className="flex flex-col items-center gap-1">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <span className="text-[10px] text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  {totalCount}/{GALLERY_IMAGE_MAX_COUNT}
                </span>
                <span className="text-[10px] text-gray-400">Drop or click</span>
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
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
