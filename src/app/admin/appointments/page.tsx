"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, Check, X, Search, Loader2, Plus, Info, Save } from "lucide-react";
import { getAppointments, updateAppointmentStatus, updateAppointmentNotes, addAppointment, AppointmentData } from "@/lib/firebase/firestore";

type Appointment = AppointmentData & { id: string };

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Overlays state
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // New Appointment Form State
  const [newApptData, setNewApptData] = useState({
    clientName: "",
    email: "",
    serviceName: "Janam Kundli (Complete Life Reading)",
    price: 1100,
    appointmentDate: "",
    appointmentTime: "",
    dob: "",
    tob: "",
    pob: "",
    gender: "Male"
  });
  const [creating, setCreating] = useState(false);

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
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
      await updateAppointmentStatus(id, newStatus);
    } catch (e) {
      console.error("Failed to update status", e);
      loadAppointments();
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    setSavingNotes(true);
    try {
      await updateAppointmentNotes(selectedAppointment.id, drawerNotes);
      setAppointments(prev => prev.map(apt => apt.id === selectedAppointment.id ? { ...apt, adminNotes: drawerNotes } : apt));
      setSelectedAppointment({ ...selectedAppointment, adminNotes: drawerNotes });
    } catch (e) {
      console.error("Failed to save notes", e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await addAppointment({
        ...newApptData,
        serviceId: "manual",
        paymentId: "OFFLINE_PAYMENT",
        orderId: "OFFLINE",
        status: "Confirmed", // auto confirm manual bookings
      });
      setIsNewAppointmentModalOpen(false);
      loadAppointments(); // reload to get new displayId
      setNewApptData({
        clientName: "", email: "", serviceName: "Janam Kundli (Complete Life Reading)", price: 1100,
        appointmentDate: "", appointmentTime: "", dob: "", tob: "", pob: "", gender: "Male"
      });
    } catch (e) {
      console.error("Failed to create appointment", e);
    } finally {
      setCreating(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = (apt.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (apt.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Appointments CRM</h1>
          <p className="text-foreground/60 mt-1">Manage all client bookings and birth details.</p>
        </div>
        <button 
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="px-6 py-2 bg-[#D4AF37] flex items-center gap-2 text-black font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Appointment
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
                <th className="pb-4 font-semibold px-4">Birth Details</th>
                <th className="pb-4 font-semibold px-4">Payment</th>
                <th className="pb-4 font-semibold px-4">Status</th>
                <th className="pb-4 font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-100 hover:bg-[#D4AF37]/5 transition-colors group cursor-pointer" onClick={() => { setSelectedAppointment(apt); setDrawerNotes(apt.adminNotes || ""); }}>
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
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedAppointment(apt); setDrawerNotes(apt.adminNotes || ""); }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" 
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
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
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#D4AF37]" />
                    Loading live appointments...
                  </td>
                </tr>
              )}
              {!loading && filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Notes Drawer */}
      {selectedAppointment && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedAppointment(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-[#D4AF37]/30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
              <div>
                <h2 className="text-xl font-bold font-serif">{selectedAppointment.clientName}</h2>
                <p className="text-sm text-gray-500 font-mono mt-1">{selectedAppointment.displayId || `APT-${selectedAppointment.id.slice(0, 5).toUpperCase()}`}</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Service Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900 mb-1">{selectedAppointment.serviceName}</p>
                  <p className="text-sm text-gray-600">{new Date(selectedAppointment.appointmentDate).toDateString()} at {selectedAppointment.appointmentTime}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium">₹{selectedAppointment.price}</span>
                    <span className="text-[10px] text-gray-500 font-mono bg-white px-2 py-1 rounded border">{selectedAppointment.paymentId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Client Birth Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase">DOB</p>
                    <p className="font-medium text-sm">{selectedAppointment.dob}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase">Time</p>
                    <p className="font-medium text-sm">{selectedAppointment.tob}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase">Place of Birth</p>
                    <p className="font-medium text-sm">{selectedAppointment.pob}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2 flex justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Email</p>
                      <p className="font-medium text-sm">{selectedAppointment.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Gender</p>
                      <p className="font-medium text-sm">{selectedAppointment.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Admin Private Notes</h3>
                <textarea 
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add private notes about this client's situation, birth chart details, or follow-ups..."
                  className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm resize-none bg-[#FAFAFA]"
                />
                <button 
                  onClick={handleSaveNotes}
                  disabled={savingNotes || drawerNotes === selectedAppointment.adminNotes}
                  className="mt-3 w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                >
                  {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Manual Booking Modal */}
      {isNewAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNewAppointmentModalOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
              <h2 className="text-xl font-bold font-serif">Manual Appointment Booking</h2>
              <button onClick={() => setIsNewAppointmentModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAppointment} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Name</label>
                    <input required type="text" value={newApptData.clientName} onChange={e => setNewApptData({...newApptData, clientName: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={newApptData.email} onChange={e => setNewApptData({...newApptData, email: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <select value={newApptData.serviceName} onChange={e => setNewApptData({...newApptData, serviceName: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]">
                      <option value="Janam Kundli (Complete Life Reading)">Janam Kundli (Complete Life Reading)</option>
                      <option value="Kundli Matching">Kundli Matching</option>
                      <option value="Career & Business Consultation">Career & Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input required type="number" value={newApptData.price} onChange={e => setNewApptData({...newApptData, price: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Appointment Date</label>
                    <input required type="date" value={newApptData.appointmentDate} onChange={e => setNewApptData({...newApptData, appointmentDate: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Appointment Time</label>
                    <input required type="time" value={newApptData.appointmentTime} onChange={e => setNewApptData({...newApptData, appointmentTime: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Birth Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">DOB</label>
                      <input required type="date" value={newApptData.dob} onChange={e => setNewApptData({...newApptData, dob: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <input required type="time" value={newApptData.tob} onChange={e => setNewApptData({...newApptData, tob: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select value={newApptData.gender} onChange={e => setNewApptData({...newApptData, gender: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium mb-1">Place of Birth</label>
                      <input required type="text" placeholder="City, State" value={newApptData.pob} onChange={e => setNewApptData({...newApptData, pob: e.target.value})} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-[#D4AF37]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsNewAppointmentModalOpen(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
