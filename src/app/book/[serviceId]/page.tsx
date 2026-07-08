"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { servicesData, Service } from "@/lib/data/services";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-8">
          <Link href={`/services/${service.id}`} className="text-foreground/60 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 text-sm font-medium">
            &larr; Back to Service Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 md:p-10 rounded-3xl border border-[#D4AF37]/20 shadow-xl">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
                Select Date & Time
              </h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Choose a Date</label>
                  <input 
                    type="date" 
                    onChange={handleDateSelect}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full md:w-1/2 px-4 py-3 border border-black/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all font-medium text-foreground"
                  />
                </div>

                {selectedDate && service.durationMinutes > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-4">Available Time Slots</label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => handleSlotSelect(slot)}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                              bookingData.timeSlot === slot 
                                ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-md scale-105" 
                                : "glass border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/60">No slots available for this date. Please select another.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-dark p-8 rounded-3xl border border-[#D4AF37]/20 shadow-2xl sticky top-24">
              <h3 className="text-xl font-serif font-bold mb-6 border-b border-[#D4AF37]/20 pb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Service</p>
                  <p className="font-medium text-sm leading-tight">{service.title}</p>
                </div>
                
                {bookingData.date && (
                  <div>
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Date</p>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
                      {bookingData.date.toDateString()}
                    </p>
                  </div>
                )}

                {bookingData.timeSlot && (
                  <div>
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Time</p>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      {bookingData.timeSlot}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-[#D4AF37]/20 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total Fee</p>
                    <p className="text-xl font-bold text-[#D4AF37]">₹{service.price}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleContinue} 
                disabled={!bookingData.date || (service.durationMinutes > 0 && !bookingData.timeSlot)}
                className="w-full py-6 text-lg flex items-center justify-center gap-2"
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
