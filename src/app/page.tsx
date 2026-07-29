"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Phone, ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Clock, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full bg-background selection:bg-accent/20">
      {/* 
        ========================================
        PREMIUM HERO SECTION (STRIPE/LINEAR VIBE)
        ========================================
      */}
      {/* 
        ========================================
        ORIGINAL PREMIUM HERO SECTION
        ========================================
      */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-luxury">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#200122] rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-[#D4AF37] text-sm font-medium border border-[#D4AF37]/30">
              <Sparkles className="w-4 h-4" />
              <span>45+ Years of Vedic Excellence</span>
            </div>
            
            <div className="text-[#D4AF37] font-serif italic text-lg sm:text-xl font-medium tracking-wide">
              "धर्मेण हन्यते व्याधिः, धर्मेण हन्यते ग्रहाः। <br className="hidden sm:block" />
              धर्मेण हन्यते शत्रुः, यतो धर्म ततो जयः।।"
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Discover Your <br />
              <span className="text-gradient-gold">True Path</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              Premium astrological consultations guided by the timeless wisdom of Vedic traditions. Find clarity in career, relationships, and life's journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link 
                href="/services" 
                className="w-full sm:w-auto inline-flex h-14 px-10 text-lg items-center justify-center rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0F2027] shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] border border-[#F3E5AB]/50 transition-all hover-lift"
              >
                  Book Consultation
              </Link>
              <a href="tel:+919892784073" className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white transition-colors hover-lift">
                  <Phone className="w-5 h-5 mr-2" />
                  Call +91 98927 84073
                </Button>
              </a>
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-white/10 mt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F2027] bg-white/10 flex items-center justify-center overflow-hidden shadow-sm">
                    <span className="text-white text-xs font-medium">{i}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-[#D4AF37] gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 text-sm font-medium mt-1">Trusted by 10,000+ Clients</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block lg:-translate-y-16"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-3xl" />
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-full glass-dark border border-[#D4AF37]/30 flex items-center justify-center p-8 shadow-2xl">
               {/* Majestic Swastik container */}
               <div className="w-full h-full rounded-full flex items-center justify-center relative bg-[#D4AF37]/5 shadow-[inset_0_0_50px_rgba(212,175,55,0.05)]">
                  
                  {/* Highly Visible Rotating Mandala Border (Outer) */}
                  <div className="absolute inset-0 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                     <svg viewBox="0 0 100 100" className="w-[95%] h-[95%] text-[#D4AF37]">
                        <defs>
                           <g id="mini-swastik" transform="translate(0, -48) scale(0.08)">
                              <path d="M0,-40 L0,40 M-40,0 L40,0 M0,-40 L40,-40 M40,0 L40,40 M0,40 L-40,40 M-40,0 L-40,-40" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                           </g>
                        </defs>
                        <g transform="translate(50, 50)">
                           {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => (
                             <use key={angle} href="#mini-swastik" transform={`rotate(${angle})`} />
                           ))}
                        </g>
                        {/* Connecting rings */}
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
                        <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 4" className="opacity-70" />
                     </svg>
                  </div>

                  {/* Inner Rotating Star Ring */}
                  <div className="absolute inset-0 flex items-center justify-center animate-[spin_25s_linear_infinite_reverse]">
                     <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] text-[#D4AF37]">
                        <defs>
                           <g id="mini-star" transform="translate(0, -45) scale(0.15)">
                              <path d="M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z" fill="currentColor" />
                           </g>
                        </defs>
                        <g transform="translate(50, 50)">
                           {[0,45,90,135,180,225,270,315].map((angle) => (
                             <use key={angle} href="#mini-star" transform={`rotate(${angle})`} />
                           ))}
                        </g>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                     </svg>
                  </div>
                  
                  {/* Static Center Swastik SVG */}
                  <div className="relative z-10 w-[50%] h-[50%] flex items-center justify-center">
                     <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">
                        {/* Arms */}
                        <path d="M50,15 L50,85 M15,50 L85,50 M50,15 L85,15 M85,50 L85,85 M50,85 L15,85 M15,50 L15,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Dots */}
                        <circle cx="70" cy="30" r="4.5" fill="currentColor" />
                        <circle cx="70" cy="70" r="4.5" fill="currentColor" />
                        <circle cx="30" cy="70" r="4.5" fill="currentColor" />
                        <circle cx="30" cy="30" r="4.5" fill="currentColor" />
                     </svg>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        BENTO BOX SERVICES GRID
        ========================================
      */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-accent font-bold tracking-widest uppercase text-sm">Enterprise-Grade Expertise</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">Premium Consultations</h3>
            <p className="text-foreground/70 text-lg">Detailed analysis and practical remedies tailored specifically to your unique birth chart.</p>
          </div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: "Janam Kundli", desc: "Comprehensive birth chart analysis and life predictions covering all major aspects of your future.", icon: "📜", span: "lg:col-span-2" },
              { title: "Kundli Matching", desc: "Detailed compatibility check for a prosperous, harmonious marriage.", icon: "❤️", span: "lg:col-span-1" },
              { title: "Career & Business", desc: "Strategic guidance for professional growth, investments, and business success.", icon: "💼", span: "lg:col-span-1" },
              { title: "Health Guidance", desc: "Astrological insights into physical and mental well-being with specific remedies.", icon: "🌿", span: "lg:col-span-1" },
              { title: "Vastu & Gemstones", desc: "Harmonize your environment and balance planetary influences with authentic stones.", icon: "💎", span: "lg:col-span-1" },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group relative overflow-hidden rounded-3xl bg-background border border-border p-8 hover-lift shadow-sm ${service.span}`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                  <span className="text-9xl">{service.icon}</span>
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-primary mb-3">{service.title}</h4>
                  <p className="text-foreground/70 mb-8 flex-1 text-lg leading-relaxed">{service.desc}</p>
                  
                  <Link href="/services" className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors group/link w-fit outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        ABOUT SECTION (APPLE-STYLE CLEAN)
        ========================================
      */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Premium Image Treatment */}
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface border border-border shadow-premium">
                <Image 
                  src="/acharya.jpg" 
                  alt="Acharya Shri Shiv Kumar Shukla" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                {/* Elegant overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                   <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2">Shri Shiv Kumar Shukla</h3>
                   <p className="text-accent font-medium tracking-wide">Master Vedic Astrologer</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute top-10 -right-8 glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hidden md:block backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl">45+ Years</h4>
                    <p className="text-white/70 text-sm font-medium">Proven Expertise</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-3">About The Master</h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary leading-[1.1] tracking-tight">
                  Guidance rooted in <br/>
                  <span className="text-foreground/50">ancient wisdom.</span>
                </h3>
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Acharya Shri Shiv Kumar Shukla is a highly respected Vedic astrologer with over 45 years of experience. He has transformed the lives of thousands of individuals, families, and businesses by offering practical, hyper-accurate, and strictly confidential consultations.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "100% Confidential", icon: ShieldCheck },
                  { title: "Hyper-Accurate", icon: Star },
                  { title: "Practical Remedies", icon: Sparkles },
                  { title: "Available 24/7", icon: Clock }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-semibold text-primary">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/about" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full inline-block">
                  <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base shadow-premium hover-lift">
                    Read Full Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        FINAL CTA (LINEAR STYLE)
        ========================================
      */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
              Ready to discover <br/> what lies ahead?
            </h2>
            <p className="text-xl text-white/60">
              Join thousands of successful clients who have found clarity and purpose through our premium astrological consultations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-accent text-primary hover:bg-accent/90 font-bold shadow-xl hover-lift">
                  Book Your Session
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent transition-colors">
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
