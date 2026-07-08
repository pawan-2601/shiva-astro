"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Clock, MapPin, VenusAndMars, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      async function loadProfile() {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
        } else {
          // Pre-fill with Auth data if no profile document exists yet
          setProfile({
            name: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
          });
        }
        setLoading(false);
      }
      loadProfile();
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await saveUserProfile(user.uid, profile);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

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
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Profile Details</h1>
            <p className="text-foreground/70 text-sm">Manage your personal information and birth details.</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-100/50 border border-green-200 text-green-700' : 'bg-red-100/50 border border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="glass p-8 rounded-3xl border border-black/10 shadow-lg">
            <h2 className="text-xl font-bold mb-6 border-b border-black/10 pb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <input type="text" name="name" value={profile.name || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <input type="email" name="email" value={profile.email || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <input type="tel" name="phone" value={profile.phone || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Default Birth Details */}
          <div className="glass p-8 rounded-3xl border border-[#D4AF37]/20 shadow-lg bg-white/50">
            <h2 className="text-xl font-bold mb-6 border-b border-[#D4AF37]/20 pb-4">Default Birth Details</h2>
            <p className="text-xs text-foreground/50 mb-6">Save these details to automatically pre-fill them during your next booking checkout.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                    <input type="date" name="dob" value={profile.dob || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Time of Birth</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                    <input type="time" name="tob" value={profile.tob || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Place of Birth</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <input type="text" name="pob" value={profile.pob || ""} onChange={handleChange} placeholder="City, State" className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Gender</label>
                <div className="relative">
                  <VenusAndMars className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <select name="gender" value={profile.gender || ""} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all appearance-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-black/10">
              <Button type="submit" className="w-full py-6 text-lg flex items-center justify-center gap-2" disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving Changes..." : "Save Profile Details"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
