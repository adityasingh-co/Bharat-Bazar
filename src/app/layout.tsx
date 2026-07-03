import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Orchids Shop | Modern E-Commerce",
  description: "Shop the latest electronics and fashion.",
};

async function getProfile() {
  const supabase = await createClient()
  
  // Get session from existing cookies - faster than getUser() for layout
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) return null
  
  const user = session.user

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', user.id)
      .single()

    if (profile) return profile

    // Fallback if profile doesn't exist yet but user is logged in
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      role: 'user'
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || 'User',
      role: 'user'
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile()

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="590bf065-6df9-4597-8196-94d0a9664299"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "OrchidsShop", "version": "1.0.0"}'
        />
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar user={profile} />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-zinc-200 py-8 text-center dark:border-zinc-800">
              <p className="text-sm text-zinc-500">© 2025 BHARAT BAZAR. All rights reserved.</p>
            </footer>
          </div>
        </CartProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
