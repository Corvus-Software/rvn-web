import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("waitlist")
      .insert({ email })
      .select("id, created_at")
      .single();

    if (insertError) {
      if ((insertError as any).code === "23505") {
        return NextResponse.json(
          { error: "You are already on the waitlist" },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    const { count, error: countError } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const position = count ?? 0;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `"RVN" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to RVN — You're on the Waitlist!",
      text: `Thanks for signing up! Your position on the waitlist is #${position}. We’ll keep you updated.`,
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>RVN Waitlist Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0b0b0b; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <!-- Container -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#111111; border-radius:12px; overflow:hidden; box-shadow:0 0 30px rgba(138,43,226,0.5);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:40px 20px; background:linear-gradient(135deg,#8a2be2,#00bfff);">
                <h1 style="margin:0; font-size:28px; font-weight:700; color:#ffffff;">Welcome to <span style="color:#fff;">RVN</span></h1>
                <p style="margin:10px 0 0; font-size:16px; color:#e0e0e0;">Your journey starts here</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px; text-align:left;">
                <p style="font-size:18px; margin:0 0 20px;">Hello <strong>${email}</strong>,</p>
                <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
                  Thank you for joining the <strong>RVN Waitlist</strong>. You’ve secured your spot and we’re excited to have you on board.
                </p>
                <p style="font-size:16px; margin:0 0 20px;">
                  Your current waitlist position is: <strong style="color:#8a2be2; font-size:20px;">#${position}</strong>
                </p>
                <p style="font-size:16px; line-height:1.6; margin:0 0 30px;">
                  We’ll keep you updated as we roll out early access. Stay tuned for something big.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="https://rvnconsole.com" 
                     style="display:inline-block; padding:14px 28px; background:linear-gradient(135deg,#8a2be2,#00bfff); color:#fff; font-size:16px; font-weight:600; text-decoration:none; border-radius:8px;">
                    Visit RVN
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 30px; text-align:center; background:#0b0b0b; border-top:1px solid #222;">
                <p style="font-size:12px; color:#999; margin:0;">
                  © ${new Date().getFullYear()} RVN. All rights reserved.<br/>
                  <a href="https://rvnconsole.com/unsubscribe" style="color:#666; text-decoration:none;">Unsubscribe</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
    });

    return NextResponse.json({ position });
  } catch (err: any) {
    console.error("Waitlist API error:", err);
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
