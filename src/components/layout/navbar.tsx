"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, PhoneCall, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome ? "glass-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA771C] flex items-center justify-center text-[#0F2027] font-serif font-bold text-xl">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-wider text-white">
              SHIVA ASTRO
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">
              Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base text-white/90 font-medium hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button & Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden lg:flex gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>+91 98927 84073</span>
          </Button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-dark rounded-xl border border-[#D4AF37]/20 shadow-xl overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-[#D4AF37]/10">
                    <p className="text-sm font-medium text-white truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-white/60 truncate">{user.email || user.phoneNumber}</p>
                  </div>
                  <Link href="/dashboard" className="px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="px-4 py-2 text-sm text-left text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full glass-dark border-b border-[#D4AF37]/20 shadow-2xl py-6 px-4 md:hidden flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg text-white/90 font-medium p-3 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full mt-4">Book Appointment</Button>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
