import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";

// Resend is initialised lazily inside the handler so build doesn't fail without env vars

export async function POST(req: NextRequest) {
  // [README] Make sure RESEND_API_KEY is set in .env.local
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save enquiry to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from("enquiries").insert({
      name,
      email,
      phone: phone || null,
      service: service || null,
      message,
      status: "new",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Don't fail — still try to send email
    }

    // 2. Send notification email to Myke
    // [README] Update RESEND_FROM_EMAIL and RESEND_TO_EMAIL in .env.local
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@mykevisuals.com",
      to: process.env.RESEND_TO_EMAIL || "info@mykevisuals.com",
      subject: `New Enquiry from ${name} — ${service || "General"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #ff7738; margin-bottom: 24px;">New Enquiry — Myke Visuals</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
            ${service ? `<tr><td style="padding: 8px 0; color: #666;">Service</td><td style="padding: 8px 0;">${service}</td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #f5f5f5; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="margin-top: 24px; color: #999; font-size: 12px;">Sent from mykevisuals.com contact form</p>
        </div>
      `,
    });

    // 3. Send confirmation to the person who enquired
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@mykevisuals.com",
      to: email,
      subject: "Thanks for reaching out — Myke Visuals",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #faf5ea;">
          <h2 style="color: #ff7738; margin-bottom: 16px;">Got it, ${name}.</h2>
          <p style="color: #bababa; line-height: 1.7; margin-bottom: 24px;">
            Thanks for getting in touch. I've received your message and will get back to you within 24 hours.
          </p>
          <p style="color: #bababa; line-height: 1.7;">
            In the meantime, feel free to explore my work at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #ff7738;">mykevisuals.com</a> or reach me directly on <a href="https://wa.me/message/OTYCTLJLVBSWN1" style="color: #ff7738;">WhatsApp</a>.
          </p>
          <p style="margin-top: 40px; color: #faf5ea; font-weight: 600;">— Myke</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
