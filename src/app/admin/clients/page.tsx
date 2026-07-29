"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, MoreVertical, Calendar, Loader2 } from "lucide-react";
import { getAppointments } from "@/lib/firebase/firestore";

type Client = {
  id: string; // using email or phone as unique id
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastVisit: string;
  status: "Active" | "Inactive";
};

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const appointments = await getAppointments();
        
        // Group appointments by email (or clientName as fallback) to form unique clients
        const clientMap = new Map<string, Client>();

        appointments.forEach(apt => {
          const identifier = apt.email || apt.clientName;
          
          if (!clientMap.has(identifier)) {
            clientMap.set(identifier, {
              id: identifier,
              name: apt.clientName,
              email: apt.email || "No email",
              phone: (apt as any).phone || "No phone", // assuming we might add phone to appointments later, fallback for now
              totalBookings: 1,
              lastVisit: apt.createdAt,
              status: "Active"
            });
          } else {
            const existing = clientMap.get(identifier)!;
            existing.totalBookings += 1;
            // Update last visit if this appointment is newer
            if (new Date(apt.createdAt) > new Date(existing.lastVisit)) {
              existing.lastVisit = apt.createdAt;
            }
          }
        });

        // Set status to Inactive if last visit was more than 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const clientsList = Array.from(clientMap.values()).map(client => ({
          ...client,
          status: new Date(client.lastVisit) < sixMonthsAgo ? "Inactive" as const : "Active" as const
        }));

        setClients(clientsList);
      } catch (e) {
        console.error("Failed to load clients", e);
      } finally {
        setLoading(false);
      }
    }
    
    loadClients();
  }, []);

  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Client Directory</h1>
          <p className="text-foreground/60 mt-1 font-medium">Manage and view all registered clients.</p>
        </div>
        <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          Export Data
        </button>
      </div>

      <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium min-h-[60vh]">
        <div className="mb-8 relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
          <input 
            type="text" 
            placeholder="Search clients by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-background focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-6 rounded-2xl border border-border hover:border-accent/50 hover:shadow-md transition-all bg-background relative group">
                <button className="absolute top-4 right-4 text-foreground/40 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-primary mb-3 uppercase shadow-sm">
                    {client.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg text-primary text-center">{client.name}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-2 ${
                    client.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {client.status}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-foreground/70 font-medium overflow-hidden">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span className="truncate">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70 font-medium overflow-hidden">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 bg-surface rounded-xl border border-border shadow-sm">
                  <div className="text-center w-1/2 border-r border-border">
                    <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1">Bookings</p>
                    <p className="font-bold text-primary">{client.totalBookings}</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1">Last Visit</p>
                    <p className="font-bold text-primary flex justify-center items-center gap-1.5 text-sm">
                       <Calendar className="w-3.5 h-3.5 text-accent" />
                       {new Date(client.lastVisit).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredClients.length === 0 && (
          <div className="text-center py-12 text-foreground/50 font-medium">
            No clients found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
