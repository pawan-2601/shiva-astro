export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // in INR
  durationMinutes: number;
  type: "online" | "offline" | "report";
  icon: string;
  features: string[];
}

export const servicesData: Service[] = [
  {
    id: "online-consultation",
    title: "Online Video Consultation",
    shortDescription: "A comprehensive 30-minute online session to discuss your birth chart and address specific concerns.",
    fullDescription: "Connect directly with Acharya Shri Shiv Kumar Shukla from anywhere in the world. In this 30-minute session, your Janam Kundli will be thoroughly analyzed to provide actionable remedies and insights into your career, relationships, health, and spiritual path.",
    price: 2100,
    durationMinutes: 30,
    type: "online",
    icon: "Video",
    features: [
      "In-depth Kundli Analysis",
      "Career & Financial Guidance",
      "Relationship & Marriage Insights",
      "Personalized Vedic Remedies",
      "Q&A Session"
    ]
  },
  {
    id: "face-to-face-consultation",
    title: "Face-to-Face Consultation",
    shortDescription: "An in-depth 1-hour personal meeting at our Navi Mumbai office for detailed Vedic guidance.",
    fullDescription: "Experience a profound one-on-one consultation with Acharya Ji at our office. This 60-minute session allows for a deep dive into multiple charts (including Navamsha and Dashamsha), intricate Dasha analysis, and detailed discussions about life's major decisions.",
    price: 5100,
    durationMinutes: 60,
    type: "offline",
    icon: "Users",
    features: [
      "Complete Birth Chart Reading",
      "Divisional Charts (Vargas) Analysis",
      "Mahadasha & Antardasha Predictions",
      "Gemstone Recommendations",
      "Detailed Pooja & Mantra Guidance",
      "Bring up to 2 family members' charts"
    ]
  },
  {
    id: "janam-kundli-report",
    title: "Detailed Janam Kundli Report",
    shortDescription: "A fully personalized, comprehensive PDF report covering all aspects of your astrological profile.",
    fullDescription: "Get a highly detailed, 50+ page astrological report manually verified by Acharya Ji. This report covers planetary positions, Yogas, Doshas (like Mangalik or Kaal Sarp), and provides a roadmap for the next 5 years.",
    price: 1100,
    durationMinutes: 0,
    type: "report",
    icon: "FileText",
    features: [
      "Detailed Planetary Degrees & Nakshatras",
      "Sade Sati Analysis",
      "Dosha Identification & Remedies",
      "Yearly Predictions (Next 5 Years)",
      "Delivered via Email within 48 hours"
    ]
  }
];
