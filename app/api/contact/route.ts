import { logger } from "@/lib/logger"
import { Resend } from "resend"

const CONTACT_EMAIL = process.env.LEAD_EMAIL || "contact@pivcor.com"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      logger.error("Failed to parse request body:", parseError)
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      logger.error("RESEND_API_KEY is not configured")
      return Response.json({ error: "Email service not configured" }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log("📤 Attempting to send email via Resend...")
    console.log("From:", "PIVCOR <noreply@pivcor.com>")
    console.log("To:", CONTACT_EMAIL)
    console.log("API Key present:", !!process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "PIVCOR <noreply@pivcor.com>",
      to: CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF0000; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">
            📧 New Contact Form Submission
          </h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #FF0000;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This message was submitted through the PIVCOR website contact form.
          </p>
        </div>
      `,
      replyTo: email, // Allow replying directly to the sender
    })

    console.log("📬 Resend API Response:")
    console.log("Data:", JSON.stringify(data, null, 2))
    console.log("Error:", JSON.stringify(error, null, 2))

    if (error) {
      console.error("❌ Resend email error details:", error)
      logger.error("Resend email error:", error)
      return Response.json({ 
        error: "Failed to send email",
        details: error 
      }, { status: 500 })
    }

    if (!data || !data.id) {
      console.warn("⚠️ Resend returned success but no email ID")
      logger.error("Resend returned success but no email ID", { data, error })
      return Response.json({ 
        error: "Email sent but no confirmation received",
        details: "Please check Resend dashboard"
      }, { status: 500 })
    }

    console.log("✅ Email sent successfully! Email ID:", data.id)
    logger.log("📧 Contact form email sent successfully:", {
      to: CONTACT_EMAIL,
      from: email,
      subject: `New Contact Form Submission from ${name}`,
      emailId: data.id,
    })

    return Response.json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    })
  } catch (error) {
    logger.error("[PIVCOR] Contact form error:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}

