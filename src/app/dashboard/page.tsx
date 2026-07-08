"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, Calendar, Settings, Clock, ChevronRight, Loader2 } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Welcome, {user.displayName || user.phoneNumber || "Seeker"}
          </h1>
          <p className="text-foreground/70 mt-2">
            Your personalized dashboard for cosmic guidance and appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass p-8 rounded-3xl border border-[#D4AF37]/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-[#D4AF37] w-5 h-5" />
                  Upcoming Appointments
                </h2>
                <Link href="/services">
                  <Button variant="outline" size="sm">Book New</Button>
                </Link>
              </div>
              
              {dataLoading ? (
                <div className="bg-black/5 rounded-2xl p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#D4AF37]" />
                  <p className="text-sm text-foreground/60">Loading your cosmic journey...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="bg-black/5 rounded-2xl p-8 text-center">
                  <Clock className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <h3 className="font-medium text-lg">No upcoming appointments</h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Book a consultation with Acharya Ji to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="bg-white/60 p-4 rounded-xl border border-black/5 flex justify-between items-center group hover:bg-white transition-colors">
                      <div>
                        <p className="font-bold text-lg">{apt.serviceName}</p>
                        <p className="text-sm text-foreground/60">
                          {new Date(apt.appointmentDate).toDateString()} at {apt.appointmentTime}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-full">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass p-8 rounded-3xl border border-black/10 shadow-lg bg-white/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="text-[#D4AF37] w-5 h-5" />
                Your Kundli Insights
              </h2>
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-6 rounded-2xl border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Generate Free Janam Kundli</h3>
                  <p className="text-sm text-foreground/70 mt-1">Enter your birth details to generate your birth chart.</p>
                </div>
                <Button>Generate</Button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="glass p-6 rounded-3xl border border-black/10 shadow-lg bg-white/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="text-[#D4AF37] w-5 h-5" />
                Account Settings
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard/profile" className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-xl transition-colors text-sm font-medium">
                    Profile Details
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/payment-methods" className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-xl transition-colors text-sm font-medium">
                    Payment Methods
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/order-history" className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-xl transition-colors text-sm font-medium">
                    Order History
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Quick Contact Support */}
            <div className="glass-dark p-6 rounded-3xl border border-[#D4AF37]/20 shadow-xl text-center">
              <h3 className="font-serif font-bold text-lg mb-2">Need Assistance?</h3>
              <p className="text-sm text-foreground/70 mb-4">Our support team is here to help you.</p>
              <Button variant="secondary" className="w-full">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
