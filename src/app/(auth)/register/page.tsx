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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-4 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            {step === "otp" ? "Verify OTP" : "Begin Your Journey"}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            {step === "otp" 
              ? `We sent a code to ${phone}`
              : "Create an account to book consultations and receive personalized insights."}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100/50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {step === "details" ? (
          <>
            <div className="flex p-1 bg-black/5 rounded-xl mb-6">
              <button 
                onClick={() => setAuthMode("email")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === "email" ? "bg-white shadow-sm text-black" : "text-foreground/60 hover:text-black"}`}
              >
                Use Email
              </button>
              <button 
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === "phone" ? "bg-white shadow-sm text-black" : "text-foreground/60 hover:text-black"}`}
              >
                Use Phone
              </button>
            </div>

            <form className="mt-4 space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {authMode === "email" ? (
                  <>
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
                          className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all sm:text-sm"
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
                          className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all sm:text-sm"
                          placeholder="••••••••"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all sm:text-sm"
                        placeholder="9999999999"
                      />
                    </div>
                    <p className="text-xs text-foreground/50 mt-1">Include country code (e.g. +91) or we'll assume +91</p>
                  </div>
                )}
              </div>

              {/* Invisible Recaptcha Container */}
              <div id="recaptcha-container"></div>

              <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                {loading ? "Processing..." : authMode === "phone" ? "Send OTP" : "Create Account"}
              </Button>
            </form>
          </>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">6-Digit OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-4 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] text-center tracking-widest text-lg font-bold outline-none"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </Button>
            <button 
              type="button" 
              onClick={() => { setStep("details"); setOtp(""); }}
              className="w-full text-sm text-foreground/60 hover:text-black mt-2"
            >
              Back to registration
            </button>
          </form>
        )}

        {step === "details" && (
          <div className="text-center mt-6">
            <p className="text-sm text-foreground/60">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#D4AF37] hover:underline">
                Sign in securely
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
