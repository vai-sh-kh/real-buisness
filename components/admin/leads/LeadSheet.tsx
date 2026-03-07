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
import { Loader2, Mail, Phone, Building2, Calendar } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Badge } from "@/components/ui/badge";

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
    }
  }, [lead, updateForm]);

  useScrollToFirstError(createForm.formState.errors, {
    fieldIdMap: { name: "lead-name", email: "lead-email", phone: "lead-phone" },
  });
  useScrollToFirstError(updateForm.formState.errors);

  useEffect(() => {
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

  async function onUpdateSubmit(values: LeadUpdateFormData) {
    if (!lead) return;
    await updateMutation.mutateAsync({
      id: lead.id,
      values: { status: values.status, notes: values.notes || null },
    });
    onOpenChange(false);
  }

  if (isEditing) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-l border-gray-100 flex flex-col"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-4">
                <SheetTitle className="text-xl font-bold text-white leading-tight">
                  Lead Information
                </SheetTitle>
                <SheetDescription className="text-gray-400 text-xs mt-1">
                  Full activity and contact breakdown
                </SheetDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-white/5 border-white/10 text-indigo-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1"
                >
                  UID: {lead.id.slice(0, 8)}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                  {lead.status}
                </Badge>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-10 pb-24">
              <section>
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4">
                  Contact Details
                </Label>
                <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 space-y-5">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-xl font-black text-gray-900 leading-tight">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium italic">
                        Source: {SOURCE_LABELS[lead.source]}
                      </p>
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {lead.email && (
                      <div className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 ring-4 ring-indigo-50/50">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            Email Address
                          </p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 truncate block"
                          >
                            {lead.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-transparent hover:border-emerald-100 transition-all cursor-pointer">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 ring-4 ring-emerald-50/50">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            Phone Number
                          </p>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-sm font-semibold text-gray-700 hover:text-emerald-600 truncate block"
                          >
                            {lead.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {lead.property && (
                <section>
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4">
                    Interested Property
                  </Label>
                  <div className="p-4 rounded-3xl bg-indigo-50/30 border border-indigo-100 flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
                      <Building2 className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {lead.property.title}
                      </p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">
                        ₹{(lead.property.price ?? 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {lead.message && (
                <section>
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-3">
                    Original Message
                  </Label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100" />
                    <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-indigo-500/20 pl-6 py-1">
                      &quot;{lead.message}&quot;
                    </p>
                  </div>
                </section>
              )}

              <form
                onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
                className="space-y-6 pt-10 border-t border-gray-100"
              >
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block font-black">
                  Management & Notes
                </Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 ml-1">
                      Update Status
                    </Label>
                    <Select
                      value={updateForm.watch("status")}
                      onValueChange={(v) =>
                        updateForm.setValue("status", v as Lead["status"])
                      }
                    >
                      <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-2xl border-gray-100">
                        {statusOptions.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="rounded-xl py-3 font-medium"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 ml-1">
                      Internal Notes
                    </Label>
                    <Textarea
                      {...updateForm.register("notes")}
                      placeholder="Document your interactions here..."
                      className="min-h-[140px] rounded-3xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isPending}
                    className="flex-1 rounded-2xl h-14 border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Discard
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="flex-[2] rounded-2xl h-14 bg-gray-900 hover:bg-gray-800 text-white font-black text-lg shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    )}
                    Save Activity
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Create mode
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
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4">
              <SheetTitle className="text-xl font-bold text-white leading-tight">
                New Lead
              </SheetTitle>
              <SheetDescription className="text-gray-400 text-xs mt-1">
                Add a lead manually (e.g. from phone call, walk-in)
              </SheetDescription>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
        </div>

        <form
          onSubmit={handleSubmit(onCreateSubmit)}
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
                    Phone
                  </Label>
                  <Input
                    id="lead-phone"
                    {...register("phone")}
                    placeholder="+91 98765 43210"
                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                  />
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
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-xl h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-[2] rounded-xl h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Lead
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
