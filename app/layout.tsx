import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import Chatbot from "@/components/chat/Chatbot"
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
      <head suppressHydrationWarning>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8598DQG4ZP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8598DQG4ZP');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof document === 'undefined' || !document) return;
                var extensionPatterns = [/^bis_/, /^__processed_/, /^__reactInternal/];
                function removeAttrs() {
                  try {
                    var root = document.documentElement || document.body;
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
                // Use MutationObserver to catch attributes added dynamically
                var observer = null;
                if (typeof MutationObserver !== 'undefined') {
                  observer = new MutationObserver(function(mutations) {
                    var shouldClean = false;
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes') {
                        var attrName = mutation.attributeName;
                        if (attrName && extensionPatterns.some(function(p) { return p.test(attrName); })) {
                          shouldClean = true;
                        }
                      } else if (mutation.type === 'childList') {
                        shouldClean = true;
                      }
                    });
                    if (shouldClean) {
                      removeAttrs();
                    }
                  });
                }
                
                function startObserving() {
                  if (observer && document.documentElement) {
                    observer.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      childList: true,
                      attributeFilter: null
                    });
                  }
                }
                
                // Run immediately and multiple times to catch attributes injected at different times
                removeAttrs();
                if (document.readyState === 'loading') {
                  if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function() {
                      removeAttrs();
                      setTimeout(removeAttrs, 0);
                      setTimeout(removeAttrs, 10);
                      setTimeout(removeAttrs, 50);
                      startObserving();
                    }, false);
                  }
                  startObserving();
                } else {
                  removeAttrs();
                  setTimeout(removeAttrs, 0);
                  setTimeout(removeAttrs, 10);
                  setTimeout(removeAttrs, 50);
                  startObserving();
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
        <Chatbot />
        <Toaster />
      </body>
    </html>
  )
}
