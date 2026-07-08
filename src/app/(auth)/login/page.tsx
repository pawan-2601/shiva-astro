"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, Phone, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const router = useRouter();
  const { setUpRecaptcha } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const result = await setUpRecaptcha(formattedPhone, "recaptcha-container");
      setConfirmationResult(result);
      setShowOtpInput(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-4 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Sign in to access your cosmic dashboard and personalized insights.
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-black/5 rounded-xl">
          <button 
            onClick={() => { setLoginMethod("email"); setShowOtpInput(false); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === "email" ? "bg-white shadow-sm text-foreground" : "text-foreground/60 hover:text-foreground"}`}
          >
            Email
          </button>
          <button 
            onClick={() => { setLoginMethod("phone"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === "phone" ? "bg-white shadow-sm text-foreground" : "text-foreground/60 hover:text-foreground"}`}
          >
            Phone Number
          </button>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100/50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign in securely"}
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Phone Number (India)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div id="recaptcha-container"></div>
                <Button type="submit" className="w-full py-6 text-lg" disabled={loading || !phone}>
                  {loading ? "Sending..." : "Get OTP via SMS"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-3 py-3 text-center tracking-widest text-lg font-semibold border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    placeholder="• • • • • •"
                    maxLength={6}
                  />
                </div>
                <Button type="submit" className="w-full py-6 text-lg" disabled={loading || otp.length < 6}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-sm text-foreground/60 hover:text-foreground mt-2"
                >
                  Entered wrong number? Change it
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-foreground/60">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[#D4AF37] hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
