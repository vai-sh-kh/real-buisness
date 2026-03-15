"use client";

import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageHero from "@/components/PageHero";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSubmitContactForm } from "@/hooks/useLeads";

const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val.replace(/\s/g, "")),
      "Enter a valid 10-digit Indian mobile number",
    ),
  interest: z.enum(["buy", "sell", "rent", "general"], {
    required_error: "Please select an option",
  }),
  message: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 10 && val.length <= 2000),
      "If provided, message must be 10–2000 characters",
    ),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const interestOptions: {
  value: ContactFormValues["interest"];
  label: string;
}[] = [
  { value: "buy", label: "Buying a property" },
  { value: "sell", label: "Selling a property" },
  { value: "rent", label: "Renting a property" },
  { value: "general", label: "General inquiry" },
];

export default function ContactPage() {
  const submitContact = useSubmitContactForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      interest: "general",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate(
      {
        name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email,
        phone: data.phone?.trim() || null,
        message: `Interest: ${interestOptions.find((o) => o.value === data.interest)?.label ?? data.interest}\n\n${data.message ?? "(No message)"}`,
        source: "website",
      },
      {
        onSuccess: () => reset(),
      },
    );
  };

  return (
    <>
      <PageHero
        title="Get In Touch"
        imageSrc="/hero-contact.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        description="Whether you're looking to buy, sell, rent, or have a question—our team is here to help. Reach out and we'll get back to you soon."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground">
                  Whether you&apos;re looking to buy, sell, or just have a
                  question, our team is ready to assist you.
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                      placeholder="e.g. Ramesh"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                      placeholder="e.g. Kumar"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                      placeholder="e.g. name@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                      placeholder="e.g. 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="interest"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    I&apos;m interested in{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="interest"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="interest"
                          className={cn(
                            "w-full h-[52px] px-4 py-3 rounded-xl border border-border bg-muted text-foreground shadow-sm transition-all",
                            "focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold focus:ring-offset-0",
                            "hover:bg-muted/80",
                            "data-[placeholder]:text-muted-foreground",
                            errors.interest &&
                              "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                          )}
                        >
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-border bg-white shadow-lg">
                          {interestOptions.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className="rounded-lg py-2.5 pl-3 pr-8 focus:bg-brand-gold/10 focus:text-foreground cursor-pointer"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.interest && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.interest.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className="w-full min-h-[120px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all resize-none"
                    placeholder="How can we help you? (optional; if provided, min. 10 characters)"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full py-4 bg-brand-charcoal text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {submitContact.isPending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-muted p-4 sm:p-6 lg:p-8 rounded-2xl border border-border mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4 sm:mb-6">
                  Contact Information
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <MapPin size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        Head Office
                      </h4>
                      <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                        123 Luxury Avenue, Suite 500
                        <br />
                        New York, NY 10022
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <Phone size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        Phone
                      </h4>
                      <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                        +1 (555) 123-4567
                        <br />
                        +1 (555) 987-6543
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <Mail size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        Email
                      </h4>
                      <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                        hello@therealbusiness.com
                        <br />
                        support@therealbusiness.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <Clock size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        Working Hours
                      </h4>
                      <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="flex-grow min-h-[300px] bg-muted rounded-2xl overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1644469238848!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Office location map"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
