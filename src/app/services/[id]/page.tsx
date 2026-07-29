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
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative bg-background">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8">
          <Link href="/services" className="text-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            &larr; Back to all services
          </Link>
        </div>

        <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-border shadow-premium relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold border border-accent/20 mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Premium Service</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
                {service.title}
              </h1>
            </div>
            
            {/* FIX: Consultation Fee Box (Removed glass-dark, aligned properly, high contrast) */}
            <div className="text-left md:text-right bg-background p-6 rounded-2xl border border-border shadow-sm min-w-[200px] flex flex-col items-start md:items-end">
              <p className="text-xs text-foreground/60 font-bold uppercase tracking-widest mb-1">Consultation Fee</p>
              <p className="text-4xl font-bold text-primary">₹{service.price}</p>
              {service.durationMinutes > 0 && (
                <div className="flex items-center gap-2 mt-3 text-foreground/70 text-sm font-medium">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{service.durationMinutes} Minutes</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10 relative z-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 font-serif text-primary">About this Session</h2>
              <p className="text-foreground/70 leading-relaxed text-lg">
                {service.fullDescription}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 font-serif text-primary">What's Included</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border/50">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <span className="text-foreground/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border relative z-10">
            <Link 
              href={`/book/${service.id}`}
              className="w-full sm:w-auto inline-flex h-14 px-10 text-lg items-center justify-center rounded-full font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-accent text-primary shadow-xl hover:bg-accent/90 hover-lift transition-all gap-2 group"
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
