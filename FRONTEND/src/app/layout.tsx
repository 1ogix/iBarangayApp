import type { Metadata } from "next";
import { Inter as FontSans, Poppins as FontHeading } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
});
const fontHeading = FontHeading({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "BrgyGo",
  description: "Digital barangay services portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
