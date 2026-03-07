"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidImageUrl } from "@/lib/utils";
import { ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUrlInputProps {
  id: string;
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function ImageUrlInput({
  id,
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  error,
  required,
  className,
}: ImageUrlInputProps) {
  const url = value?.trim() || "";
  const hasPreview = isValidImageUrl(url);

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id={id}
            type="url"
            value={url}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder={placeholder}
            className={cn(
              "h-12 rounded-xl border-gray-200 pl-10 pr-10",
              "focus:ring-indigo-500 text-sm",
            )}
          />
          {hasPreview && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(null)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {hasPreview && (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 aspect-video max-w-[280px]">
          <img
            src={url}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      {error && (
        <p className="text-xs text-destructive font-medium ml-1">{error}</p>
      )}
    </div>
  );
}
