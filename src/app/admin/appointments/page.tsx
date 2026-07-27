"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, Check, X, Search, Loader2 } from "lucide-react";
import { getAppointments, updateAppointmentStatus, AppointmentData } from "@/lib/firebase/firestore";

type Appointment = AppointmentData & { id: string };

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (e) {
      console.error("Failed to load appointments", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled") => {
    try {
      // Optimistic update
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
      await updateAppointmentStatus(id, newStatus);
    } catch (e) {
      console.error("Failed to update status", e);
      // Revert on failure by reloading
      loadAppointments();
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = (apt.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (apt.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Appointments CRM</h1>
          <p className="text-foreground/60 mt-1">Manage all client bookings and birth details.</p>
        </div>
        <button className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          + New Appointment
        </button>
      </div>

      <div className="glass p-6 rounded-3xl border border-black/5 shadow-sm bg-white/50">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by client name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-gray-200 outline-none focus:border-[#D4AF37] appearance-none pr-10 relative bg-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-4 font-semibold px-4">Appt ID & Date</th>
                <th className="pb-4 font-semibold px-4">Client Name</th>
                <th className="pb-4 font-semibold px-4">Service</th>
                <th className="pb-4 font-semibold px-4">Birth Details (DOB, Time, Place)</th>
                <th className="pb-4 font-semibold px-4">Payment</th>
                <th className="pb-4 font-semibold px-4">Status</th>
                <th className="pb-4 font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-4">
                    <p className="font-bold text-gray-900">{apt.displayId || `APT-${apt.id.slice(0, 5).toUpperCase()}`}</p>
                    <p className="text-sm text-gray-500">{new Date(apt.appointmentDate).toDateString()} <br/> {apt.appointmentTime}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-gray-900">{apt.clientName}</p>
                    <p className="text-xs text-gray-400">{apt.gender}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {apt.serviceName}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p><span className="text-gray-400 mr-2">DOB:</span> <span className="font-medium">{apt.dob}</span></p>
                      <p><span className="text-gray-400 mr-2">Time:</span> <span className="font-medium">{apt.tob}</span></p>
                      <p><span className="text-gray-400 mr-2">Place:</span> <span className="font-medium">{apt.pob}</span></p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-gray-900">₹{apt.price || 0}</p>
                    {apt.paymentId && <p className="text-[10px] text-gray-400 font-mono mt-1 w-24 break-all leading-tight" title="Payment ID">{apt.paymentId}</p>}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      apt.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                      apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {apt.status !== "Confirmed" && apt.status !== "Completed" && (
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, "Confirmed")}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" 
                          title="Confirm"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status !== "Cancelled" && (
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, "Cancelled")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" 
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#D4AF37]" />
                    Loading live appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No appointments found matching your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
