"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Phone, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-luxury">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* We will replace this with an actual Vedic background image later */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#200122] rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
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
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/services" 
                className="w-full sm:w-auto inline-flex h-14 px-10 text-lg items-center justify-center rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0F2027] shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] border border-[#F3E5AB]/50 transition-all"
              >
                  Book Consultation
              </Link>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>Call +91 98927 84073</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-white/10 mt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F2027] bg-white/10 flex items-center justify-center overflow-hidden">
                    <span className="text-white text-xs">{i}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 text-sm mt-1">Trusted by 10,000+ Clients</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-3xl" />
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-full glass-dark border border-[#D4AF37]/30 flex items-center justify-center p-8">
               {/* This is a placeholder for a majestic Zodiac / Astrolabe image */}
               <div className="w-full h-full rounded-full border border-dashed border-[#D4AF37]/50 animate-[spin_60s_linear_infinite] flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                     <span className="font-serif text-[#D4AF37] text-2xl tracking-widest uppercase">Zodiac</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden glass shadow-2xl relative border border-[#D4AF37]/20">
                <Image 
                  src="/acharya.jpg" 
                  alt="Acharya Shri Shiv Kumar Shukla" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 text-center text-white">
                   <h3 className="font-serif text-3xl font-bold mb-2">Shri Shiv Kumar Shukla</h3>
                   <p className="text-[#D4AF37] font-medium">World Renowned Vedic Astrologer</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 glass-dark p-6 rounded-xl border border-[#D4AF37]/20 shadow-xl max-w-xs">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">45+ Years</h4>
                    <p className="text-white/70 text-sm">Of Experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-[#D4AF37] font-semibold tracking-wider uppercase text-sm mb-2">About The Master</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                  Guidance Rooted in <br/> Ancient Vedic Wisdom
                </h3>
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Acharya Shri Shiv Kumar Shukla is a highly respected Vedic astrologer with over 45 years of experience in the field of astrology and spiritual guidance. Throughout his distinguished career, he has guided thousands of individuals and families by offering practical, personalized, and confidential consultations.
              </p>
              <ul className="space-y-4">
                {[
                  "100% Confidential Consultations",
                  "Accurate Janam Kundli Analysis",
                  "Remedies & Spiritual Solutions",
                  "Guidance for Career, Marriage & Health"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="lg" className="mt-4 gap-2">
                <Link href="/about" className="flex items-center gap-2">
                  Read Full Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Snippet */}
      <section className="py-24 bg-gradient-luxury relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-[#D4AF37] font-semibold tracking-wider uppercase text-sm">Premium Services</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Astrological Consultations</h3>
            <p className="text-white/70 text-lg">Detailed analysis and practical remedies for every aspect of your life's journey.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Janam Kundli", desc: "Comprehensive birth chart analysis and life predictions.", icon: "📜" },
              { title: "Kundli Matching", desc: "Detailed compatibility check for a prosperous marriage.", icon: "❤️" },
              { title: "Career Astrology", desc: "Guidance for professional growth and business success.", icon: "💼" },
              { title: "Health Guidance", desc: "Astrological insights into physical and mental well-being.", icon: "🌿" },
              { title: "Vastu Consultation", desc: "Harmonize your home and workplace energy.", icon: "🏛️" },
              { title: "Gemstone Recommendation", desc: "Authentic stones to balance your planetary influences.", icon: "💎" },
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-dark p-8 rounded-2xl border border-[#D4AF37]/20 group hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="text-4xl mb-6">{service.icon}</div>
                <h4 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{service.title}</h4>
                <p className="text-white/70 mb-6">{service.desc}</p>
                <Link href="/services" className="text-[#D4AF37] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Button variant="secondary" size="lg">View All Services</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
