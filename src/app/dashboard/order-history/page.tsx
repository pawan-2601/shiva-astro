"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserAppointments, AppointmentData } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Search, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Appointment = AppointmentData & { id: string };

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      async function loadHistory() {
        try {
          const data = await getUserAppointments(user?.uid || "");
          setAppointments(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      loadHistory();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-border bg-surface hover:bg-surface-hover hover:border-accent/50 shadow-sm transition-all hover-lift">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">Order History</h1>
              <p className="text-foreground/70 font-medium mt-1">Review your past and upcoming consultations.</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm transition-all text-primary"
            />
          </div>
        </div>

        <div className="bg-surface rounded-[2rem] border border-border shadow-premium overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-accent">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-primary">No Order History</h3>
              <p className="text-foreground/60 mb-8 font-medium">You haven't booked any consultations yet.</p>
              <Link href="/services">
                <Button className="h-12 px-8 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift">
                  Browse Services
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background/50 border-b border-border">
                    <th className="p-5 font-bold uppercase tracking-widest text-xs text-foreground/60">Order Details</th>
                    <th className="p-5 font-bold uppercase tracking-widest text-xs text-foreground/60">Date & Time</th>
                    <th className="p-5 font-bold uppercase tracking-widest text-xs text-foreground/60">Amount</th>
                    <th className="p-5 font-bold uppercase tracking-widest text-xs text-foreground/60">Status</th>
                    <th className="p-5 font-bold uppercase tracking-widest text-xs text-foreground/60 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-surface-hover transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-primary">{apt.serviceName}</p>
                        <p className="text-xs text-foreground/50 font-mono mt-1 font-medium">ID: {apt.orderId || apt.id}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-primary">{new Date(apt.appointmentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm font-medium text-foreground/60 mt-0.5">{apt.appointmentTime}</p>
                      </td>
                      <td className="p-5 font-bold text-primary">
                        ₹{apt.price}
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <Button variant="ghost" size="sm" className="text-accent hover:text-accent font-bold hover:bg-accent/10 rounded-full px-4 h-9">
                          View <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
