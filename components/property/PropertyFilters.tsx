import React from "react";
import { Search, SlidersHorizontal, MapPin, Grid, DollarSign, FilterX } from "lucide-react";
import { CurrencyType, CURRENCY_SYMBOLS, CURRENCY_CONVERSIONS, FilterState } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";



interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  currency: CurrencyType;
  maxAvailableBasePrice: number;
}

export default function Filters({ onFilterChange, currency, maxAvailableBasePrice }: FiltersProps) {
  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [type, setType] = React.useState("");
  const [bedrooms, setBedrooms] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [priceInput, setPriceInput] = React.useState<string>("");
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Convert maximum price dynamically for placeholder
  const convertedMaxAvailable = Math.round(maxAvailableBasePrice * CURRENCY_CONVERSIONS[currency]);
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const handleApply = React.useCallback(() => {
    // Parse price if set
    let maxPriceBase: number | null = null;
    if (priceInput.trim() !== "") {
      const parsedPrice = parseFloat(priceInput);
      if (!isNaN(parsedPrice)) {
        // Convert input currency back to USD (base currency)
        maxPriceBase = parsedPrice / CURRENCY_CONVERSIONS[currency];
      }
    }

    onFilterChange({
      search,
      country,
      type,
      bedrooms,
      status,
      maxPrice: maxPriceBase,
    });
  }, [search, country, type, bedrooms, status, priceInput, currency, onFilterChange]);

  const handleReset = () => {
    setSearch("");
    setCountry("");
    setType("");
    setBedrooms("");
    setStatus("");
    setPriceInput("");
    onFilterChange({
      search: "",
      country: "",
      type: "",
      bedrooms: "",
      status: "",
      maxPrice: null,
    });
  };

  // Auto-apply filters when simple selects change
  React.useEffect(() => {
    handleApply();
  }, [country, type, bedrooms, status]);

  return (
    <div className="bg-white border border-clay/10 rounded-sm shadow-xs p-6 mb-8 max-w-7xl mx-auto animate-fade-in" id="listings-filter-panel">
      
      {/* Top Search & Primary controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Keyword Search */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
            Search Residences
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-clay/40" />
            <input
              type="text"
              id="filter-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Lekki, London, Penthouse..."
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              className="w-full bg-marble text-clay pl-10 pr-4 py-2.5 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold"
            />
          </div>
        </div>

        {/* Global Hubs */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
            Global market
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-primary-gold" />
            <select
              id="filter-country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-marble text-clay pl-10 pr-3 py-2.5 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold appearance-none cursor-pointer"
            >
              <option value="">All Markets (Global)</option>
              <option value="Nigeria">Nigeria (Lekki, Ikoyi, Abuja)</option>
              <option value="United Kingdom">United Kingdom (London)</option>
              <option value="United Arab Emirates">UAE (Dubai)</option>
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
            Architectural style
          </label>
          <div className="relative">
            <Grid className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-primary-gold" />
            <select
              id="filter-type-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-marble text-clay pl-10 pr-3 py-2.5 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold appearance-none cursor-pointer"
            >
              <option value="">All Architectures</option>
              <option value="Mansion">Mansion</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
        </div>

        {/* Actions Button */}
        <div className="md:col-span-2 flex space-x-2">
          <button
            type="button"
            onClick={handleApply}
            id="filter-apply-btn"
            className="flex-1 bg-clay text-marble hover:bg-clay/90 py-2.5 px-4 text-xs font-mono uppercase tracking-widest rounded-xs font-semibold duration-150 cursor-pointer text-center"
          >
            Apply
          </button>
          
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2.5 rounded-xs border transition-colors cursor-pointer ${
              showAdvanced ? "bg-primary-gold/15 text-primary-gold border-primary-gold/30" : "bg-marble text-clay border-clay/15 hover:bg-clay/5"
            }`}
            title="Advanced Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Block */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-clay/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Max Price input */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
                  Max Price ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono text-clay/40">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder={`Max: ${convertedMaxAvailable.toLocaleString()}`}
                    className="w-full bg-marble text-clay pl-8 pr-3 py-2 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold font-mono"
                  />
                </div>
              </div>

              {/* Bedrooms Selector */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
                  Bedrooms (Minimum)
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-marble text-clay px-3.5 py-2.5 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold appearance-none cursor-pointer"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                  <option value="6">6+ Bedrooms</option>
                </select>
              </div>

              {/* Listing Status */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-widest text-clay/70 block">
                  Acquisition Type
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-marble text-clay px-3.5 py-2.5 rounded-xs border border-clay/15 text-sm focus:outline-hidden focus:border-primary-gold appearance-none cursor-pointer"
                >
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Purchase</option>
                  <option value="rent">Luxury Rental</option>
                </select>
              </div>

              {/* Clear Filter button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-red-50/50 hover:bg-red-50 text-red-600 border border-red-200/50 hover:border-red-200 text-xs font-mono uppercase tracking-widest py-2.5 rounded-xs duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FilterX className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
