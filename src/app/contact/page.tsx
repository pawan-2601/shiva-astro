import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Shiva Astro Solutions",
  description: "Get in touch with Shiva Astro Solutions for premium Vedic astrology consultations.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 bg-background">
      {/* Header */}
      <section className="bg-gradient-luxury py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We are here to assist you. Reach out to schedule a consultation or ask any questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Get In Touch</h2>
                <p className="text-foreground/70 text-lg">
                  Whether you're looking for a detailed Kundli reading, a quick consultation, or spiritual remedies, our team is ready to help you.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl border border-black/5 bg-white/50">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 text-[#D4AF37]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Phone & WhatsApp</h3>
                  <p className="text-foreground/70">+91 98927 84073</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-black/5 bg-white/50">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 text-[#D4AF37]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Email Us</h3>
                  <p className="text-foreground/70">shivaastrocenter@gmail.com</p>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-black/5 bg-white/50 sm:col-span-2 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Office Address</h3>
                      <p className="text-foreground/70 leading-relaxed mb-4">
                        Office 301, Kamdhenu 23 West, <br />
                        Kopar Khairane, Navi Mumbai, <br />
                        Maharashtra 400710
                      </p>
                      <a href="https://google.com/maps/place/KAMDHENU+23+WEST/data=!4m2!3m1!1s0x0:0x85fc7d76975975c2?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] font-medium text-sm hover:underline">
                        View on Google Maps &rarr;
                      </a>
                    </div>
                  </div>
                  
                  {/* Map Embed */}
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-black/10 shrink-0 sm:w-1/2">
                    <iframe 
                      src="https://maps.google.com/maps?q=Kamdhenu%2023%20West,%20Kopar%20Khairane,%20Navi%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      aria-hidden="false" 
                      tabIndex={0}>
                    </iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-dark p-8 md:p-10 rounded-3xl border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
               <h3 className="text-2xl font-serif font-bold text-white mb-6 relative z-10">Send a Message</h3>
               <form className="space-y-6 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">First Name</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors" placeholder="John" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Last Name</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors" placeholder="Doe" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/80">Email Address</label>
                     <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/80">Subject / Consultation Type</label>
                     <select className="w-full bg-[#1A2536] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors appearance-none">
                        <option>General Inquiry</option>
                        <option>Book Janam Kundli</option>
                        <option>Career Astrology</option>
                        <option>Marriage Matching</option>
                        <option>Other</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/80">Message</label>
                     <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                  <Button className="w-full flex items-center justify-center gap-2 text-lg h-12">
                     <Send className="w-5 h-5" />
                     Send Message
                  </Button>
               </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
