"use client";
import React from "react";
import { MOCK_PROPERTIES } from "@/lib/mockProperties";
import { PropertyComparisonDrawer } from "@/components/property/PropertyComparison";
import { useRouter } from "next/navigation";

export default function ComparePage() {
  const router = useRouter();
  const [comparedIds, setComparedIds] = React.useState<string[]>([]);
  const [comparedProperties, setComparedProperties] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("compared_properties") || "[]";
      const router = useRouter();
      const ids = JSON.parse(raw) as string[];
      setComparedIds(ids);
      const props = ids.map((id) => MOCK_PROPERTIES.find((p) => p.id === id)).filter(Boolean) as any[];
      setComparedProperties(props);
    } catch (err) {
      setComparedIds([]);
      setComparedProperties([]);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compare Properties</h1>
      <PropertyComparisonDrawer
        comparedProperties={comparedProperties}
        onRemove={(p) => {
          const ids = comparedIds.filter((id) => id !== p.id);
          localStorage.setItem("compared_properties", JSON.stringify(ids));
          setComparedIds(ids);
          setComparedProperties(ids.map((id) => MOCK_PROPERTIES.find((m) => m.id === id)).filter(Boolean) as any[]);
        }}
        onClearAll={() => {
          localStorage.removeItem("compared_properties");
          setComparedIds([]);
          setComparedProperties([]);
        }}
        currency={"NGN"}
        onSelect={(p) => {
          const target = p.slug ? p.slug : p.id;
          router.push(`/properties/${encodeURIComponent(target)}`);
        }}
      />
    </div>
  );
}
