import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentMethodsPage() {
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
            <h1 className="text-3xl font-serif font-bold text-foreground">Payment Methods</h1>
            <p className="text-foreground/70 text-sm">Manage your saved cards and payment preferences.</p>
          </div>
        </div>

        <div className="glass p-12 rounded-3xl border border-black/10 shadow-lg text-center max-w-2xl mx-auto mt-12 bg-white/50">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Secured by Razorpay Vault</h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            For your maximum security and privacy, Shiva Astro Solutions does not store any of your credit card or payment information on our servers. 
            All payment methods are securely saved and managed entirely within the <strong>Razorpay Secure Vault</strong> during the checkout process.
          </p>

          <div className="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/20 flex items-start gap-4 text-left">
            <CreditCard className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1 text-[#D4AF37]">How to manage saved cards?</h3>
              <p className="text-sm text-foreground/70">
                The next time you book an appointment, the Razorpay checkout window will automatically display your previously used and securely saved cards. You can delete or add new cards directly within that secure window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
