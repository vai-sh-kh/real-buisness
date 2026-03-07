"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DIALOG_CLASS =
  "sm:max-w-2xl rounded-xl border border-border bg-card shadow-xl p-0 overflow-hidden [&>button]:text-muted-foreground [&>button]:opacity-100 [&>button]:bg-muted [&>button:hover]:bg-muted/80 [&>button]:rounded-full [&>button]:p-2 [&>button]:top-4 [&>button]:right-4 transition-all duration-200";

interface ProfileDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
  editLabel?: string;
  dismissLabel?: string;
}

export function ProfileDetailModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  onEdit,
  editLabel = "Edit",
  dismissLabel = "Close",
}: ProfileDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CLASS}>
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="min-h-[120px]">{children}</div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            {dismissLabel}
          </Button>
          {onEdit && (
            <Button size="sm" onClick={onEdit} className="rounded-lg">
              {editLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ProfileSectionLabel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2 ${className}`}
  >
    {children}
  </div>
);

export const ProfileFieldLabel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={`text-xs text-muted-foreground block mb-1 ${className}`}>
    {children}
  </span>
);
