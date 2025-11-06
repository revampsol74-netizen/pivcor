export const maxDuration = 30

export async function POST(req: Request) {
  try {
  const { messages }: { messages: any[] } = await req.json()

    // Handle empty messages array
    if (!messages || messages.length === 0) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode("Hi! How Can PIVCOR Help You today? 🚀"))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      })
    }

  const userMessage = messages[messages.length - 1]?.content || ""
  const conversationHistory = messages
      .map((m: any) => m.content || "")
    .join(" ")
    .toLowerCase()

  let botResponse = ""

  // Track conversation stage
  const messageCount = messages.length
  
    // Service options mapping
    const serviceOptions = [
      "Digital Ecosystem Strategy",
      "Web App Development",
      "Mobile App Development", 
      "Blockchain & Web3 Solutions",
      "AI Automations & SaaS",
      "Headless E-Commerce"
    ]
    
    // Extract service from user messages - look for exact matches first
    const findSelectedService = () => {
      // Check user messages in reverse order (most recent first)
      const userMessages = messages
        .filter((m: any) => m.role === "user")
        .map((m: any) => m.content || "")
        .reverse()
      
      for (const msg of userMessages) {
        for (const service of serviceOptions) {
          if (msg.toLowerCase().includes(service.toLowerCase())) {
            return service
          }
        }
        // Also check for partial matches
        if (/digital ecosystem strategy|ecosystem strategy/i.test(msg)) return "Digital Ecosystem Strategy"
        if (/web app development/i.test(msg)) return "Web App Development"
        if (/mobile app development/i.test(msg)) return "Mobile App Development"
        if (/blockchain|web3|web 3/i.test(msg)) return "Blockchain & Web3 Solutions"
        if (/ai automation|saas|ai automations/i.test(msg)) return "AI Automations & SaaS"
        if (/e-commerce|ecommerce|headless e-commerce/i.test(msg)) return "Headless E-Commerce"
      }
      return null
    }
    
    const selectedService = findSelectedService()
    const hasService = !!selectedService
    
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(conversationHistory)
    // Mobile collection removed - only collecting email
    // Extract name - look for responses that are likely names
    // Only check user messages that come after service selection
    // Find the first user message after service that looks like a name
    let serviceIndex = -1
    const userMessages = messages.filter((m: any) => m.role === "user")
    for (let i = 0; i < userMessages.length; i++) {
      const msg = userMessages[i].content?.toLowerCase() || ""
      if (serviceOptions.some(s => msg.includes(s.toLowerCase()))) {
        serviceIndex = i
        break
      }
    }
    
    // Look for name in messages after service selection
    // Check if we've already asked for name (look for bot messages asking for name)
    const hasAskedForName = messages.some((m: any) => 
      m.role === "assistant" && 
      (m.content?.includes("What's your name") || m.content?.includes("name?"))
    )
    
    const nameMatch = serviceIndex >= 0 
      ? userMessages.slice(serviceIndex + 1).find((m: any) => {
          const content = m.content?.trim() || ""
          // Skip if this is likely not a name
          if (content.length < 2 || content.length > 40) return false
          if (/[\w.-]+@[\w.-]+\.\w+/.test(content)) return false // Is email
          if (/\+?[\d\s-]{10,}/.test(content)) return false // Is phone
          if (/^(telegram|whatsapp|email|connect to whatsapp)$/i.test(content)) return false // Is connection method
          if (serviceOptions.some(s => content.toLowerCase().includes(s.toLowerCase()))) return false // Is service
          if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(content)) return false // Is greeting
          
          // If we've asked for name and this message came after that, it's likely the name
          if (hasAskedForName && content.length >= 2 && content.length <= 40) {
            // More lenient: allow names with some numbers or special chars
            return /^[a-zA-Z\s'.-]+$/.test(content) || /^[a-zA-Z\s]+$/.test(content)
          }
          
          // Otherwise, strict match for name-like content
          return /^[a-zA-Z\s'-]+$/.test(content) && !/\d{3,}/.test(content) // Allow single digits but not phone-like
        })?.content || ""
      : ""

    // Stage 1: Initial greeting (first message or greeting)
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(userMessage.trim())
    if (messageCount === 1 || (messageCount === 2 && isGreeting && !hasService)) {
      botResponse = "OPTIONS:Hi! How Can PIVCOR Help You today? 🚀|Digital Ecosystem Strategy|Web App Development|Mobile App Development|Blockchain & Web3 Solutions|AI Automations & SaaS|Headless E-Commerce"
    }
    // Stage 2: Identify service they need
    else if (!hasService) {
      botResponse = "OPTIONS:Great! What service are you interested in?|Digital Ecosystem Strategy|Web App Development|Mobile App Development|Blockchain & Web3 Solutions|AI Automations & SaaS|Headless E-Commerce"
    }
    // Stage 3: Get name (if not detected and we have a service)
    // Only ask for name once - check if we've already asked
    if (hasService && !nameMatch && !hasEmail && !hasAskedForName) {
      const service = selectedService || "our services"
      botResponse = `Great choice on ${service}! What's your name? 👋`
    }
    // Stage 4: Get email address (we have name or we've asked for it)
    else if (hasService && (nameMatch || hasAskedForName) && !hasEmail) {
      const service = selectedService || "our services"
      const greeting = nameMatch ? `Nice to meet you, ${nameMatch}!` : "Nice to meet you!"
      botResponse = `${greeting} To send you more details about ${service}, I'll need your email address. What's your email? 📧`
    }
    // Stage 5: Lead ready - we have service, name, and email
    else if (hasService && (nameMatch || hasAskedForName) && hasEmail) {
      // Extract all information
      const emailMatch = conversationHistory.match(/([\w.-]+@[\w.-]+\.\w+)/i)
      
      const service = selectedService || "General Inquiry"
      const email = emailMatch?.[1] || ""
      
      // Use detected name, or extract from messages after "What's your name" question
      let finalName = nameMatch
      if (!finalName && hasAskedForName) {
        // Find first user message after name question
        const nameQuestionIndex = messages.findIndex((m: any) => 
          m.role === "assistant" && m.content?.includes("What's your name")
        )
        if (nameQuestionIndex >= 0 && messages[nameQuestionIndex + 1]?.role === "user") {
          const potentialName = messages[nameQuestionIndex + 1].content?.trim() || ""
          // Basic validation
          if (potentialName.length >= 2 && potentialName.length <= 40 && 
              !/[\w.-]+@[\w.-]+\.\w+/.test(potentialName) &&
              !/\+?[\d\s-]{10,}/.test(potentialName)) {
            finalName = potentialName
          }
        }
      }
      const name = finalName || "Lead"

      // Send lead data - hidden from user, but also show confirmation message
      botResponse = `Perfect! Thank you ${name.trim()}. I've received your information about ${service}. Our team will contact you at ${email} soon! 🚀\n\nLEAD_READY:${name.trim()}|${email}||${service}|Email`
    }

    // Stream response as plain text
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
      async start(controller) {
        // Send response in chunks to simulate streaming
        const chunks = botResponse.split('')
        for (let i = 0; i < chunks.length; i++) {
          controller.enqueue(encoder.encode(chunks[i]))
          // Small delay for streaming effect
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 20))
          }
        }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    // Error handling
    const encoder = new TextEncoder()
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("Hi! How Can PIVCOR Help You today? 🚀"))
        controller.close()
      },
    })
    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  }
}
