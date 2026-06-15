import React from "react";
import { X, Bed, Bath, Move, MapPin, ShieldAlert, PhoneCall, Compass, Calendar,MessageSquare,Sparkles,Award,Clock,User,Mail,Phone,CheckCircle,Video
} from "lucide-react";
import { Property, CurrencyType, CURRENCY_SYMBOLS, CURRENCY_CONVERSIONS } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyDetailsModalProps {
  property: Property;
  currency: CurrencyType;
  onClose: () => void;
  onLaunchTour: (property: Property) => void;
}

export default function PropertyDetailsModal({ 
  property, 
  currency, 
  onClose, 
  onLaunchTour 
}: PropertyDetailsModalProps) {
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  
  // Booking Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [tourType, setTourType] = React.useState<"physical" | "virtual">("physical");
  const [comments, setComments] = React.useState("");
  
  // Submit feedback
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  // Convert prices
  const rate = CURRENCY_CONVERSIONS[currency];
  const priceAdjusted = Math.round(property.price * rate);
  const symbol = CURRENCY_SYMBOLS[currency];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !time) {
      setErrorText("Please complete all required fields (Name, Email, Date, and Time Slot)");
      return;
    }
    
    setIsSubmitting(true);
    setErrorText("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          date,
          time,
          type: tourType,
          comments
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setTime("");
        setComments("");
      } else {
        const err = await response.json();
        setErrorText(err.error || "An error occurred while booking. Please try again.");
      }
    } catch (err: any) {
      setErrorText(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-clay/70 backdrop-blur-md z-40 flex items-center justify-center p-4 overflow-y-auto" 
      id="property-details-backdrop"
    >
      
      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-marble border border-clay/15 rounded-sm shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto flex flex-col md:flex-row relative" 
        id="property-details-container"
      >
        
        {/* Close Button top corner */}
        <button
          onClick={onClose}
          id="close-details-modal-btn"
          className="absolute top-4 right-4 z-10 p-2 bg-clay text-marble rounded-full hover:bg-primary-gold hover:text-clay cursor-pointer duration-150 shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left half: Imagery Gallery, Detailed Spec */}
        <div className="md:w-3/5 p-6 md:p-8 space-y-6 border-r border-clay/10 overflow-y-auto max-h-[85vh]">
          
          {/* Main active image view */}
          <div className="relative aspect-16/10 rounded-sm overflow-hidden bg-clay/5">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImageIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={property.images[activeImageIdx]} 
                alt={property.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </AnimatePresence>
            
            <div className="absolute top-4 left-4 flex flex-col space-y-1">
              <span className="bg-primary-gold font-mono text-clay text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-3xs shadow-md">
                Signature Collection
              </span>
            </div>
            
            {/* Image pagination indicator overlay */}
            <span className="absolute bottom-4 right-4 bg-clay/80 text-white font-mono text-[10px] px-2.5 py-1 rounded-sm">
              Image {activeImageIdx + 1} of {property.images.length}
            </span>
          </div>

          {/* Miniature index gallery */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`flex-shrink-0 w-24 aspect-16/10 rounded-sm overflow-hidden border cursor-pointer transition-all ${
                  activeImageIdx === idx ? "border-primary-gold ring-2 ring-primary-gold/15" : "border-clay/10 hover:border-clay/35"
                }`}
              >
                <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Heading parameters */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1 text-primary-gold font-mono text-xs tracking-wider uppercase">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
            
            <h1 className="font-display font-semibold text-2xl tracking-normal text-clay uppercase leading-tight">
              {property.title}
            </h1>

            <div className="flex items-baseline space-x-2">
              <span className="font-display font-medium text-2xl text-clay">
                {symbol}{priceAdjusted.toLocaleString()}
              </span>
              {property.status === "rent" && <span className="text-sm text-clay/55 font-mono">/ Month Lease</span>}
            </div>
          </div>

          {/* Multi-space dimensions banner */}
          <div className="grid grid-cols-3 gap-4 border-y border-clay/10 py-5 text-sm font-mono text-clay/80 bg-clay/5 px-4 rounded-xs">
            <div className="text-center space-y-1">
              <Bed className="h-5 w-5 text-primary-gold mx-auto" />
              <span className="block font-medium">{property.bedrooms} Bedrooms</span>
            </div>
            <div className="text-center space-y-1 border-x border-clay/10">
              <Bath className="h-5 w-5 text-primary-gold mx-auto" />
              <span className="block font-medium">{property.bathrooms} Baths</span>
            </div>
            <div className="text-center space-y-1">
              <Move className="h-5 w-5 text-primary-gold mx-auto" />
              <span className="block font-bold">{property.area.toLocaleString()} SQFT</span>
            </div>
          </div>

          {/* Long Description and architectural overview */}
          <div className="space-y-3 font-sans leading-relaxed text-clay/85 text-xs text-justify">
            <h2 className="font-display font-semibold uppercase text-xs tracking-widest text-clay flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-primary-gold" />
              <span>Property Overview</span>
            </h2>
            <p className="line-height-1.65">{property.description}</p>
          </div>

          {/* List of amenities */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold uppercase text-xs tracking-widest text-clay">
              Premium Appointments
            </h2>
            <div className="grid grid-cols-2 gap-2 text-clay/80 font-mono text-[10px]">
              {property.amenities.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary-gold flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Map Mock Representation */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold uppercase text-xs tracking-widest text-clay">
              Regional Geographic Positioning
            </h3>
            <div className="relative aspect-21/9 bg-zinc-900 border border-clay/10 rounded-xs overflow-hidden flex items-center justify-center p-3">
              {/* Styling a sleek black maps interface */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135242-203876e4c29c?auto=format&fit=crop&w=1200&q=5')] bg-cover" />
              <div className="relative z-10 text-center space-y-2">
                <MapPin className="h-8 w-8 text-primary-gold mx-auto animate-bounce" />
                <div>
                  <span className="text-marble tracking-widest font-mono text-[10px] block uppercase font-semibold">
                    {property.location}
                  </span>
                  <span className="text-marble/50 text-[8px] font-mono block">
                    LAT: 6.4281&deg; N | LNG: 3.4392&deg; E (High Security Enclave)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right half: Virtual Tour Launcher and Tours/Schedule Booking Form */}
        <div className="md:w-2/5 p-6 md:p-8 space-y-6 bg-white overflow-y-auto max-h-[85vh]">
          
          {/* Virtual Tour section - Sleek invitation banner to launch the 3D tour */}
          {property.virtualTour && property.virtualTour.length > 0 ? (
            <div className="bg-clay text-marble p-6 rounded-xs border border-white/5 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-primary-gold font-mono text-[10px] tracking-wider uppercase">
                  <Compass className="h-3.5 w-3.5 animate-spin-slow" />
                  <span>Interactive 3-Dimensional Tour Ready</span>
                </div>
                <h3 className="font-display text-sm font-medium tracking-wide">
                  Experience Virtual Imperial Walkthroughs
                </h3>
              </div>
              
              <p className="text-[11px] text-marble/65 font-mono leading-relaxed">
                Step inside this masterpiece right now. Take high-precision tours of rooms and surroundings in vivid 3D space with absolute fidelity.
              </p>
              
              <button
                onClick={() => onLaunchTour(property)}
                id="modal-launch-tour-btn"
                className="w-full bg-primary-gold hover:bg-primary-gold-focus text-clay py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Interactive Tour</span>
              </button>
            </div>
          ) : (
            <div className="bg-amber-950/20 text-clay border border-amber-500/20 p-5 rounded-xs space-y-2 font-mono">
              <div className="flex items-center space-x-2 text-amber-600">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-xs uppercase font-bold">Contact Office Directly</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Virtual Tour scanning process is currently in development for this specific property. Please schedule a physical inquiry with the designated agent below.
              </p>
            </div>
          )}

          {/* Booking Scheduler Form */}
          <div className="space-y-4 pt-2 border-t border-clay/10">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-clay flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary-gold" />
                <span>Schedule Inspection Tour</span>
              </h3>
              <p className="text-[10px] text-clay/55 font-mono">
                Select suitable time slots for digital/physical client visits
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-5 rounded-xs text-center space-y-3 animate-fade-in font-mono text-xs">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold uppercase tracking-wider">Booking Scheduled!</h4>
                <p className="leading-relaxed text-[11px]">
                  Your private viewing reservation request for <strong>{property.title}</strong> has been parsed securely. An executive partner will correspond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 underline text-[10px] uppercase font-bold block mx-auto cursor-pointer"
                >
                  Schedule Another Viewing
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5" id="booking-scheduling-form">
                
                {/* Tour Type selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTourType("physical")}
                    className={`py-2 px-3 text-[10px] font-mono uppercase tracking-widest rounded-xs border text-center cursor-pointer transition-colors ${
                      tourType === "physical"
                        ? "bg-clay text-marble border-clay shadow-xs font-bold"
                        : "bg-marble text-clay border-clay/15 hover:bg-clay/5"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <User className="h-3 w-3" />
                      <span>In-Person</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourType("virtual")}
                    className={`py-2 px-3 text-[10px] font-mono uppercase tracking-widest rounded-xs border text-center cursor-pointer transition-colors ${
                      tourType === "virtual"
                        ? "bg-clay text-marble border-clay shadow-xs font-bold"
                        : "bg-marble text-clay border-clay/15 hover:bg-clay/5"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <Video className="h-3 w-3" />
                      <span>Virtual Video Link</span>
                    </div>
                  </button>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-clay/35" />
                    <input
                      type="text"
                      id="booking-name-input"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aliko Dangote"
                      className="w-full bg-marble text-clay pl-9 pr-3 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-clay/35" />
                      <input
                        type="email"
                        id="booking-email-input"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@exclusive.com"
                        className="w-full bg-marble text-clay pl-9 pr-3 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-clay/35" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full bg-marble text-clay pl-9 pr-3 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time slots */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-marble text-clay px-3 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold font-mono"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                      Time Interval <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-marble text-clay px-2 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold font-mono"
                    >
                      <option value="">Choose slot</option>
                      <option value="09:00 - 11:00 AM">09:00 - 11:00 AM</option>
                      <option value="11:30 - 01:30 PM">11:30 - 01:30 PM</option>
                      <option value="02:00 - 04:00 PM">02:00 - 04:00 PM</option>
                      <option value="04:30 - 06:30 PM">04:30 - 06:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Message comments */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                    Special directives
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="e.g. Any dietary specs or helicopter arrival coordination required?"
                    className="w-full bg-marble text-clay p-3 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold"
                  />
                </div>

                {errorText && (
                  <p className="text-[10px] font-mono text-red-500 leading-normal">
                    {errorText}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="booking-submit-btn"
                  className="w-full bg-clay hover:bg-primary-gold text-marble hover:text-clay py-3 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xs transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Syncing Reservation..." : "Submit Viewing Request"}
                </button>

              </form>
            )}
          </div>

          {/* Assigned Agent Contact parameters */}
          <div className="pt-6 border-t border-clay/10 space-y-3">
            <h4 className="font-display text-[10px] uppercase tracking-widest text-clay/60 block font-bold">
              Mandated Portfolio Agent
            </h4>
            
            <div className="flex items-center space-x-3.5 bg-clay/5 p-4 rounded-xs border border-clay/5">
              <img 
                src={property.agent.avatar} 
                alt={property.agent.name} 
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-primary-gold shadow-xs flex-shrink-0" 
              />
              <div>
                <span className="font-display font-medium text-xs text-clay block leading-none">
                  {property.agent.name}
                </span>
                <span className="text-[9px] text-primary-gold font-mono block uppercase mt-0.5">
                  Senior Sales Consultant
                </span>
                
                <div className="flex space-x-2.5 mt-2.5 text-[9px] font-mono text-clay/70">
                  <a href={`mailto:${property.agent.email}`} className="hover:text-primary-gold underline block">
                    {property.agent.email}
                  </a>
                  <span>&bull;</span>
                  <a href={`tel:${property.agent.phone}`} className="hover:text-primary-gold underline block">
                    {property.agent.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </motion.div>

    </motion.div>
  );
}
