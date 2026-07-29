"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, IndianRupee, TrendingUp, Clock, Loader2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { getAppointments, AppointmentData } from "@/lib/firebase/firestore";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

type Appointment = AppointmentData & { id: string };

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (e) {
        console.error("Failed to load appointments for admin dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute stats
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(apt => {
    try {
      return new Date(apt.appointmentDate).toDateString() === today;
    } catch { return false; }
  });
  
  const pendingReports = appointments.filter(apt => apt.status === "Pending");
  const uniqueClients = new Set(appointments.map(apt => apt.email || apt.clientName)).size;
  
  // Calculate revenue for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const revenueThisMonth = appointments
    .filter(apt => {
      try {
        const aptDate = new Date(apt.createdAt);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear && (apt.status === "Confirmed" || apt.status === "Completed");
      } catch { return false; }
    })
    .reduce((sum, apt) => sum + (Number(apt.price) || 0), 0);

  const stats = [
    { label: "Today's Appointments", value: todaysAppointments.length.toString(), icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", link: "/admin/appointments" },
    { label: "Pending Reports", value: pendingReports.length.toString(), icon: Clock, color: "text-orange-600", bg: "bg-orange-100", link: "/admin/appointments" },
    { label: "Total Clients", value: uniqueClients.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/clients" },
    { label: "Revenue (Month)", value: `₹${revenueThisMonth.toLocaleString()}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-100", link: "/admin/appointments" },
  ];

  // We show up to 5 upcoming appointments (not completed/cancelled)
  const upcomingAppointments = appointments
    .filter(apt => apt.status === "Pending" || apt.status === "Confirmed")
    .slice(0, 5);

  // --- ANALYTICS DATA PROCESSING ---
  const revenueDataMap = new Map<string, number>();
  const serviceDataMap = new Map<string, number>();

  appointments.forEach(apt => {
    // Revenue Data (Confirmed/Completed only)
    if (apt.status === "Confirmed" || apt.status === "Completed") {
      const dateObj = new Date(apt.createdAt);
      // Ensure valid date
      if (!isNaN(dateObj.getTime())) {
        const dateKey = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        revenueDataMap.set(dateKey, (revenueDataMap.get(dateKey) || 0) + (Number(apt.price) || 0));
      }
    }
    
    // Service Popularity Data (All bookings)
    const serviceName = apt.serviceName || "Other";
    // Shorten long names for the chart
    let shortName = serviceName;
    if (serviceName.includes("Kundli (Complete")) shortName = "Kundli Reading";
    if (serviceName.includes("Matching")) shortName = "Matching";
    if (serviceName.includes("Career")) shortName = "Career/Biz";
    if (serviceName.includes("Online")) shortName = "Video Call";
    if (serviceName.includes("Face-to-Face")) shortName = "In-Person";
    
    serviceDataMap.set(shortName, (serviceDataMap.get(shortName) || 0) + 1);
  });

  // Recharts expects an array of objects
  const revenueData = Array.from(revenueDataMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .reverse() // Appointments are desc, we want asc (left to right chronological)
    .slice(-7); // Show last 7 active days

  const serviceData = Array.from(serviceDataMap.entries())
    .map(([name, bookings]) => ({ name, bookings }))
    .sort((a, b) => b.bookings - a.bookings);

  const BAR_COLORS = ['#D4AF37', '#AA771C', '#1E293B', '#64748B', '#CBD5E1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-foreground/60 mt-1">Welcome back, Acharya Ji. Here is what's happening today.</p>
        </div>
        <Link href="/admin/appointments">
          <button className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Manage Appointments
          </button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Link href={stat.link} key={idx} className="block group">
            <div className="glass p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all bg-white/50 h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-foreground/60 font-medium mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Line Chart */}
        <div className="glass p-6 rounded-2xl border border-black/5 shadow-sm bg-white/50">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[#D4AF37] w-5 h-5" />
            <h2 className="text-xl font-bold font-serif">Revenue Trends (Last 7 Days)</h2>
          </div>
          <div className="h-64 w-full">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#AA771C' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Not enough revenue data yet.</div>
            )}
          </div>
        </div>

        {/* Popular Services Bar Chart */}
        <div className="glass p-6 rounded-2xl border border-black/5 shadow-sm bg-white/50">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="text-[#D4AF37] w-5 h-5" />
            <h2 className="text-xl font-bold font-serif">Popular Services</h2>
          </div>
          <div className="h-64 w-full">
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [value, 'Bookings']}
                  />
                  <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Not enough service data yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border border-black/5 shadow-sm bg-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-serif">Today's Appointments</h2>
              <Link href="/admin/appointments" className="text-sm font-semibold text-[#D4AF37] hover:underline">
                View All &rarr;
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-foreground/50 py-4">No upcoming appointments found.</p>
              ) : (
                upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase">
                        {apt.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-[#D4AF37] transition-colors">{apt.clientName}</h4>
                        <p className="text-xs text-foreground/60">{apt.serviceName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{apt.appointmentTime}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-dark p-6 rounded-2xl border border-[#D4AF37]/20 shadow-md text-white">
            <h2 className="text-xl font-bold font-serif mb-4 text-[#D4AF37]">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/appointments" className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium block">
                + Add Manual Appointment
              </Link>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                📄 Generate Kundli Report
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                ✉️ Send Reminder Emails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
