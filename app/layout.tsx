import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ChatWidget from "@/components/chat/chat-widget"
import { SuppressHydrationAttributes } from "@/components/suppress-hydration"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "PIVCOR",
  description: "Pivcor: Building the Core of Your Digital Ecosystem.",
  generator: "Next.js",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof document === 'undefined' || !document) return;
                var extensionPatterns = [/^bis_/, /^__processed_/, /^__reactInternal/];
                function removeAttrs() {
                  try {
                    var root = document.body || document.documentElement;
                    if (!root) return;
                    var walker = document.createTreeWalker(
                      root,
                      NodeFilter.SHOW_ELEMENT,
                      null
                    );
                    var node;
                    while ((node = walker.nextNode())) {
                      if (node && node instanceof Element && node.attributes) {
                        var attrsToRemove = [];
                        for (var i = 0; i < node.attributes.length; i++) {
                          var attr = node.attributes[i];
                          if (attr && attr.name) {
                            for (var j = 0; j < extensionPatterns.length; j++) {
                              if (extensionPatterns[j].test(attr.name)) {
                                attrsToRemove.push(attr.name);
                                break;
                              }
                            }
                          }
                        }
                        attrsToRemove.forEach(function(name) {
                          try {
                            node.removeAttribute(name);
                          } catch(e) {}
                        });
                      }
                    }
                  } catch(e) {}
                }
                function initCleanup() {
                  if (document.body) {
                    removeAttrs();
                    setTimeout(removeAttrs, 0);
                    setTimeout(removeAttrs, 10);
                    setTimeout(removeAttrs, 50);
                  }
                }
                if (document.readyState === 'loading') {
                  if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', initCleanup, false);
                  }
                } else {
                  initCleanup();
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans`} suppressHydrationWarning>
        <SuppressHydrationAttributes />
        <div suppressHydrationWarning>
          <Suspense fallback={null}>{children}</Suspense>
        </div>
        <ChatWidget />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
