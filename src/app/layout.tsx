import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/theme/provider";
import { ConvexClientProvider } from "@/convex/provider";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "S2C Resume SaaS",
  description: "Professional resume builder for modern careers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <ThemeProvider 
           attribute="class"
           defaultTheme="dark"
           enableSystem
           disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
