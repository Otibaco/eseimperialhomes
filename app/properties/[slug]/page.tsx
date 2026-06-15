"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import PropertyDetails from "@/components/property/PropertyDetails";
import { Property } from "@/types/types";
import { MOCK_PROPERTIES } from "@/lib/mockProperties";

export default function PropertyPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${encodeURIComponent(slug)}`);
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          // fallback to mock by slug
          const found = MOCK_PROPERTIES.find((p) => p.slug === slug) || null;
          setProperty(found);
        }
      } catch (err) {
        const found = MOCK_PROPERTIES.find((p) => p.slug === slug) || null;
        setProperty(found);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (slug) load();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) return <div className="p-8">Loading property...</div>;
  if (!property) return <div className="p-8">Property not found.</div>;

  return (
    <>
      <PropertyDetails
        property={property}
        currency={"NGN"}
        onLaunchTour={() => router.push(`/properties/${encodeURIComponent(slug)}/tour`)}
      />
    </>
  );
}

