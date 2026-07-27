"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-10 border-t border-[#D4AF37]/20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA771C] flex items-center justify-center text-[#0F2027] font-serif font-bold text-2xl">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-wider text-white">
                  SHIVA ASTRO
                </span>
                <span className="text-xs tracking-[0.2em] text-[#D4AF37] uppercase">
                  Solutions
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              45+ Years of Trusted Vedic Astrology & Spiritual Guidance. Empowering individuals to make informed decisions and navigate life's challenges with confidence.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F2027] transition-colors">
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F2027] transition-colors">
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F2027] transition-colors">
                <FaYoutube className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0F2027] transition-colors">
                <FaTwitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#D4AF37] mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "About Acharya Ji", "Book Consultation", "Daily Panchang", "Blog", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#D4AF37] mb-6">Our Services</h3>
            <ul className="space-y-4">
              {["Janam Kundli", "Kundli Matching", "Career Astrology", "Business Consultation", "Love & Relationship", "Vastu Consultation"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#D4AF37] mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <a href="https://google.com/maps/place/KAMDHENU+23+WEST/data=!4m2!3m1!1s0x0:0x85fc7d76975975c2?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm hover:text-[#D4AF37] transition-colors leading-relaxed">
                  Office 301, Kamdhenu 23 West,<br />
                  Kopar Khairane, Navi Mumbai,<br />
                  Maharashtra 400710
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span className="text-white/80 text-sm">+91 98927 84073</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <a href="mailto:shivaastrocenter@gmail.com" className="text-white/80 text-sm hover:text-[#D4AF37] transition-colors">
                  shivaastrocenter@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Shiva Astro Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors ml-4 border-l border-white/20 pl-4 font-medium">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
