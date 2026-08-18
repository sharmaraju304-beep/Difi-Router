"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
