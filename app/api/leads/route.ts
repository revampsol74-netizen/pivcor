import { logger } from "@/lib/logger"
import { Resend } from "resend"

// Configure your email and WhatsApp settings here
const LEAD_EMAIL = process.env.LEAD_EMAIL || "contact@pivcor.com"
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "+19372302564" // PIVCOR American phone number

async function sendEmailLead(leadData: { name: string; email: string; mobile: string; service: string }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.error("RESEND_API_KEY is not configured")
      return false
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log("📤 Attempting to send lead email via Resend...")
    console.log("From:", "PIVCOR <noreply@pivcor.com>")
    console.log("To:", LEAD_EMAIL)

    const { data, error } = await resend.emails.send({
      from: "PIVCOR <noreply@pivcor.com>",
      to: LEAD_EMAIL,
      subject: `New Lead: ${leadData.name} - ${leadData.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF0000; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">
            🚀 New Lead Generated
          </h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Mobile:</strong> ${leadData.mobile || "Not provided"}</p>
            <p><strong>Service Interest:</strong> ${leadData.service}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This lead was generated from the PIVCOR website chatbot.
          </p>
        </div>
      `,
    })

    console.log("📬 Resend API Response:")
    console.log("Data:", JSON.stringify(data, null, 2))
    console.log("Error:", JSON.stringify(error, null, 2))

    if (error) {
      console.error("❌ Resend email error details:", error)
      logger.error("Resend email error:", error)
      return false
    }

    if (!data || !data.id) {
      console.warn("⚠️ Resend returned success but no email ID")
      logger.error("Resend returned success but no email ID", { data, error })
      return false
    }

    console.log("✅ Lead email sent successfully! Email ID:", data.id)
    logger.log("📧 Email sent successfully:", {
      to: LEAD_EMAIL,
      subject: `New Lead: ${leadData.name} - ${leadData.service}`,
      emailId: data.id,
    })

    return true
  } catch (error) {
    logger.error("Email sending error:", error)
    return false
  }
}

async function sendWhatsAppLead(leadData: { name: string; email: string; mobile: string; service: string }) {
  try {
    // Format mobile number (remove spaces, dashes, keep + and digits)
    const cleanMobile = leadData.mobile.replace(/[\s-]/g, "")
    
    // Create WhatsApp message
    const message = encodeURIComponent(
      `🚀 *New Lead from PIVCOR Website*\n\n` +
      `*Name:* ${leadData.name}\n` +
      `*Email:* ${leadData.email}\n` +
      `*Mobile:* ${leadData.mobile}\n` +
      `*Service Interest:* ${leadData.service}\n` +
      `*Date:* ${new Date().toLocaleString()}\n\n` +
      `_This lead was generated from the website chatbot._`
    )

    // WhatsApp Business API URL format: https://wa.me/PHONENUMBER?text=MESSAGE
    // For web link (opens WhatsApp with pre-filled message):
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9+]/g, "")}?text=${message}`

    logger.log("📱 WhatsApp Lead:", {
      number: WHATSAPP_NUMBER,
      url: whatsappUrl,
      leadData,
    })

    // Option 1: Return URL for frontend to open
    // Option 2: Use WhatsApp Business API to send directly (requires API credentials)
    // For now, we'll return the URL so frontend can handle it
    return whatsappUrl
  } catch (error) {
    logger.error("WhatsApp sending error:", error)
    return null
  }
}

async function sendTelegramLead(leadData: { name: string; email: string; mobile: string; service: string }) {
  try {
    // Telegram link format: https://t.me/<username>?text=<message>
    // Or use deep link: https://t.me/share/url?url=<encoded_url>&text=<encoded_text>
    const TELEGRAM_USERNAME = process.env.TELEGRAM_USERNAME || "pivcor"
    
    // Create a formatted message for Telegram
    const messageText = 
      `🚀 New Lead from PIVCOR Website\n\n` +
      `Name: ${leadData.name}\n` +
      `Email: ${leadData.email}\n` +
      `Mobile: ${leadData.mobile}\n` +
      `Service Interest: ${leadData.service}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `This lead was generated from the website chatbot.`
    
    // Use Telegram share URL format that opens Telegram with the message
    const message = encodeURIComponent(messageText)
    const telegramUrl = `https://t.me/share/url?url=https://pivcor.com&text=${message}`

    logger.log("✈️ Telegram Lead:", {
      username: TELEGRAM_USERNAME,
      url: telegramUrl,
      leadData,
    })

    return telegramUrl
  } catch (error) {
    logger.error("Telegram sending error:", error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, service } = await req.json()

    if (!name || !email || !service) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const leadData = { name, email, mobile: "", service }

    logger.log("[PIVCOR] New Lead Captured:", {
      ...leadData,
      timestamp: new Date().toISOString(),
    })

    // Send email notification
    await sendEmailLead(leadData)

    // TODO: Save to database if needed
    // Example: await db.leads.create(leadData)

    return Response.json({
      success: true,
      message: "Perfect! Our team will get in contact with you soon! 🚀",
    })
  } catch (error) {
    logger.error("[PIVCOR] Lead API error:", error)
    return Response.json({ error: "Failed to capture lead" }, { status: 500 })
  }
}
