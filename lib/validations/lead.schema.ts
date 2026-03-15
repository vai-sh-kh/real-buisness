import { z } from "zod";

export const leadSourceSchema = z.enum(["website", "meta_ads", "google_ads", "manual"]);
export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "converted", "lost"]);

export const leadCreateSchema = z
  .object({
    name: z.string().min(1, "Please enter your name").max(200, "Please keep name to 200 characters or less"),
    email: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
    phone: z.string().min(1, "Please enter your phone number").max(30, "Please keep phone to 30 characters or less"),
    message: z.string().max(5000, "Please keep message to 5000 characters or less").optional().transform((v) => (v === "" || !v ? null : v)),
    source: leadSourceSchema.default("manual"),
    property_id: z.string().optional().transform((v) => (v === "" || !v ? null : v)),
  })
  .refine(
    (d) => !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    { message: "Please enter a valid email address", path: ["email"] }
  );

export const leadUpdateSchema = z.object({
  status: leadStatusSchema,
  notes: z.string().max(5000, "Please keep notes to 5000 characters or less").optional().nullable().or(z.literal("")),
});

export type LeadCreateFormData = z.infer<typeof leadCreateSchema>;
export type LeadUpdateFormData = z.infer<typeof leadUpdateSchema>;
