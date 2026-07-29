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
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-background">
        <div className="bg-surface p-10 md:p-14 rounded-[2.5rem] border border-border shadow-premium text-center max-w-lg w-full relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 relative z-10" />
           <h2 className="text-4xl font-serif font-bold mb-4 text-primary relative z-10">Payment Successful!</h2>
           <p className="text-foreground/70 mb-10 text-lg relative z-10">
             Your appointment has been securely booked. You will receive an email confirmation and WhatsApp message shortly.
           </p>
           <Link href="/dashboard" className="relative z-10 block">
             <Button className="w-full text-lg py-7 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift">
               Go to Dashboard
             </Button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-background relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-10 text-center md:text-left text-primary tracking-tight">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary & Form */}
          <div className="space-y-8">
            <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b border-border pb-4 text-primary">Order Summary</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-bold uppercase tracking-widest text-xs">Service</span>
                  <span className="font-bold text-primary">{bookingData.service?.title}</span>
                </div>
                {bookingData.date && (
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60 font-bold uppercase tracking-widest text-xs">Date</span>
                    <span className="font-bold text-primary">{bookingData.date.toDateString()}</span>
                  </div>
                )}
                {bookingData.timeSlot && (
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60 font-bold uppercase tracking-widest text-xs">Time</span>
                    <span className="font-bold text-primary">{bookingData.timeSlot}</span>
                  </div>
                )}
                
                <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground/80">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">₹{bookingData.service?.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-6 rounded-[1.5rem] border border-green-500/20 flex items-start gap-4 shadow-sm">
               <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
               <div>
                 <h3 className="font-bold text-green-800 text-lg">100% Secure Payment</h3>
                 <p className="text-sm text-green-700/80 mt-1 font-medium leading-relaxed">Your transaction is protected by industry-leading 256-bit SSL encryption.</p>
               </div>
            </div>
            
            {/* Birth Details Form */}
            <div className="bg-surface p-8 md:p-10 rounded-[2rem] border border-border shadow-premium relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-8 border-b border-border pb-4 text-primary flex items-center justify-between">
                Birth Details
                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Required</span>
              </h2>
              
              {formError && (
                <div className="p-4 mb-6 text-sm font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Client Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm" placeholder="Full Name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                      <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Time of Birth *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                      <input type="time" required value={tob} onChange={(e) => setTob(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Place of Birth *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <input type="text" required value={pob} onChange={(e) => setPob(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium text-primary shadow-sm" placeholder="e.g. Mumbai, Maharashtra" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Gender (Optional)</label>
                  <div className="relative">
                    <VenusAndMars className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full pl-12 pr-10 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none appearance-none font-medium text-primary shadow-sm">
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
          <div className="bg-primary p-10 rounded-[2.5rem] border border-white/10 shadow-2xl h-fit sticky top-28 overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                  <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-white">Payment Portal</h2>
                    <p className="text-sm font-medium text-white/80 mt-1">Cards, UPI, NetBanking, Wallets</p>
                  </div>
               </div>

               {!user && (
                 <div className="mb-8 p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                   <p className="text-sm font-bold text-yellow-400 mb-2">You are checking out as a guest.</p>
                   <Link href="/login?redirect=/checkout" className="text-sm font-bold text-white hover:text-accent transition-colors flex items-center gap-1">
                     Login to save to dashboard <ArrowRight className="w-4 h-4" />
                   </Link>
                 </div>
               )}

               <Button 
                 onClick={handleRazorpayPayment} 
                 disabled={isProcessing}
                 className="w-full h-16 rounded-full text-xl font-bold flex items-center justify-center gap-3 bg-accent text-primary border-none shadow-xl hover:bg-accent/90 hover-lift transition-all disabled:opacity-50 disabled:hover-lift-none disabled:cursor-not-allowed"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="w-6 h-6 animate-spin" />
                     Processing Securely...
                   </>
                 ) : (
                   <>
                     Pay ₹{bookingData.service?.price} Now
                     <ArrowRight className="w-6 h-6" />
                   </>
                 )}
               </Button>

               <div className="mt-8 text-center space-y-4">
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                   By clicking pay, you agree to our Terms of Service & Cancellation Policy.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
