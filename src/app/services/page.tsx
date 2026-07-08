"use client";

import Link from "next/link";
import { servicesData } from "@/lib/data/services";
import { Sparkles, Video, Users, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-6 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Premium Vedic Services
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Choose from our highly specialized astrological services to gain clarity, discover your life path, and find peace of mind through ancient Vedic wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              className="glass p-8 rounded-3xl border border-[#D4AF37]/20 shadow-xl flex flex-col transition-transform hover:-translate-y-2 duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20">
                {iconMap[service.icon]}
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-3">
                {service.title}
              </h2>
              
              <p className="text-foreground/70 mb-6 flex-grow">
                {service.shortDescription}
              </p>
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/10">
                <div>
                  <p className="text-sm text-foreground/50 font-medium uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-semibold">{service.durationMinutes > 0 ? `${service.durationMinutes} Minutes` : "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/50 font-medium uppercase tracking-wider mb-1">Fee</p>
                  <p className="font-bold text-[#D4AF37] text-lg">₹{service.price}</p>
                </div>
              </div>

              <Link 
                href={`/services/${service.id}`} 
                className="w-full inline-flex h-11 px-8 text-base items-center justify-center rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0F2027] shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] border border-[#F3E5AB]/50 transition-all gap-2"
              >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
