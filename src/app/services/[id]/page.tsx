import { servicesData } from "@/lib/data/services";
import { notFound } from "next/navigation";
import { Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export function generateStaticParams() {
  return servicesData.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = servicesData.find(s => s.id === id);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | Shiva Astro Solutions`,
    description: service.shortDescription
  };
}



export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = servicesData.find(s => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8">
          <Link href="/services" className="text-foreground/60 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 text-sm font-medium">
            &larr; Back to all services
          </Link>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-[#D4AF37] text-sm font-medium border border-[#D4AF37]/30 mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Premium Service</span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-foreground">
                {service.title}
              </h1>
            </div>
            
            <div className="text-left md:text-right glass-dark p-6 rounded-2xl border border-[#D4AF37]/20 min-w-[200px]">
              <p className="text-sm text-foreground/60 uppercase tracking-wider mb-1">Consultation Fee</p>
              <p className="text-3xl font-bold text-[#D4AF37]">₹{service.price}</p>
              {service.durationMinutes > 0 && (
                <div className="flex items-center gap-2 mt-3 text-foreground/80 text-sm md:justify-end">
                  <Clock className="w-4 h-4" />
                  <span>{service.durationMinutes} Minutes</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 font-serif">About this Session</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                {service.fullDescription}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 font-serif">What's Included</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
                    <span className="text-foreground/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10">
            <Link 
              href={`/book/${service.id}`}
              className="w-full sm:w-auto inline-flex h-14 px-10 text-lg items-center justify-center rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0F2027] shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] border border-[#F3E5AB]/50 transition-all gap-2 group"
            >
                Schedule Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
