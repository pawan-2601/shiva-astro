import { Metadata } from "next";
import { CheckCircle2, Star, Quote } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Acharya Shri Shiv Kumar Shukla | Shiva Astro Solutions",
  description: "Learn more about Acharya Shri Shiv Kumar Shukla, a highly respected Vedic astrologer with over 45 years of experience.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 bg-background">
      {/* Hero Header */}
      <section className="bg-gradient-luxury py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">About Acharya Ji</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Guiding lives through authentic Vedic astrology with complete sincerity, compassion, and confidentiality.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Image Column */}
            <div className="lg:col-span-5 relative sticky top-32">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-surface shadow-premium relative border border-border">
                <Image 
                  src="/acharya.jpg" 
                  alt="Acharya Shri Shiv Kumar Shukla" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-[1.5rem] border border-border shadow-2xl max-w-[280px]">
                <Quote className="w-8 h-8 text-accent mb-4 opacity-50" />
                <p className="text-primary-foreground font-serif italic text-lg leading-snug">
                  "Astrology is a guiding light to make informed decisions."
                </p>
              </div>
            </div>

            {/* Text Column */}
            <div className="lg:col-span-7 space-y-8 pt-8 lg:pt-0">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                Acharya Shri Shiv Kumar Shukla
              </h2>
              
              <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary text-foreground/80 max-w-none font-medium leading-relaxed">
                <p>
                  Acharya Shri Shiv Kumar Shukla is a highly respected Vedic astrologer with over <strong className="text-primary font-bold">45 years of experience</strong> in the field of astrology and spiritual guidance.
                </p>
                <p>
                  Throughout his distinguished career, he has guided thousands of individuals and families by offering practical, personalized, and confidential astrological consultations rooted in the timeless principles of Vedic astrology.
                </p>
                <p>
                  With decades of knowledge, dedicated study, and real-world experience, Acharya Shri Shiv Kumar Shukla provides insightful guidance across a wide range of life concerns, including:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 my-8">
                {[
                  "Career & Business",
                  "Marriage & Relationships",
                  "Education & Health",
                  "Finance & Property",
                  "Family Matters",
                  "Spiritual Growth"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border shadow-sm hover:border-accent/50 transition-all hover-lift">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <span className="font-bold text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="prose prose-lg text-foreground/80 max-w-none font-medium leading-relaxed">
                <p>
                  Every consultation is approached with <strong className="text-primary font-bold">sincerity, compassion, and complete confidentiality</strong>. At Shiva Astro Solutions, the focus is on delivering authentic astrological guidance that empowers individuals to make informed decisions and navigate life's challenges with greater confidence.
                </p>
                <p>
                  Whether you are seeking answers during uncertain times, planning important milestones, or looking for long-term direction, Acharya Shri Shiv Kumar Shukla offers thoughtful guidance based on traditional Vedic astrological principles.
                </p>
                <p>
                  With a reputation built on trust, integrity, and decades of dedicated service, Shiva Astro Solutions serves clients across India and worldwide.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
