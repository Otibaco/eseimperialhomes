"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import VirtualTourViewer from "@/components/view/VirtualTourViewer";
import { MOCK_PROPERTIES } from "@/lib/mockProperties";

export default function PropertyTourPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [property, setProperty] = React.useState<any | null>(null);

  React.useEffect(() => {
    const found = MOCK_PROPERTIES.find((p) => p.slug === slug) || null;
    setProperty(found);
  }, [slug]);

  if (!property) return <div className="p-6">Tour not available.</div>;

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-4 underline">Back</button>
      <VirtualTourViewer
        scenes={property.virtualTour || []}
        propertyName={property.title}
        onClose={() => router.back()}
      />
    </div>
  );
}
