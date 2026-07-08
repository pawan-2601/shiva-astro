"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Service } from "@/lib/data/services";

interface BookingState {
  service: Service | null;
  date: Date | null;
  timeSlot: string | null;
  birthDetails: {
    clientName: string;
    dob: string;
    tob: string;
    pob: string;
    gender: string;
  } | null;
}

interface BookingContextType {
  bookingData: BookingState;
  setService: (service: Service) => void;
  setDate: (date: Date) => void;
  setTimeSlot: (time: string) => void;
  setBirthDetails: (details: BookingState["birthDetails"]) => void;
  clearBooking: () => void;
}

const defaultState: BookingState = {
  service: null,
  date: null,
  timeSlot: null,
  birthDetails: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingState>(defaultState);

  const setService = useCallback((service: Service) => {
    setBookingData((prev) => ({ ...prev, service }));
  }, []);

  const setDate = useCallback((date: Date) => {
    setBookingData((prev) => ({ ...prev, date, timeSlot: null })); // Reset time when date changes
  }, []);

  const setTimeSlot = useCallback((timeSlot: string) => {
    setBookingData((prev) => ({ ...prev, timeSlot }));
  }, []);

  const setBirthDetails = useCallback((details: BookingState["birthDetails"]) => {
    setBookingData((prev) => ({ ...prev, birthDetails: details }));
  }, []);

  const clearBooking = useCallback(() => {
    setBookingData(defaultState);
  }, []);

  return (
    <BookingContext.Provider value={{ bookingData, setService, setDate, setTimeSlot, setBirthDetails, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}
