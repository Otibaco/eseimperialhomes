import React from "react";
import { X, ArrowRight, Table, Sparkles, Building2, Eye, MapPin, Check, Plus, Trash2 } from "lucide-react";
import { Property, CurrencyType, CURRENCY_SYMBOLS, CURRENCY_CONVERSIONS } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyComparisonProps {
  comparedProperties: Property[];
  onRemove: (p: Property) => void;
  onClearAll: () => void;
  currency: CurrencyType;
  onSelect: (p: Property) => void;
}

export function PropertyComparisonDrawer({
  comparedProperties,
  onRemove,
  onClearAll,
  currency,
  onSelect
}: PropertyComparisonProps) {
  const [showFullModal, setShowFullModal] = React.useState(false);

  if (comparedProperties.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Drawer Row */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 285, damping: 24 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-clay/95 backdrop-blur-md border-t border-primary-gold/30 text-marble shadow-3xl px-4 py-3.5 sm:px-6 md:py-4.5"
        id="property-compare-shelf"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Info section & counter */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-2 bg-primary-gold text-clay rounded-full animate-bounce">
              <Table className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display font-medium text-xs tracking-wider uppercase text-primary-gold flex items-center justify-center md:justify-start gap-1">
                <span>Imperial Comparison Deck</span>
                <span className="text-[10px] bg-primary-gold/10 text-primary-gold border border-primary-gold/20 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {comparedProperties.length}/3
                </span>
              </p>
              <p className="text-[10px] text-marble/60 font-mono hidden sm:block">
                Pin up to 3 select residences to cross-reference dimensions and values
              </p>
            </div>
          </div>

          {/* Compared mini list with images */}
          <div className="flex items-center space-x-3.5 overflow-x-auto max-w-full py-1">
            <AnimatePresence>
              {comparedProperties.map((prop) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xs pl-2 pr-1.5 py-1 flex-shrink-0"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-primary-gold/30"
                  />
                  <span className="text-[10px] font-mono tracking-tight font-medium max-w-[100px] truncate">
                    {prop.title}
                  </span>
                  <button
                    onClick={() => onRemove(prop)}
                    className="p-1 hover:bg-white/10 text-marble/55 hover:text-red-400 rounded-full cursor-pointer transition-colors"
                    title="Remove pinning"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Core actionable options */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-[10px] rounded-xs font-mono tracking-widest uppercase text-marble/60 hover:text-marble border border-white/10 hover:border-white/20 transition-all cursor-pointer w-1/3 md:w-auto"
            >
              Clear
            </button>
            <button
              onClick={() => setShowFullModal(true)}
              className="flex-1 md:flex-none justify-center bg-primary-gold hover:bg-primary-gold-focus text-clay px-5 py-2.5 rounded-xs text-[10px] font-mono font-bold uppercase tracking-widest flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Analyze Side-by-Side</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Side-by-Side Comparison Overlay Modal */}
      <AnimatePresence>
        {showFullModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-clay/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-marble border border-clay/15 rounded-sm shadow-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col justify-between relative p-6 md:p-8"
              id="property-comparison-modal-view"
            >
              {/* Header section */}
              <div className="flex justify-between items-start border-b border-clay/10 pb-5 mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-primary-gold font-mono text-[10px] tracking-widest font-bold uppercase">
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                    <span>Side-by-Side Matrix</span>
                  </div>
                  <h2 className="font-display font-semibold text-xl md:text-2xl tracking-normal text-clay uppercase mt-1">
                    Signature Residential Comparison
                  </h2>
                </div>
                <button
                  onClick={() => setShowFullModal(false)}
                  className="p-2 bg-clay text-marble rounded-full hover:bg-primary-gold hover:text-clay cursor-pointer duration-150 shadow-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Matrix table rendering */}
              <div className="flex-1 overflow-x-auto mb-6">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-clay/10">
                      <th className="py-4 pr-4 uppercase text-[10px] tracking-widest text-clay/55 font-bold w-1/4">
                        Specifications
                      </th>
                      {comparedProperties.map((prop) => (
                        <th key={prop.id} className="py-4 px-4 w-1/4">
                          <div className="space-y-3 min-w-[180px]">
                            <div className="aspect-16/10 rounded-xs overflow-hidden border border-clay/10 relative">
                              <img src={prop.images[0]} alt={prop.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              <button
                                onClick={() => onRemove(prop)}
                                className="absolute top-2 right-2 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md cursor-pointer duration-150"
                                title="Unpin property"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <h4 className="font-display font-medium text-clay text-sm truncate uppercase leading-tight">
                              {prop.title}
                            </h4>
                          </div>
                        </th>
                      ))}
                      {/* Empty columns if less than 3 */}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, idx) => (
                        <th key={idx} className="py-4 px-4 w-1/4 opacity-30">
                          <div className="border border-dashed border-clay/20 rounded-xs aspect-16/10 flex flex-col items-center justify-center text-center p-3 text-[10px] text-clay/55 space-y-1.5 min-w-[180px]">
                            <Plus className="h-4 w-4 text-primary-gold" />
                            <span>Add slot</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {/* Valuations row */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Valuation
                      </td>
                      {comparedProperties.map((prop) => {
                        const valAdjusted = Math.round(prop.price * CURRENCY_CONVERSIONS[currency]);
                        return (
                          <td key={prop.id} className="py-3.5 px-4 font-bold text-sm text-clay">
                            {CURRENCY_SYMBOLS[currency]}{valAdjusted.toLocaleString()}
                            {prop.status === "rent" && <span className="text-[10px] font-normal text-clay/60">/mo</span>}
                          </td>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Geographical region row */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Geographics
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-3.5 px-4 text-clay/80">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3.5 w-3.5 text-primary-gold flex-shrink-0" />
                            <span className="truncate">{prop.location} ({prop.country})</span>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Architecture row */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Architecture
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-3.5 px-4 text-clay/80 uppercase tracking-widest font-bold text-[10px]">
                          {prop.type}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Bedrooms and Baths */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Client Beds / Baths
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-3.5 px-4 text-clay/85">
                          {prop.bedrooms} Bedrooms &bull; {prop.bathrooms} Baths
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Square feet dimensions */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Net Floor Area
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-3.5 px-4 text-clay/85 font-mono">
                          {prop.area.toLocaleString()} SQFT
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Acquisition status */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-3.5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Acquisition type
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-3.5 px-4">
                          <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-3xs border shadow-xs ${
                            prop.status === "sale" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {prop.status === "sale" ? "Purchase" : "Leasing"}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-3.5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                    {/* Amenities list comparison */}
                    <tr className="border-b border-clay/5 hover:bg-clay/5 transition-colors">
                      <td className="py-4 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60 leading-normal align-top pt-4">
                        Appointments & Amenities
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-4 px-4 align-top">
                          <div className="flex flex-col space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {prop.amenities.map((amenity, i) => (
                              <div key={i} className="flex items-center space-x-1.5 text-[10px] text-clay/75">
                                <Check className="h-3.5 w-3.5 text-primary-gold flex-shrink-0" />
                                <span className="truncate">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-4 px-4 text-clay/35 align-top">—</td>
                      ))}
                    </tr>

                    {/* Operational controls row */}
                    <tr className="hover:bg-clay/5">
                      <td className="py-5 pr-4 uppercase font-bold text-[10px] tracking-wider text-clay/60">
                        Inquire Details
                      </td>
                      {comparedProperties.map((prop) => (
                        <td key={prop.id} className="py-5 px-4">
                          <button
                            onClick={() => {
                              onSelect(prop);
                              setShowFullModal(false);
                            }}
                            className="bg-clay hover:bg-primary-gold text-marble hover:text-clay text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-2 rounded-xs transition-colors duration-150 cursor-pointer flex items-center justify-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Inquire</span>
                          </button>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={i} className="py-5 px-4 text-clay/35">—</td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Close footnote footer */}
              <div className="border-t border-clay/10 pt-5 text-center text-[10px] font-mono text-clay/55 leading-relaxed">
                Click <strong className="text-primary-gold">Inquire</strong> to review full regional geographic positioning specs or launch the 3D Virtual Tour.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
