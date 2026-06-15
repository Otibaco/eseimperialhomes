'use client'
import React from "react";
import { CurrencyType, FilterState, Property } from "@/types/types";
import Filters from "../property/PropertyFilters";
import { Compass } from "lucide-react";
import PropertyCard from "../property/PropertyCard";

export default function Propertiespage() {
    const [currency, setCurrency] = React.useState<CurrencyType>("NGN");
    const [loading, setLoading] = React.useState(true);
    const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
    const [comparedProperties, setComparedProperties] = React.useState<Property[]>([]);
    const [properties, setProperties] = React.useState<Property[]>([]);


    const [filters, setFilters] = React.useState<FilterState>({
        search: "",
        country: "",
        type: "",
        bedrooms: "",
        status: "",
        maxPrice: null,
    });
    // Advanced listings filter filter mapping
    const filteredProperties = React.useMemo(() => {
        return properties.filter((prop) => {
            // 1. Search Query
            if (filters.search) {
                const query = filters.search.toLowerCase();
                const matchesTitle = prop.title.toLowerCase().includes(query);
                const matchesLocation = prop.location.toLowerCase().includes(query);
                const matchesType = prop.type.toLowerCase().includes(query);
                const matchesDesc = prop.description.toLowerCase().includes(query);
                if (!matchesTitle && !matchesLocation && !matchesType && !matchesDesc) {
                    return false;
                }
            }

            // 2. Country
            if (filters.country && prop.country !== filters.country) {
                return false;
            }

            // 3. Type
            if (filters.type && prop.type !== filters.type) {
                return false;
            }

            // 4. Status
            if (filters.status && prop.status !== filters.status) {
                return false;
            }

            // 5. Bedrooms
            if (filters.bedrooms && prop.bedrooms < Number(filters.bedrooms)) {
                return false;
            }

            // 6. Max Price
            if (filters.maxPrice && prop.price > filters.maxPrice) {
                return false;
            }

            return true;
        });
    }, [properties, filters]);

    const maxAvailableCalculatedBasePrice = React.useMemo(() => {
        if (properties.length === 0) return 10000000;
        return Math.max(...properties.map(p => p.price));
    }, [properties]);

    const handleCompareToggle = (property: Property) => {
        setComparedProperties((prev) => {
            const exists = prev.find((p) => p.id === property.id);
            if (exists) {
                return prev.filter((p) => p.id !== property.id);
            }
            if (prev.length >= 3) {
                return [...prev.slice(1), property];
            }
            return [...prev, property];
        });
    };
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in" id="catalog-screen-view">

            <div className="space-y-1.5 mb-8">
                <span className="text-primary-gold font-mono tracking-widest text-[10px] uppercase block">
                    Exclusive Inventory Grid ({filteredProperties.length} Properties)
                </span>
                <h1 className="font-display font-medium text-2xl uppercase text-clay">
                    Ese Imperial Signature Catalog
                </h1>
                <p className="text-xs text-clay/55 font-mono max-w-2xl leading-relaxed">
                    Filter list items with high-precision metrics including country hubs, minimum bedrooms, status options, and price bounds converted dynamically in NGN, USD, GBP, or AED.
                </p>
            </div>

            {/* Filter controls panel */}
            <Filters
                onFilterChange={(f) => setFilters(f)}
                currency={currency}
                maxAvailableBasePrice={maxAvailableCalculatedBasePrice}
            />

            {/* Grid display */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-clay/5 rounded-xs aspect-4/5 border border-clay/10" />
                    ))}
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="bg-white border border-clay/10 rounded-sm p-16 text-center max-w-2xl mx-auto space-y-3 font-mono text-xs">
                    <Compass className="h-8 w-8 mx-auto text-primary-gold animate-spin-slow" />
                    <h3 className="font-bold uppercase tracking-wider text-clay">No Residences Found</h3>
                    <p className="text-clay/55 leading-relaxed">
                        Your specific filters returned zero properties in active registries. Try reducing bedrooms requirements or swapping currency pricing margins.
                    </p>
                    <button
                        onClick={() => {
                            setFilters({
                                search: "",
                                country: "",
                                type: "",
                                bedrooms: "",
                                status: "",
                                maxPrice: null,
                            });
                            // Refresh filters
                        }}
                        className="text-primary-gold underline font-bold uppercase block mx-auto text-[10px] cursor-pointer"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((prop) => (
                        <PropertyCard
                            key={prop.id}
                            property={prop}
                            currency={currency}
                            onSelect={(property) => setSelectedProperty(property)}
                            isCompared={comparedProperties.some((p) => p.id === prop.id)}
                            onCompareToggle={handleCompareToggle}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}
