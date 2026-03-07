import { z } from "zod";

export const leadSourceSchema = z.enum(["website", "meta_ads", "google_ads", "manual"]);
export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "converted", "lost"]);

export const leadCreateSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
    phone: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
    message: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
    source: leadSourceSchema.default("manual"),
    property_id: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
  })
  .refine(
    (d) => !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    { message: "Invalid email format", path: ["email"] }
  );

export const leadUpdateSchema = z.object({
  status: leadStatusSchema,
  notes: z.string().max(5000).optional().nullable().or(z.literal("")),
});

export type LeadCreateFormData = z.infer<typeof leadCreateSchema>;
export type LeadUpdateFormData = z.infer<typeof leadUpdateSchema>;
