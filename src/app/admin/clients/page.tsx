"use client";

import { useState } from "react";
import { Search, Mail, Phone, MoreVertical, Calendar } from "lucide-react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastVisit: string;
  status: "Active" | "Inactive";
};

const mockClients: Client[] = [
  {
    id: "CL-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    totalBookings: 3,
    lastVisit: "2026-07-10",
    status: "Active"
  },
  {
    id: "CL-002",
    name: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+91 91234 56789",
    totalBookings: 1,
    lastVisit: "2026-07-11",
    status: "Active"
  },
  {
    id: "CL-003",
    name: "Amit Kumar",
    email: "amitk99@example.com",
    phone: "+91 99887 76655",
    totalBookings: 5,
    lastVisit: "2026-06-25",
    status: "Active"
  },
  {
    id: "CL-004",
    name: "Sneha Gupta",
    email: "sneha.g@example.com",
    phone: "+91 98712 34567",
    totalBookings: 1,
    lastVisit: "2025-12-10",
    status: "Inactive"
  }
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Client Directory</h1>
          <p className="text-foreground/60 mt-1">Manage and view all registered clients.</p>
        </div>
        <button className="px-6 py-2 bg-black text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          Export Data
        </button>
      </div>

      <div className="glass p-6 rounded-3xl border border-black/5 shadow-sm bg-white/50">
        <div className="mb-6 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search clients by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-6 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all bg-white relative group">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 to-[#AA771C]/10 flex items-center justify-center text-2xl font-bold text-[#AA771C] mb-3">
                  {client.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                  client.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="text-center w-1/2 border-r border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Bookings</p>
                  <p className="font-bold text-gray-900">{client.totalBookings}</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Last Visit</p>
                  <p className="font-bold text-gray-900 flex justify-center items-center gap-1">
                     <Calendar className="w-3 h-3" />
                     {new Date(client.lastVisit).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No clients found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
