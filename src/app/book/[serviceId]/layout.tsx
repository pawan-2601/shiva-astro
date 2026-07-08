import { servicesData } from "@/lib/data/services";

export function generateStaticParams() {
  return servicesData.map((service) => ({
    serviceId: service.id,
  }));
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
