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
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Order History</h1>
              <p className="text-foreground/70 text-sm">Review your past and upcoming consultations.</p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-9 pr-4 py-2 bg-white/50 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            />
          </div>
        </div>

        <div className="glass rounded-3xl border border-black/10 shadow-lg overflow-hidden bg-white/50">
          {appointments.length === 0 ? (
            <div className="p-16 text-center">
              <Clock className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Order History</h3>
              <p className="text-foreground/60 mb-6">You haven't booked any consultations yet.</p>
              <Link href="/services">
                <Button>Browse Services</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 text-sm uppercase tracking-wider text-foreground/60">
                    <th className="p-4 font-medium">Order Details</th>
                    <th className="p-4 font-medium">Date & Time</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{apt.serviceName}</p>
                        <p className="text-xs text-foreground/50 font-mono mt-1">ID: {apt.orderId || apt.id}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{new Date(apt.appointmentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm text-foreground/60">{apt.appointmentTime}</p>
                      </td>
                      <td className="p-4 font-medium">
                        ₹{apt.price}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-[#B4952F] hover:bg-[#D4AF37]/10">
                          View <ExternalLink className="w-3 h-3 ml-1" />
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
