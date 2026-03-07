import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — The Real Business",
  description:
    "Get in touch with HorizonEstate. We're here to help you find your perfect property.",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "Main Street Plaza, Downtown Business District, New York, NY 10001",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@horizonestate.com",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-black pt-20 pb-16 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-white/20 inline-block" />
                  Contact Us
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-white leading-[0.95] tracking-tight max-w-xl">
                  Let&apos;s start your
                  <br />
                  property
                  <br />
                  <span className="italic font-light">journey.</span>
                </h1>
              </div>
              <div className="lg:max-w-xs">
                <p className="text-white/50 text-sm leading-relaxed">
                  Whether you&apos;re buying, selling, or renting — our team of
                  experts is ready to guide you every step of the way. Reach out
                  and we&apos;ll respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
              {/* Left: Contact info */}
              <div className="lg:col-span-2">
                <span className="text-sm text-gray-400 tracking-widest">
                  /Get In Touch
                </span>
                <h2 className="text-3xl font-bold text-black mt-3 mb-8 leading-tight">
                  We&apos;d love to
                  <br />
                  hear from you
                </h2>

                <div className="space-y-7">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm text-black font-medium leading-relaxed whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mt-10 pt-10 border-t border-gray-100">
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-3">
                    {["Facebook", "Instagram", "X", "LinkedIn"].map(
                      (social) => (
                        <a
                          key={social}
                          href="#"
                          className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
                        >
                          {social[0]}
                        </a>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Map / visual */}
        <section className="h-80 bg-gray-100 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000&q=80"
            alt="Office district"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl text-center">
              <p className="text-sm font-semibold text-black">
                Main Street Plaza
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Downtown Business District, New York
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
