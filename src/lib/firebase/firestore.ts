import { db } from "./config";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

export type AppointmentData = {
  userId?: string;
  clientName: string;
  email: string;
  serviceId: string;
  serviceName: string;
  price: number;
  appointmentDate: string;
  appointmentTime: string;
  dob: string;
  tob: string;
  pob: string;
  gender: string;
  paymentId: string;
  orderId: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: any;
};

export const addAppointment = async (data: Omit<AppointmentData, "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (e) {
    console.warn("Error adding document: ", e);
    // Return empty string or handle gracefully so it doesn't crash Next.js
    return "";
  }
};

export const getAppointments = async () => {
  try {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to Date string if needed
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as (AppointmentData & { id: string })[];
  } catch (e) {
    console.warn("Error getting documents: ", e);
    return [];
  }
};

export const getUserAppointments = async (userId: string) => {
  try {
    const { where } = await import("firebase/firestore");
    const q = query(collection(db, "appointments"), where("userId", "==", userId));
    
    // Use a 3-second timeout
    const querySnapshot = await Promise.race([
      getDocs(q),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]) as any;

    const results = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as (AppointmentData & { id: string })[];
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.warn("Error getting user documents: ", e);
    return [];
  }
};

export type UserProfile = {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  gender?: string;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", userId);
    
    // Use a 3-second timeout so the UI doesn't hang forever if Firestore is offline
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]) as any;

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (e) {
    console.warn("Error getting user profile: ", e);
    return null;
  }
};

export const saveUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, data, { merge: true });
  } catch (e) {
    console.warn("Error saving user profile: ", e);
  }
};
