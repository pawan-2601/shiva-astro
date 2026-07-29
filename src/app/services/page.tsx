"use client";

import Link from "next/link";
import { servicesData } from "@/lib/data/services";
import { Sparkles, Video, Users, FileText, ArrowRight, Clock } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 text-accent">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 tracking-tight">
            Premium Vedic Services
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed font-medium">
            Choose from our highly specialized astrological services to gain clarity, discover your life path, and find peace of mind through ancient Vedic wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium flex flex-col transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                {iconMap[service.icon]}
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-3 text-primary">
                {service.title}
              </h2>
              
              <p className="text-foreground/70 mb-8 flex-grow leading-relaxed">
                {service.shortDescription}
              </p>
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div>
                  <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Duration</p>
                  <p className="font-bold flex items-center gap-1.5 text-primary">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    {service.durationMinutes > 0 ? `${service.durationMinutes} Min` : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Fee</p>
                  <p className="font-bold text-primary text-xl">₹{service.price}</p>
                </div>
              </div>

              <Link 
                href={`/services/${service.id}`} 
                className="w-full inline-flex h-12 px-8 text-base items-center justify-center rounded-full font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-background text-primary border border-border shadow-sm hover:border-accent/50 hover:bg-surface-hover transition-all gap-2 group-hover:bg-accent group-hover:text-primary group-hover:border-accent"
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
