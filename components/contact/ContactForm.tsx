"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "buy",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `Interest: ${form.interest}\n\n${form.message}`,
          source: "website",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", interest: "buy", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-3">Message Sent!</h3>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
          Thank you for reaching out. One of our experts will get back to you
          within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Full Name <span className="text-black">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Email Address <span className="text-black">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Interest */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            I&apos;m Interested In
          </label>
          <select
            name="interest"
            value={form.interest}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-black transition-colors bg-white cursor-pointer appearance-none"
          >
            <option value="buy">Buying a property</option>
            <option value="rent">Renting a property</option>
            <option value="sell">Selling a property</option>
            <option value="invest">Investment advice</option>
            <option value="other">Something else</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
          Message <span className="text-black">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us more about what you're looking for..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span>Sending...</span>
        ) : (
          <>
            Send Message <Send className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        By submitting this form, you agree to our{" "}
        <a href="#" className="underline hover:text-black transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
