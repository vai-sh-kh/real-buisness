"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateLead } from "@/hooks/useLeads";
import type { Lead, LeadWithProperty } from "@/types";
import { Loader2, Mail, Phone, Building2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LeadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: LeadWithProperty | null;
}

const statusOptions: { value: Lead["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const sourceLabels: Record<Lead["source"], string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

export function LeadSheet({ open, onOpenChange, lead }: LeadSheetProps) {
  const updateMutation = useUpdateLead();

  const { register, handleSubmit, reset, setValue, watch } = useForm<{
    status: Lead["status"];
    notes: string;
  }>({
    defaultValues: { status: "new", notes: "" },
  });

  useEffect(() => {
    if (lead) {
      reset({ status: lead.status, notes: lead.notes ?? "" });
    }
  }, [lead, reset]);

  async function onSubmit(values: { status: Lead["status"]; notes: string }) {
    if (!lead) return;
    await updateMutation.mutateAsync({
      id: lead.id,
      values: { status: values.status, notes: values.notes || null },
    });
    onOpenChange(false);
  }

  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
          <SheetDescription>View and update this lead</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Info
            </h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <p className="text-lg font-semibold">{lead.name}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {sourceLabels[lead.source]}
                </Badge>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline truncate">
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.property && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{lead.property.title}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(lead.created_at)}</span>
              </div>
            </div>

            {lead.message && (
              <div>
                <p className="text-sm font-medium mb-1.5">Message</p>
                <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                  {lead.message}
                </p>
              </div>
            )}
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Update Lead
            </h3>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as Lead["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add notes about this lead..."
                rows={4}
              />
            </div>

            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
