import ServiceList from "@/components/common/ServiceList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getServices() {
  try {
    const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch services");
    return res.json();
  } catch (error) {
    console.error("Service fetch error:", error);
    return { services: [] };
  }
}

export default async function ServicesPage() {
  const { services = [] } = await getServices();

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", width: "100%" }}>
      <ServiceList services={services} />
    </div>
  );
}