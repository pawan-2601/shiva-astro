"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, Calendar, Settings, Clock, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserAppointments, AppointmentData } from "@/lib/firebase/firestore";

type Appointment = AppointmentData & { id: string };

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Fetch user's appointments
      async function fetchMyAppointments() {
        try {
          // We now fetch ONLY this user's appointments instantly from Firestore
          const mine = await getUserAppointments(user.uid);
          setAppointments(mine);
        } catch (e) {
          console.error(e);
        } finally {
          setDataLoading(false);
        }
      }
      fetchMyAppointments();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            Welcome, {user.displayName || user.phoneNumber || "Seeker"}
          </h1>
          <p className="text-foreground/60 text-lg mt-3 font-medium">
            Your personalized dashboard for cosmic guidance and spiritual progress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface p-8 md:p-10 rounded-[2rem] border border-border shadow-premium">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-primary tracking-tight">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Calendar className="w-5 h-5" />
                  </div>
                  Upcoming Appointments
                </h2>
                <Link href="/services" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                  <Button variant="outline" size="sm" className="rounded-full font-bold border-border hover:bg-surface-hover hover:border-accent/50 shadow-sm transition-all hover-lift">
                    Book New
                  </Button>
                </Link>
              </div>
              
              {dataLoading ? (
                <div className="bg-background rounded-2xl p-12 text-center border border-border">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                  <p className="font-medium text-foreground/60">Loading your cosmic journey...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="bg-background rounded-3xl p-12 text-center border border-dashed border-border flex flex-col items-center">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
                    <Clock className="w-8 h-8 text-accent/50" />
                  </div>
                  <h3 className="font-bold text-2xl text-primary mb-2">No upcoming appointments</h3>
                  <p className="text-foreground/60 font-medium mb-8 max-w-md">
                    You haven't scheduled any consultations yet. Begin your journey to absolute clarity today.
                  </p>
                  <Link href="/services" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                    <Button className="rounded-full bg-accent text-primary font-bold px-8 h-12 shadow-xl hover:bg-accent/90 hover-lift flex gap-2">
                      Book a Session <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="bg-background p-6 rounded-2xl border border-border flex flex-col sm:flex-row sm:justify-between sm:items-center group hover:border-accent/50 transition-all hover-lift shadow-sm">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-xs font-bold font-mono text-foreground/40 mb-2 tracking-widest">{apt.displayId || `APT-${apt.id.slice(0, 5).toUpperCase()}`}</p>
                        <p className="font-bold text-xl text-primary mb-1">{apt.serviceName}</p>
                        <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          {new Date(apt.appointmentDate).toDateString()} at {apt.appointmentTime}
                        </p>
                      </div>
                      <span className="self-start sm:self-auto px-4 py-1.5 bg-accent/10 text-accent font-bold text-xs uppercase tracking-widest rounded-full border border-accent/20">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface p-8 md:p-10 rounded-[2rem] border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                Your Kundli Insights
              </h2>
              <div className="bg-gradient-to-br from-background to-accent/5 p-8 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center sm:text-left">
                  <h3 className="font-bold text-xl text-primary">Free Janam Kundli</h3>
                  <p className="font-medium text-foreground/60 mt-2 max-w-sm">Enter your exact birth details to generate your comprehensive Vedic birth chart.</p>
                </div>
                <Button className="rounded-full h-12 px-8 font-bold bg-primary text-primary-foreground shadow-md hover-lift relative z-10 whitespace-nowrap">
                  Generate Now
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary border-b border-border pb-4">
                <Settings className="text-foreground/50 w-5 h-5" />
                Account Settings
              </h2>
              <ul className="space-y-2">
                {[
                  { name: "Profile Details", href: "/dashboard/profile" },
                  { name: "Payment Methods", href: "/dashboard/payment-methods" },
                  { name: "Order History", href: "/dashboard/order-history" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="w-full flex items-center justify-between p-4 bg-background border border-transparent hover:border-border rounded-xl transition-all text-sm font-bold text-foreground/80 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent group">
                      {item.name}
                      <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick Contact Support */}
            <div className="bg-primary p-8 rounded-[2rem] border border-white/10 shadow-xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-serif font-bold text-2xl mb-3 text-white">Need Assistance?</h3>
                <p className="font-medium text-white/60 mb-6 text-sm leading-relaxed">Our support team is here to help you navigate your journey.</p>
                <Button variant="outline" className="w-full rounded-full h-12 font-bold bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
