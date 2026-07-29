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
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
        {/* Abstract Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#200122]/5 dark:bg-[#200122]/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm text-sm font-medium hover-lift"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-foreground/80">45+ Years of Vedic Excellence</span>
              <span className="w-px h-4 bg-border mx-2" />
              <span className="text-accent font-semibold flex items-center">
                Book Now <ChevronRight className="w-3 h-3 ml-1" />
              </span>
            </motion.div>
            
            <motion.h1 
              {...fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight leading-[1.1]"
            >
              Clarity for your <br className="hidden md:block" />
              <span className="text-gradient-gold">life's journey.</span>
            </motion.h1>
            
            <motion.p 
              {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}
              className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed"
            >
              Premium astrological consultations guided by timeless Vedic traditions. Make confident decisions in your career, relationships, and health.
            </motion.p>
            
            <motion.div 
              {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <Link 
                href="/services" 
                className="w-full sm:w-auto inline-flex h-14 px-10 text-lg items-center justify-center rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-primary text-primary-foreground hover:bg-primary/90 shadow-premium hover-lift transition-all"
              >
                Book Consultation
              </Link>
              <a href="tel:+919892784073" className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg rounded-full border-border bg-surface hover:bg-surface-hover text-foreground hover-lift shadow-sm">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
            </motion.div>
            
            <motion.div 
              {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-12"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface-hover flex items-center justify-center overflow-hidden shadow-sm">
                    {/* Placeholder for real user avatars */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex text-accent gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground/60 text-sm font-medium mt-1">Trusted by 10,000+ satisfied clients</p>
              </div>
            </motion.div>
          </div>
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
