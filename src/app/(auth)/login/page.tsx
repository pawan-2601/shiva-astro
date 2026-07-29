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
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="w-full max-w-md space-y-8 bg-surface p-10 rounded-[2rem] border border-border shadow-premium relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 text-accent">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-primary">
            Welcome Back
          </h2>
          <p className="mt-3 text-base font-medium text-foreground/60">
            Sign in to access your cosmic dashboard and personalized insights.
          </p>
        </div>

        <div className="flex gap-2 p-1.5 bg-background rounded-xl border border-border">
          <button 
            onClick={() => { setLoginMethod("email"); setShowOtpInput(false); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${loginMethod === "email" ? "bg-surface shadow-sm text-primary border border-border" : "text-foreground/60 hover:text-primary border border-transparent"}`}
          >
            Email
          </button>
          <button 
            onClick={() => { setLoginMethod("phone"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${loginMethod === "phone" ? "bg-surface shadow-sm text-primary border border-border" : "text-foreground/60 hover:text-primary border border-transparent"}`}
          >
            Phone Number
          </button>
        </div>

        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-medium text-primary shadow-sm outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-medium text-primary shadow-sm outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50" disabled={loading}>
              {loading ? "Signing in..." : "Sign in securely"}
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Phone Number (India)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-medium text-primary shadow-sm outline-none"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div id="recaptcha-container"></div>
                <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50" disabled={loading || !phone}>
                  {loading ? "Sending..." : "Get OTP via SMS"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full px-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-center tracking-widest text-2xl font-bold text-primary shadow-sm outline-none"
                    placeholder="• • • • • •"
                    maxLength={6}
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50" disabled={loading || otp.length < 6}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-sm font-bold text-foreground/60 hover:text-primary mt-4 transition-colors"
                >
                  Entered wrong number? Change it
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-sm font-medium text-foreground/60">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-accent hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
