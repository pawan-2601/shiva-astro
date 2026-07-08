import Link from "next/link";
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, Search, Bell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Shiva Astro Solutions",
  description: "Secure administration panel for Shiva Astro Solutions.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-[#D4AF37]/20 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-wider text-white">
              SHIVA ASTRO
            </span>
            <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-medium mt-1 uppercase">
              Admin Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-medium">Appointments</span>
          </Link>
          <Link href="/admin/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-medium">Clients</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass border-b border-black/5 flex items-center justify-between px-8 sticky top-0 z-10 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4 text-foreground/50">
            <Search className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search appointments, clients..." 
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-64 placeholder:text-foreground/40 text-foreground font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-foreground/60 hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-black/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Acharya Ji</p>
                <p className="text-xs text-foreground/50 font-medium">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA771C] text-white flex items-center justify-center font-serif font-bold shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
