"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, ArrowRight, Loader2, CreditCard, User, MapPin, Calendar, Clock, VenusAndMars } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { addAppointment } from "@/lib/firebase/firestore";

export default function CheckoutPage() {
  const router = useRouter();
  const { bookingData, setBirthDetails, clearBooking } = useBooking();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form State
  const [clientName, setClientName] = useState(user?.displayName || "");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [gender, setGender] = useState("");
  const [formError, setFormError] = useState("");

  const isFormValid = clientName && dob && tob && pob;

  useEffect(() => {
    // Redirect if no booking data is present and payment hasn't just succeeded
    if (!bookingData.service && !paymentSuccess) {
      router.push("/services");
    }
    
    // Auto-redirect to dashboard after 4 seconds of successful payment
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, paymentSuccess, router, user]);

  const handleRazorpayPayment = async () => {
    if (!bookingData.service) return;
    if (!isFormValid) {
      setFormError("Please fill out all required birth details before paying.");
      alert("Please scroll down and fill out your Birth Details on the left side before checking out!");
      return;
    }
    setFormError("");
    setIsProcessing(true);

    // Save to context
    const details = { clientName, dob, tob, pob, gender };
    setBirthDetails(details);

    try {
      // 1. Create order on our backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bookingData.service.price,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || "Network response was not ok");
      }

      // 2. Initialize Razorpay
      const options = {
        key: order.key_id, // Sent from backend securely
        amount: order.amount,
        currency: order.currency,
        name: "Shiva Astro Solutions",
        description: bookingData.service.title,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Handle success & save to Firestore
          console.log("Payment Successful:", response.razorpay_payment_id);
          
          // Run database save in the background so it never hangs the UI
          addAppointment({
            clientName,
            email: user?.email || "Guest",
            userId: user?.uid || "Guest",
            serviceId: bookingData.service?.id || "",
            serviceName: bookingData.service?.title || "",
            price: bookingData.service?.price || 0,
            appointmentDate: bookingData.date?.toISOString() || "",
            appointmentTime: bookingData.timeSlot || "",
            dob,
            tob,
            pob,
            gender: gender || "Not Specified",
            paymentId: response.razorpay_payment_id || "",
            orderId: response.razorpay_order_id || "",
            status: "Confirmed",
          }).then((id) => {
            console.log("Saved appointment securely to DB with ID: " + id);
          }).catch((e: any) => {
            console.error("Failed to save appointment to DB", e);
            // Non-blocking alert so we don't freeze the page
            setTimeout(() => alert("Warning: Payment succeeded but failed to save to database. Error: " + (e.message || "Unknown")), 1000);
          });

          setIsProcessing(false);
          setPaymentSuccess(true);
          clearBooking();
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.displayName || "Guest User",
          email: user?.email || "",
          contact: "9999999999", // Placeholder contact
        },
        theme: {
          color: "#D4AF37",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        console.log("Payment cancelled or failed", response.error);
        setIsProcessing(false);
        alert("Payment failed or cancelled. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error("Error launching Razorpay:", error);
      setIsProcessing(false);
      alert("Failed to initialize payment gateway. Please try again.");
    }
  };

  if (!bookingData.service && !paymentSuccess) return null;

  if (paymentSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl text-center max-w-md w-full relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
           <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
           <h2 className="text-3xl font-serif font-bold mb-4">Payment Successful!</h2>
           <p className="text-foreground/70 mb-8">
             Your appointment has been securely booked. You will receive an email confirmation and WhatsApp message shortly.
           </p>
           <Link href="/dashboard">
             <Button className="w-full text-lg py-6">Go to Dashboard</Button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center md:text-left">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border border-black/10 shadow-lg bg-white/50">
              <h2 className="text-xl font-bold mb-6 border-b border-black/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-foreground/70 font-medium">Service</span>
                  <span className="font-semibold text-right">{bookingData.service?.title}</span>
                </div>
                {bookingData.date && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70 font-medium">Date</span>
                    <span className="font-semibold text-right">{bookingData.date.toDateString()}</span>
                  </div>
                )}
                {bookingData.timeSlot && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70 font-medium">Time</span>
                    <span className="font-semibold text-right">{bookingData.timeSlot}</span>
                  </div>
                )}
                
                <div className="pt-6 mt-6 border-t border-black/10 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">₹{bookingData.service?.price}</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-start gap-4">
               <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
               <div>
                 <h3 className="font-semibold text-green-800">100% Secure Payment</h3>
                 <p className="text-sm text-green-700/80 mt-1">Your transaction is protected by industry-leading 256-bit SSL encryption.</p>
               </div>
            </div>
            
            {/* Birth Details Form */}
            <div className="glass p-8 rounded-3xl border border-[#D4AF37]/20 shadow-lg bg-white/50">
              <h2 className="text-xl font-bold mb-6 border-b border-[#D4AF37]/20 pb-4">Birth Details <span className="text-sm text-red-500 font-normal ml-2">*Required</span></h2>
              
              {formError && (
                <div className="p-3 mb-4 text-sm text-red-600 bg-red-100/50 border border-red-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Client Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                    <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="Full Name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                      <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Time of Birth *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                      <input type="time" required value={tob} onChange={(e) => setTob(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Place of Birth (City, State) *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                    <input type="text" required value={pob} onChange={(e) => setPob(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. Mumbai, Maharashtra" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Gender (Optional)</label>
                  <div className="relative">
                    <VenusAndMars className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] outline-none appearance-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section (Mock Razorpay) */}
          <div className="glass-dark p-8 rounded-3xl border border-[#D4AF37]/20 shadow-2xl h-fit text-white">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Pay via Razorpay</h2>
                  <p className="text-xs text-white/60">Cards, UPI, NetBanking, Wallets</p>
                </div>
             </div>

             {!user && (
               <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                 <p className="text-sm text-yellow-400 mb-2">You are checking out as a guest.</p>
                 <Link href="/login?redirect=/checkout" className="text-sm font-bold text-[#F3E5AB] hover:text-white transition-colors">
                   Login to save to your dashboard &rarr;
                 </Link>
               </div>
             )}

             <Button 
               onClick={handleRazorpayPayment} 
               disabled={isProcessing}
               className="w-full py-6 text-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none"
             >
               {isProcessing ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Processing Securely...
                 </>
               ) : (
                 <>
                   Pay ₹{bookingData.service?.price} Now
                   <ArrowRight className="w-5 h-5" />
                 </>
               )}
             </Button>

             <p className="text-center text-xs text-white/50 mt-6">
               By clicking pay, you agree to our Terms of Service and Cancellation Policy.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
