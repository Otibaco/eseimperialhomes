import React from "react";
import { useRouter } from "next/navigation";
import { Bed, Bath, Move, MapPin, Eye, Compass, Pin, CheckCircle2 } from "lucide-react";
import { Property, CurrencyType, CURRENCY_SYMBOLS, CURRENCY_CONVERSIONS } from "@/types/types";
import { motion } from "framer-motion";

interface PropertyCardProps {
  key?: string;
  property: Property;
  currency: CurrencyType;
  onSelect: (property: Property) => void;
  isCompared?: boolean;
  onCompareToggle?: (property: Property) => void;
}

export default function PropertyCard({ 
  property, 
  currency, 
  onSelect,
  isCompared = false,
  onCompareToggle
}: PropertyCardProps) {
  const router = useRouter();
  // Convert price dynamically
  const conversionRate = CURRENCY_CONVERSIONS[currency];
  const convertedPrice = Math.round(property.price * conversionRate);
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  
  // Clean, premium label formatting for price
  const formattedPrice = convertedPrice >= 1000000 
    ? `${(convertedPrice / 1000000).toFixed(2).replace(/\.00$/, "")}M` 
    : convertedPrice.toLocaleString();

  const acquisitionText = property.status === "sale" ? "Purchase" : "Monthly Lease";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-sm overflow-hidden border border-clay/10 shadow-xs hover:shadow-2xl hover:border-primary-gold/60 transition-all duration-300 flex flex-col justify-between h-full"
      id={`property-card-${property.id}`}
    >
      {/* Property Image & badging */}
      <div className="relative aspect-4/3 overflow-hidden bg-clay/5">
        <motion.img
          src={property.images[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811"}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clay/40 via-transparent to-transparent opacity-90 pointer-events-none" />
        
        {/* Badges container */}
        <div className="absolute top-4 left-4 flex flex-col space-y-1.5 items-start z-10">
          {property.featured && (
            <span className="bg-primary-gold text-clay text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-3xs shadow-sm">
              Featured Portfolio
            </span>
          )}
          <span className="bg-clay/90 text-marble text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-3xs border border-white/5">
            {property.type}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex space-x-1.5">
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle(property);
              }}
              className={`p-1.5 rounded-3xs border shadow-xs transition-colors cursor-pointer flex items-center justify-center ${
                isCompared 
                  ? "bg-primary-gold border-primary-gold text-clay font-bold" 
                  : "bg-clay/80 hover:bg-clay text-marble border-white/10"
              }`}
              title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison"}
            >
              <Pin className={`h-3 w-3 ${isCompared ? "rotate-45 fill-current" : ""}`} />
            </button>
          )}

          <span className={`text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-3xs border shadow-xs ${
            property.status === "sale" 
              ? "bg-emerald-950 text-emerald-300 border-emerald-500/30" 
              : "bg-blue-950 text-blue-300 border-blue-500/30"
          }`}>
            {property.status === "sale" ? "For Sale" : "For Lease"}
          </span>
        </div>

        {property.virtualTour && property.virtualTour.length > 0 && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-clay/85 backdrop-blur-md text-marble text-[10px] font-mono px-3 py-1.5 rounded-3xs border border-white/10 z-10">
            <Compass className="h-3 w-3 text-primary-gold animate-spin-slow" />
            <span>3D Virtual Tour Available</span>
          </div>
        )}
      </div>

      {/* Property Information */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Market & Location tag */}
          <div className="flex items-center space-x-1 text-primary-gold font-mono text-[10px] tracking-wider uppercase">
            <MapPin className="h-3.5 w-3.5" />
            <span>{property.location}</span>
          </div>

          <h3 className="font-display font-medium text-lg leading-tight tracking-tight text-clay group-hover:text-primary-gold duration-200 transition-colors">
            {property.title}
          </h3>
          
          <p className="text-xs text-clay/65 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Technical specifications strip */}
        <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-clay/5 text-[11px] font-mono text-clay/75">
          <div className="flex items-center space-x-1.5 justify-center">
            <Bed className="h-3.5 w-3.5 text-primary-gold" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-center border-x border-clay/5">
            <Bath className="h-3.5 w-3.5 text-primary-gold" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-center">
            <Move className="h-3.5 w-3.5 text-primary-gold" />
            <span>{property.area.toLocaleString()} SQFT</span>
          </div>
        </div>

        {/* Pricing and Action alignment */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-clay/50 block">
              {acquisitionText}
            </span>
            <div className="flex items-baseline space-x-0.5">
              <span className="font-display text-xl font-bold text-clay">
                {currencySymbol}{formattedPrice}
              </span>
              {property.status === "rent" && (
                <span className="text-[12px] text-clay/60 font-mono">/mo</span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              // keep backward-compat: call onSelect if provided, but navigate to property page using slug when available
              if (onSelect) onSelect(property);
              const target = property.slug ? property.slug : property.id;
              router.push(`/properties/${encodeURIComponent(target)}`);
            }}
            id={`view-property-details-${property.id}`}
            className="bg-clay hover:bg-primary-gold text-marble hover:text-clay px-4.5 py-2.5 text-[10px] font-mono uppercase tracking-widest font-semibold rounded-xs transition-all duration-300 flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Investigate</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
