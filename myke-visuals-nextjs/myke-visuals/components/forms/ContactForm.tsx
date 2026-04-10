"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const services = [
  "Portrait Photography",
  "Wedding Photography",
  "Commercial & Brand Photography",
  "Fashion & Editorial",
  "Studio Hire",
  "Equipment Rental",
  "Content Creation",
  "On-Location Shoot",
  "Other",
];

const inputStyle = {
  width: "100%",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border-subtle)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  padding: "14px 16px",
  outline: "none",
  transition: "border-color 0.2s ease",
  appearance: "none" as const,
};

const labelStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--color-text-muted)",
  display: "block",
  marginBottom: "8px",
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>Name *</label>
        <input {...register("name")} placeholder="Your full name" style={inputStyle} />
        {errors.name && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-accent)", marginTop: "6px" }}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>Email *</label>
        <input {...register("email")} type="email" placeholder="your@email.com" style={inputStyle} />
        {errors.email && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-accent)", marginTop: "6px" }}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>Phone (optional)</label>
        <input {...register("phone")} type="tel" placeholder="+234 xxx xxx xxxx" style={inputStyle} />
      </div>

      {/* Service */}
      <div>
        <label style={labelStyle}>Service *</label>
        <select {...register("service")} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.service && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-accent)", marginTop: "6px" }}>{errors.service.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>Message *</label>
        <textarea {...register("message")} rows={5} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: "vertical" }} />
        {errors.message && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-accent)", marginTop: "6px" }}>{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-bg)",
          background: status === "loading" ? "var(--color-text-muted)" : "var(--color-text-primary)",
          border: "none",
          padding: "16px 40px",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          width: "100%",
          transition: "background 0.2s ease",
        }}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {/* Feedback */}
      {status === "success" && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#4ade80", textAlign: "center" }}>
          Message sent! I&apos;ll get back to you within 24 hours.
        </p>
      )}
      {status === "error" && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-accent)", textAlign: "center" }}>
          Something went wrong. Please try WhatsApp or email directly.
        </p>
      )}
    </form>
  );
}
