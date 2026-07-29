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
          <h1 className="text-3xl font-serif font-bold text-primary">Appointments CRM</h1>
          <p className="text-foreground/60 mt-1 font-medium">Manage all client bookings and birth details.</p>
        </div>
        <button 
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="px-6 py-2.5 bg-accent flex items-center gap-2 text-primary font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-premium">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <input 
              type="text" 
              placeholder="Search by client name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border focus:border-accent bg-background focus:ring-1 focus:ring-accent outline-none transition-all font-medium shadow-sm text-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-accent" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-3 px-5 rounded-full border border-border outline-none focus:border-accent appearance-none pr-12 relative bg-background font-bold text-primary shadow-sm"
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
              <tr className="border-b border-border text-xs uppercase tracking-widest text-foreground/50 bg-background/50">
                <th className="py-4 font-bold px-5">Appt ID & Date</th>
                <th className="py-4 font-bold px-5">Client Name</th>
                <th className="py-4 font-bold px-5">Service</th>
                <th className="py-4 font-bold px-5">Birth Details</th>
                <th className="py-4 font-bold px-5">Payment</th>
                <th className="py-4 font-bold px-5">Status</th>
                <th className="py-4 font-bold px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-border hover:bg-surface-hover transition-colors group cursor-pointer" onClick={() => { setSelectedAppointment(apt); setDrawerNotes(apt.adminNotes || ""); }}>
                  <td className="py-5 px-5">
                    <p className="font-bold text-primary">{apt.displayId || `APT-${apt.id.slice(0, 5).toUpperCase()}`}</p>
                    <p className="text-sm font-medium text-foreground/60 mt-0.5">{new Date(apt.appointmentDate).toDateString()} <br/> {apt.appointmentTime}</p>
                  </td>
                  <td className="py-5 px-5">
                    <p className="font-bold text-primary">{apt.clientName}</p>
                    <p className="text-xs font-bold text-foreground/50 mt-0.5 uppercase tracking-wider">{apt.gender}</p>
                  </td>
                  <td className="py-5 px-5">
                    <span className="inline-block px-3 py-1.5 bg-background rounded-full text-xs font-bold text-primary border border-border shadow-sm">
                      {apt.serviceName}
                    </span>
                  </td>
                  <td className="py-5 px-5">
                    <div className="text-sm font-medium">
                      <p><span className="text-foreground/50 mr-2 text-xs uppercase tracking-widest">DOB</span> <span className="text-primary">{apt.dob}</span></p>
                      <p><span className="text-foreground/50 mr-2 text-xs uppercase tracking-widest">Place</span> <span className="text-primary">{apt.pob}</span></p>
                    </div>
                  </td>
                  <td className="py-5 px-5">
                    <p className="font-bold text-primary">₹{apt.price || 0}</p>
                    {apt.paymentId && <p className="text-[10px] text-foreground/40 font-mono mt-1 w-24 break-all leading-tight font-bold" title="Payment ID">{apt.paymentId}</p>}
                  </td>
                  <td className="py-5 px-5">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      apt.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                      apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedAppointment(apt); setDrawerNotes(apt.adminNotes || ""); }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm" 
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {apt.status !== "Confirmed" && apt.status !== "Completed" && (
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, "Confirmed")}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm" 
                          title="Confirm"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status !== "Cancelled" && (
                        <button 
                          onClick={() => handleUpdateStatus(apt.id, "Cancelled")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm" 
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
                  <td colSpan={7} className="text-center py-12 text-foreground/50">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                    Loading live appointments...
                  </td>
                </tr>
              )}
              {!loading && filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-medium text-foreground/50">
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
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background">
              <div>
                <h2 className="text-2xl font-bold font-serif text-primary">{selectedAppointment.clientName}</h2>
                <p className="text-sm font-medium text-foreground/50 font-mono mt-1">{selectedAppointment.displayId || `APT-${selectedAppointment.id.slice(0, 5).toUpperCase()}`}</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-border rounded-full transition-colors text-foreground/50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Service Details</h3>
                <div className="bg-background p-5 rounded-2xl border border-border shadow-sm">
                  <p className="font-bold text-primary mb-1 text-lg">{selectedAppointment.serviceName}</p>
                  <p className="text-sm font-medium text-foreground/60">{new Date(selectedAppointment.appointmentDate).toDateString()} at {selectedAppointment.appointmentTime}</p>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-base font-bold text-primary">₹{selectedAppointment.price}</span>
                    <span className="text-[10px] text-foreground/50 font-mono font-bold bg-surface px-2.5 py-1.5 rounded-md border border-border">{selectedAppointment.paymentId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Client Birth Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest mb-1">DOB</p>
                    <p className="font-bold text-primary">{selectedAppointment.dob}</p>
                  </div>
                  <div className="bg-background p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest mb-1">Time</p>
                    <p className="font-bold text-primary">{selectedAppointment.tob}</p>
                  </div>
                  <div className="bg-background p-4 rounded-xl border border-border shadow-sm col-span-2">
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest mb-1">Place of Birth</p>
                    <p className="font-bold text-primary">{selectedAppointment.pob}</p>
                  </div>
                  <div className="bg-background p-4 rounded-xl border border-border shadow-sm col-span-2 flex justify-between">
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-primary">{selectedAppointment.email || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest mb-1">Gender</p>
                      <p className="font-bold text-primary">{selectedAppointment.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Admin Private Notes</h3>
                <textarea 
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add private notes about this client's situation, birth chart details, or follow-ups..."
                  className="w-full h-32 p-4 rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm font-medium resize-none bg-background text-primary shadow-sm"
                />
                <button 
                  onClick={handleSaveNotes}
                  disabled={savingNotes || drawerNotes === selectedAppointment.adminNotes}
                  className="mt-4 w-full h-12 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-md hover-lift"
                >
                  {savingNotes ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
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
          <div className="bg-surface rounded-[2rem] border border-border shadow-2xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-background">
              <h2 className="text-2xl font-bold font-serif text-primary">Manual Booking</h2>
              <button onClick={() => setIsNewAppointmentModalOpen(false)} className="p-2 hover:bg-border rounded-full transition-colors text-foreground/50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAppointment} className="p-6 md:p-8 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Client Name</label>
                    <input required type="text" value={newApptData.clientName} onChange={e => setNewApptData({...newApptData, clientName: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Email</label>
                    <input type="email" value={newApptData.email} onChange={e => setNewApptData({...newApptData, email: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Service</label>
                    <select value={newApptData.serviceName} onChange={e => setNewApptData({...newApptData, serviceName: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all appearance-none">
                      <option value="Janam Kundli (Complete Life Reading)">Janam Kundli (Complete Life Reading)</option>
                      <option value="Kundli Matching">Kundli Matching</option>
                      <option value="Career & Business Consultation">Career & Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Price (₹)</label>
                    <input required type="number" value={newApptData.price} onChange={e => setNewApptData({...newApptData, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-border pt-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Appointment Date</label>
                    <input required type="date" value={newApptData.appointmentDate} onChange={e => setNewApptData({...newApptData, appointmentDate: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Appointment Time</label>
                    <input required type="time" value={newApptData.appointmentTime} onChange={e => setNewApptData({...newApptData, appointmentTime: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-sm font-bold text-primary mb-5 font-serif">Birth Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">DOB</label>
                      <input required type="date" value={newApptData.dob} onChange={e => setNewApptData({...newApptData, dob: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Time</label>
                      <input required type="time" value={newApptData.tob} onChange={e => setNewApptData({...newApptData, tob: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Gender</label>
                      <select value={newApptData.gender} onChange={e => setNewApptData({...newApptData, gender: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all appearance-none">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Place of Birth</label>
                      <input required type="text" placeholder="City, State" value={newApptData.pob} onChange={e => setNewApptData({...newApptData, pob: e.target.value})} className="w-full px-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-accent font-medium text-primary shadow-sm outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-4 border-t border-border pt-6">
                <button type="button" onClick={() => setIsNewAppointmentModalOpen(false)} className="px-6 py-3 border border-border rounded-full font-bold hover:bg-background transition-colors text-primary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all hover-lift flex items-center gap-2 disabled:opacity-50">
                  {creating && <Loader2 className="w-5 h-5 animate-spin" />}
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
