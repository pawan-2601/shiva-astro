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
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-10 flex items-center gap-5">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-border bg-surface hover:bg-surface-hover hover:border-accent/50 shadow-sm transition-all hover-lift">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Profile Details</h1>
            <p className="text-foreground/70 font-medium mt-1">Manage your personal information and birth details.</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 mb-8 rounded-xl font-bold text-sm ${message.type === 'success' ? 'bg-green-100/50 border border-green-200 text-green-700' : 'bg-red-100/50 border border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="bg-surface p-10 rounded-[2rem] border border-border shadow-premium">
            <h2 className="text-2xl font-bold mb-8 border-b border-border pb-4 text-primary">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <input type="text" name="name" value={profile.name || ""} onChange={handleChange} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <input type="email" name="email" value={profile.email || ""} onChange={handleChange} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <input type="tel" name="phone" value={profile.phone || ""} onChange={handleChange} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Default Birth Details */}
          <div className="bg-surface p-10 rounded-[2rem] border border-border shadow-premium relative overflow-hidden">
            <h2 className="text-2xl font-bold mb-2 border-b border-border pb-4 text-primary">Default Birth Details</h2>
            <p className="text-sm font-medium text-foreground/60 mb-8 mt-2">Save these details to automatically pre-fill them during your next booking checkout.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <input type="date" name="dob" value={profile.dob || ""} onChange={handleChange} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Time of Birth</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <input type="time" name="tob" value={profile.tob || ""} onChange={handleChange} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Place of Birth</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <input type="text" name="pob" value={profile.pob || ""} onChange={handleChange} placeholder="City, State" className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Gender</label>
                <div className="relative">
                  <VenusAndMars className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <select name="gender" value={profile.gender || ""} onChange={handleChange} className="w-full pl-12 pr-10 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent outline-none transition-all appearance-none font-medium text-primary shadow-sm">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-border">
              <Button type="submit" className="w-full h-16 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift flex items-center justify-center gap-3" disabled={saving}>
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                {saving ? "Saving Changes..." : "Save Profile Details"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
