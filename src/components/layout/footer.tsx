"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <footer className="bg-primary text-primary-foreground pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-8 pr-8">
            <Link href="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg inline-flex">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-[#AA771C] flex items-center justify-center text-primary font-serif font-bold text-2xl shadow-premium">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-wide text-white">
                  SHIVA ASTRO
                </span>
                <span className="text-xs tracking-[0.2em] text-accent font-semibold uppercase">
                  Solutions
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Premium Vedic astrology and spiritual guidance. Empowering you to make informed decisions and navigate life's journey with absolute clarity and confidence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaFacebook, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaYoutube, href: "#" },
                { icon: FaTwitter, href: "#" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-accent hover:text-primary hover:border-accent transition-all hover-lift outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Platform</h3>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "About The Master", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Daily Panchang", href: "#" },
                { label: "Contact Us", href: "/contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-accent transition-colors text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Consultations</h3>
            <ul className="space-y-4">
              {[
                "Janam Kundli Reading", 
                "Kundli Matching", 
                "Career & Business", 
                "Love & Relationships", 
                "Vastu Analysis",
                "Gemstone Therapy"
              ].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-white/60 hover:text-accent transition-colors text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Contact</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <a href="https://google.com/maps/place/KAMDHENU+23+WEST/data=!4m2!3m1!1s0x0:0x85fc7d76975975c2?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm group-hover:text-accent transition-colors leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-block">
                  Office 301, Kamdhenu 23 West,<br />
                  Kopar Khairane, Navi Mumbai,<br />
                  Maharashtra 400710
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+919892784073" className="text-white/60 text-sm hover:text-accent transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-block">+91 98927 84073</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:shivaastrocenter@gmail.com" className="text-white/60 text-sm hover:text-accent transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-block">
                  shivaastrocenter@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Shiva Astro Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/40 font-medium">
            <Link href="#" className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">Refund Policy</Link>
            <Link href="/admin" className="text-accent/70 hover:text-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm flex items-center gap-1">
              Admin Portal <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
