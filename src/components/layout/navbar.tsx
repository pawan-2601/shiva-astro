"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PhoneCall, User, LogOut, ChevronRight } from "lucide-react";
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-premium py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#AA771C] flex items-center justify-center text-primary font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-xl tracking-wide transition-colors ${isScrolled || !isHome ? 'text-primary' : 'text-white'}`}>
              SHIVA ASTRO
            </span>
            <span className="text-[10px] tracking-[0.2em] text-accent font-semibold uppercase">
              Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/50 backdrop-blur-md px-2 py-1 rounded-full border border-border/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : `${isScrolled || !isHome ? 'text-foreground/70 hover:text-primary hover:bg-surface-hover' : 'text-white/80 hover:text-white hover:bg-white/10'}`
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button & Auth */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+919892784073" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
            <Button variant="outline" size="sm" className={`hidden lg:flex gap-2 rounded-full border-border/50 ${!isScrolled && isHome ? 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white' : ''}`}>
              <PhoneCall className="w-4 h-4" />
              <span>+91 98927 84073</span>
            </Button>
          </a>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isScrolled || !isHome 
                    ? 'bg-surface border-border text-primary hover:bg-surface-hover' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                aria-label="User profile"
                aria-expanded={profileDropdownOpen}
              >
                <User className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-surface rounded-2xl border border-border shadow-premium overflow-hidden flex flex-col z-50"
                  >
                    <div className="px-4 py-4 border-b border-border bg-surface-hover/50">
                      <p className="text-sm font-bold text-primary truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-foreground/60 truncate mt-0.5">{user.email || user.phoneNumber}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" className="flex items-center justify-between px-3 py-2 text-sm text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={() => setProfileDropdownOpen(false)}>
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                      <button 
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-600 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                <Button variant="ghost" size="sm" className={`rounded-full font-medium ${!isScrolled && isHome ? 'text-white hover:bg-white/10 hover:text-white' : ''}`}>Login</Button>
              </Link>
              <Link href="/register" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md hover:shadow-lg transition-all hover-lift">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent ${isScrolled || !isHome ? 'text-primary hover:bg-surface-hover' : 'text-white hover:bg-white/10'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium p-4 rounded-xl transition-colors flex items-center justify-between ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-surface-hover'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                    <ChevronRight className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                  </Link>
                );
              })}
              
              <div className="border-t border-border mt-4 pt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 mb-2">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{user.displayName || "User"}</p>
                        <p className="text-sm text-foreground/60">{user.email || user.phoneNumber}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl" variant="outline" size="lg">My Dashboard</Button>
                    </Link>
                    <Button 
                      className="w-full rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none" 
                      variant="outline" 
                      size="lg"
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl" variant="outline" size="lg">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl" size="lg">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
