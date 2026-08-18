"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { WalletModal } from "../wallet/WalletModal";
import { Wallet, ShieldCheck, ArrowRightLeft, Activity, History, LayoutDashboard, Cpu, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, setModalOpen, network } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/builder", label: "Intent Builder", icon: ArrowRightLeft },
    { href: "/execution", label: "Execution", icon: Cpu },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/activity", label: "Live Activity", icon: Activity },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Protocol Title */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 font-mono font-semibold text-zinc-100 transition hover:opacity-90">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-zinc-950 font-bold text-xs tracking-tighter">
                S✦
              </div>
              <span className="text-sm tracking-tight text-zinc-100 font-sans font-medium">Stellar Intents</span>
            </Link>

            {/* Main Nav Items (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition ${
                      active
                        ? "bg-zinc-800 text-zinc-100 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-80" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Network & Wallet & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{network}</span>
            </div>

            {isConnected && address ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800/80 px-2.5 sm:px-3 py-1.5 text-xs font-mono text-zinc-200 transition hover:bg-zinc-700"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {address.slice(0, 4)}...{address.slice(-3)}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 rounded bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 active:scale-95"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Connect</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950/95 px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition ${
                    active
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>
      <WalletModal />
    </>
  );
}

