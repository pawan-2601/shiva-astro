"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { servicesData, Service } from "@/lib/data/services";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";


export default function BookingPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { bookingData, setService, setDate, setTimeSlot } = useBooking();
  const [service, setLocalService] = useState<Service | null>(null);
  
  // Date state for simple picker (would normally use a proper Date Picker component)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const foundService = servicesData.find(s => s.id === resolvedParams.serviceId);
    if (!foundService) {
      router.push("/services");
      return;
    }
    setLocalService(foundService);
    setService(foundService);
  }, [resolvedParams.serviceId, router, setService]);

  // Generate time slots based on service duration and office hours
  const availableSlots = useMemo(() => {
    if (!service || !selectedDate || service.durationMinutes === 0) return [];
    
    const slots = [];
    let currentTime = new Date(selectedDate);
    currentTime.setHours(11, 0, 0, 0); // Start at 11:00 AM

    const endTime = new Date(selectedDate);
    endTime.setHours(20, 0, 0, 0); // End at 08:00 PM

    const lunchStart = new Date(selectedDate);
    lunchStart.setHours(13, 0, 0, 0); // 01:00 PM

    const lunchEnd = new Date(selectedDate);
    lunchEnd.setHours(15, 0, 0, 0); // 03:00 PM

    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + service.durationMinutes * 60000);
      
      // Check if slot overlaps with lunch break
      const overlapsWithLunch = 
        (currentTime >= lunchStart && currentTime < lunchEnd) ||
        (slotEndTime > lunchStart && slotEndTime <= lunchEnd) ||
        (currentTime < lunchStart && slotEndTime > lunchEnd);

      if (!overlapsWithLunch && slotEndTime <= endTime) {
        slots.push(
          currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
      
      // Increment by duration
      currentTime = new Date(currentTime.getTime() + service.durationMinutes * 60000);
    }
    return slots;
  }, [service, selectedDate]);

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    setSelectedDate(d);
    setDate(d);
  };

  const handleSlotSelect = (slot: string) => {
    setTimeSlot(slot);
  };

  const handleContinue = () => {
    if (bookingData.service && bookingData.date && (service?.durationMinutes === 0 || bookingData.timeSlot)) {
      router.push("/checkout");
    }
  };

  if (!service) return null;

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-background relative">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-8">
          <Link href={`/services/${service.id}`} className="text-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            &larr; Back to Service Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface p-8 md:p-10 rounded-[2rem] border border-border shadow-premium">
              <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3 text-primary tracking-tight">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                Schedule Session
              </h2>
              
              <div className="space-y-10">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-3">Choose a Date</label>
                  <input 
                    type="date" 
                    onChange={handleDateSelect}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full md:w-1/2 px-5 py-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-medium text-primary shadow-sm outline-none"
                  />
                </div>

                {selectedDate && service.durationMinutes > 0 && (
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-foreground/60 mb-4">Available Time Slots</label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => handleSlotSelect(slot)}
                            className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent hover-lift ${
                              bookingData.timeSlot === slot 
                                ? "bg-accent border-accent text-primary shadow-md" 
                                : "bg-background border-border text-foreground hover:border-accent/50 hover:bg-surface-hover"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/60 font-medium p-4 bg-surface-hover rounded-xl border border-border">
                        No slots available for this date. Please select another.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-premium sticky top-28">
              <h3 className="text-xl font-bold mb-6 border-b border-border pb-4 text-primary">Booking Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Service</p>
                  <p className="font-semibold text-primary text-base leading-tight">{service.title}</p>
                </div>
                
                {bookingData.date && (
                  <div>
                    <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Date</p>
                    <p className="font-semibold text-primary text-sm flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-accent" />
                      {bookingData.date.toDateString()}
                    </p>
                  </div>
                )}

                {bookingData.timeSlot && (
                  <div>
                    <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Time</p>
                    <p className="font-semibold text-primary text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      {bookingData.timeSlot}
                    </p>
                  </div>
                )}
                
                <div className="pt-6 border-t border-border mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-bold text-foreground/70">Total Fee</p>
                    <p className="text-2xl font-bold text-primary">₹{service.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/50 font-medium">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    100% Secure & Confidential
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleContinue} 
                disabled={!bookingData.date || (service.durationMinutes > 0 && !bookingData.timeSlot)}
                className="w-full h-14 rounded-full text-lg font-bold flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover-lift disabled:opacity-50 disabled:hover-lift-none disabled:cursor-not-allowed transition-all"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
