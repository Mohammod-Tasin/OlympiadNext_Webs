import type { Metadata } from "next";
import { Saira, Anek_Bangla } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "OlympiadNext",
  description: "Registration and login",
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * Automated dual-font system. Both families are exposed as CSS variables on
 * `<html>`; `globals.css` chains them into one `font-family` stack so the
 * browser picks Anek Bangla for Bengali codepoints and Saira for everything
 * else — per glyph, no class switching, no script-detection JS.
 */
// Both are variable fonts: the `wght` axis is loaded whole (covers the
// 300–700 range the UI uses) without pinning discrete weight files.
const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${saira.variable} ${anekBangla.variable}`}>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
