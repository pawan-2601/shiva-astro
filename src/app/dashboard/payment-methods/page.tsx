import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentMethodsPage() {
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
            <h1 className="text-3xl font-serif font-bold text-primary">Payment Methods</h1>
            <p className="text-foreground/70 font-medium mt-1">Manage your saved cards and payment preferences.</p>
          </div>
        </div>

        <div className="bg-surface p-12 md:p-16 rounded-[2.5rem] border border-border shadow-premium text-center max-w-2xl mx-auto mt-12 relative overflow-hidden">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <ShieldCheck className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary">Secured by Razorpay Vault</h2>
          <p className="text-foreground/70 mb-10 text-lg leading-relaxed font-medium">
            For your maximum security and privacy, Shiva Astro Solutions does not store any of your credit card or payment information on our servers. 
            All payment methods are securely saved and managed entirely within the <strong className="text-primary font-bold">Razorpay Secure Vault</strong> during the checkout process.
          </p>

          <div className="bg-accent/5 p-8 rounded-3xl border border-accent/20 flex items-start gap-5 text-left shadow-sm">
            <CreditCard className="w-8 h-8 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-2 text-primary text-lg">How to manage saved cards?</h3>
              <p className="text-foreground/70 font-medium leading-relaxed">
                The next time you book an appointment, the Razorpay checkout window will automatically display your previously used and securely saved cards. You can delete or add new cards directly within that secure window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
