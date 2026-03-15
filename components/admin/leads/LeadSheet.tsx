"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCreateLead, useUpdateLead } from "@/hooks/useLeads";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { useProperties } from "@/hooks/useProperties";
import {
  leadCreateSchema,
  leadUpdateSchema,
  type LeadCreateFormData,
  type LeadUpdateFormData,
} from "@/lib/validations/lead.schema";
import type { Lead, LeadWithProperty } from "@/types";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

const SOURCE_LABELS: Record<Lead["source"], string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

const statusOptions: { value: Lead["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

interface LeadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: LeadWithProperty | null;
}

export function LeadSheet({ open, onOpenChange, lead }: LeadSheetProps) {
  const isMobile = useIsMobile();
  const isEditing = !!lead;
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const { data: propertiesData } = useProperties({
    limit: 100,
    status: "active",
  });
  const properties = propertiesData?.data ?? [];

  const createForm = useForm<LeadCreateFormData>({
    resolver: zodResolver(leadCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      source: "manual",
      property_id: "",
    },
  });

  const updateForm = useForm<LeadUpdateFormData>({
    resolver: zodResolver(leadUpdateSchema),
    defaultValues: { status: "new", notes: "" },
  });

  useEffect(() => {
    if (lead) {
      updateForm.reset({ status: lead.status, notes: lead.notes ?? "" });
      createForm.reset({
        name: lead.name,
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        message: lead.message ?? "",
        source: lead.source,
        property_id: lead.property_id ?? "",
      });
    }
  }, [lead, updateForm, createForm]);

  useScrollToFirstError(createForm.formState.errors, {
    fieldIdMap: { name: "lead-name", email: "lead-email", phone: "lead-phone" },
  });
  useScrollToFirstError(updateForm.formState.errors);

  useEffect(() => {
    if (!open) return;
    if (!isEditing) {
      createForm.reset({
        name: "",
        email: "",
        phone: "",
        message: "",
        source: "manual",
        property_id: "",
      });
    }
  }, [isEditing, open, createForm]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onCreateSubmit(values: LeadCreateFormData) {
    const payload = {
      name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      message: values.message || null,
      source: values.source,
      status: "new" as const,
      property_id: values.property_id || null,
      property_title: null,
      notes: null,
    };
    await createMutation.mutateAsync(payload);
    onOpenChange(false);
  }

  async function onEditSubmit() {
    if (!lead) return;
    const createValues = createForm.getValues();
    const updateValues = updateForm.getValues();
    await updateMutation.mutateAsync({
      id: lead.id,
      values: {
        name: createValues.name,
        email: createValues.email || null,
        phone: createValues.phone || null,
        message: createValues.message || null,
        source: createValues.source,
        property_id: createValues.property_id || null,
        status: updateValues.status,
        notes: updateValues.notes || null,
      },
    });
    onOpenChange(false);
  }

  // Single sheet for both add and edit (same layout as add)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = createForm;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl flex flex-col",
          isMobile
            ? "max-h-[90vh] rounded-t-2xl border-t border-gray-100"
            : "sm:max-w-4xl border-l border-gray-100",
        )}
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4">
              <SheetTitle className="text-xl font-bold text-white leading-tight">
                {isEditing ? "Edit Lead" : "New Lead"}
              </SheetTitle>
              <SheetDescription className="text-gray-400 text-xs mt-1">
                {isEditing
                  ? "Update contact and details"
                  : "Add a lead manually (e.g. from phone call, walk-in)"}
              </SheetDescription>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
        </div>

        <form
          onSubmit={
            isEditing
              ? createForm.handleSubmit(onEditSubmit)
              : handleSubmit(onCreateSubmit)
          }
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="lead-name"
                  className="text-xs font-bold text-gray-700 ml-1"
                >
                  Name *
                </Label>
                <Input
                  id="lead-name"
                  {...register("name")}
                  placeholder="e.g., John Doe"
                  className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 text-base"
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="lead-email"
                    className="text-xs font-bold text-gray-700 ml-1"
                  >
                    Email
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lead-phone"
                    className="text-xs font-bold text-gray-700 ml-1"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="lead-phone"
                    {...register("phone")}
                    placeholder="+91 98765 43210"
                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive font-medium ml-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 ml-1">
                  Source
                </Label>
                <Select
                  value={watch("source")}
                  onValueChange={(v) => setValue("source", v as Lead["source"])}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    <SelectItem value="manual" className="rounded-lg">
                      Manual
                    </SelectItem>
                    <SelectItem value="website" className="rounded-lg">
                      Website
                    </SelectItem>
                    <SelectItem value="meta_ads" className="rounded-lg">
                      Meta Ads
                    </SelectItem>
                    <SelectItem value="google_ads" className="rounded-lg">
                      Google Ads
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 ml-1">
                  Interested Property
                </Label>
                <Select
                  value={watch("property_id") || "none"}
                  onValueChange={(v) =>
                    setValue("property_id", v === "none" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select property (optional)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    <SelectItem
                      value="none"
                      className="rounded-lg text-gray-400"
                    >
                      None
                    </SelectItem>
                    {properties.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={p.id}
                        className="rounded-lg"
                      >
                        {p.title} — ₹{Number(p.price).toLocaleString("en-IN")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lead-message"
                  className="text-xs font-bold text-gray-700 ml-1"
                >
                  Message / Notes
                </Label>
                <Textarea
                  id="lead-message"
                  {...register("message")}
                  placeholder="Inquiry details..."
                  className="min-h-[120px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                />
              </div>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 ml-1">
                      Status
                    </Label>
                    <Select
                      value={updateForm.watch("status")}
                      onValueChange={(v) =>
                        updateForm.setValue("status", v as Lead["status"])
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl">
                        {statusOptions.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="rounded-lg"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lead-notes"
                      className="text-xs font-bold text-gray-700 ml-1"
                    >
                      Internal Notes
                    </Label>
                    <Textarea
                      id="lead-notes"
                      {...updateForm.register("notes")}
                      placeholder="Document your interactions here..."
                      className="min-h-[120px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md border-t border-gray-100 flex gap-3 shrink-0 touch-manipulation">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-xl min-h-[44px] h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-[2] rounded-xl min-h-[44px] h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98] touch-manipulation"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Save changes" : "Create Lead"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
