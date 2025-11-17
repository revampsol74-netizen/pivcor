import { Resend } from "resend";

const TO_EMAIL = process.env.LEAD_EMAIL || "contact@pivcor.com";
const FROM_EMAIL = process.env.CHATBOT_FROM_EMAIL || "Pivcor Bot <noreply@pivcor.com>";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const maxDuration = 30;

type LeadPayload = {
  context?: string;
  projectType?: string;
  painPoint?: string;
  name?: string;
  email?: string;
  budget?: string;
  urgency?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const { context, projectType, painPoint, name, email, budget, urgency } = body;

    if (!context || !projectType || !painPoint || !name || !email || !budget || !urgency) {
      return Response.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return Response.json({ success: false, error: "Invalid email." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ success: false, error: "Email service not configured." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family: Arial, sans-serif; background:#0B0B0F; color:#fff; padding:24px;">
        <h2 style="margin:0 0 12px;font-size:20px;">New Chatbot Lead</h2>
        <p style="margin:8px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin:8px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin:8px 0;"><strong>Project Type:</strong> ${projectType}</p>
        <p style="margin:8px 0;"><strong>Pain Point:</strong> ${painPoint}</p>
        <p style="margin:8px 0;"><strong>Budget Tier:</strong> ${budget}</p>
        <p style="margin:8px 0;"><strong>Urgency:</strong> ${urgency}</p>
        <div style="margin-top:16px; padding:16px; background:#121212; border-radius:12px;">
          <p style="margin:0; font-size:14px;"><strong>Context:</strong></p>
          <p style="white-space:pre-line; margin-top:8px;">${context}</p>
        </div>
        <p style="margin-top:24px; font-size:12px; color:#bbb;">Submitted via Pivcor chatbot.</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New chatbot lead – ${name}`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error("Chatbot lead email error:", error);
      return Response.json({ success: false, error: "Failed to send email." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Chatbot lead API error:", error);
    return Response.json({ success: false, error: "Unexpected error." }, { status: 500 });
  }
}
