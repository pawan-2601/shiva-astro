"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"details" | "otp">("details");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const router = useRouter();
  const { register, setUpRecaptcha } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (authMode === "email") {
        const userCredential = await register(email, password);
        await updateProfile(userCredential.user, { displayName: name });
        router.push("/dashboard");
      } else {
        // Phone Auth - Send OTP
        const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
        const result = await setUpRecaptcha(formattedPhone, "recaptcha-container");
        setConfirmationResult(result);
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
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
      const userCredential = await confirmationResult.confirm(otp);
      await updateProfile(userCredential.user, { displayName: name });
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
            {step === "otp" ? "Verify OTP" : "Begin Your Journey"}
          </h2>
          <p className="mt-3 text-base font-medium text-foreground/60">
            {step === "otp" 
              ? `We sent a code to ${phone}`
              : "Create an account to book consultations and receive personalized insights."}
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {step === "details" ? (
          <>
            <div className="flex gap-2 p-1.5 bg-background rounded-xl border border-border mb-6">
              <button 
                onClick={() => setAuthMode("email")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${authMode === "email" ? "bg-surface shadow-sm text-primary border border-border" : "text-foreground/60 hover:text-primary border border-transparent"}`}
              >
                Use Email
              </button>
              <button 
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${authMode === "phone" ? "bg-surface shadow-sm text-primary border border-border" : "text-foreground/60 hover:text-primary border border-transparent"}`}
              >
                Use Phone
              </button>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleRegister}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {authMode === "email" ? (
                  <>
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
                          className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm"
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
                          className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm"
                          placeholder="••••••••"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm"
                        placeholder="9999999999"
                      />
                    </div>
                    <p className="text-xs font-medium text-foreground/50 mt-2">Include country code (e.g. +91) or we'll assume +91</p>
                  </div>
                )}
              </div>

              {/* Invisible Recaptcha Container */}
              <div id="recaptcha-container"></div>

              <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50" disabled={loading}>
                {loading ? "Processing..." : authMode === "phone" ? "Send OTP" : "Create Account"}
              </Button>
            </form>
          </>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">6-Digit OTP</label>
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
            <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </Button>
            <button 
              type="button" 
              onClick={() => { setStep("details"); setOtp(""); }}
              className="w-full text-sm font-bold text-foreground/60 hover:text-primary mt-4 transition-colors"
            >
              Back to registration
            </button>
          </form>
        )}

        {step === "details" && (
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-sm font-medium text-foreground/60">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-accent hover:underline">
                Sign in securely
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
