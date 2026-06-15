import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  CheckCircle, 
  X, 
  FileText, 
  Calendar, 
  Image,
  RefreshCw, 
  UserPlus,
  ArrowLeft,
  ChevronDown,
  Building2,
  DollarSign
} from "lucide-react";
import { Property, Booking, Inquiry, User, CurrencyType, CURRENCY_SYMBOLS, CURRENCY_CONVERSIONS } from "@/types/types";


export default function AdminPanel() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [comparedProperties, setComparedProperties] = React.useState<Property[]>([]);


  
  // Login State
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [loggingIn, setLoggingIn] = React.useState(false);

  // Tabs states
  const [activeTab, setActiveTab] = React.useState<"inventory" | "bookings" | "inquiries">("inventory");

  // Property Form states (for Add / Edit)
  const [showPropertyForm, setShowPropertyForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const [formTitle, setFormTitle] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formPrice, setFormPrice] = React.useState<number>(100000);
  const [formLocation, setFormLocation] = React.useState("");
  const [formCountry, setFormCountry] = React.useState("Nigeria");
  const [formType, setFormType] = React.useState("Mansion");
  const [formBedrooms, setFormBedrooms] = React.useState<number>(4);
  const [formBathrooms, setFormBathrooms] = React.useState<number>(4);
  const [formArea, setFormArea] = React.useState<number>(4000);
  const [formStatus, setFormStatus] = React.useState<"sale" | "rent">("sale");
  const [formImagesText, setFormImagesText] = React.useState("");
  const [formAmenitiesText, setFormAmenitiesText] = React.useState("");
  const [formFeatured, setFormFeatured] = React.useState(false);

  const [formError, setFormError] = React.useState("");
  const [formSubmitting, setFormSubmitting] = React.useState(false);

  // Stats
  const totalValuation = properties.reduce((acc, p) => acc + (p.status === "sale" ? p.price : 0), 0);
  const activeTours = bookings.filter(b => b.status === "approved").length;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Administrator validation password is required.");
      return;
    }
    setLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.user, data.token);
      } else {
        const err = await response.json();
        setLoginError(err.error || "Verification failed. Try again.");
      }
    } catch (err: any) {
      setLoginError("Could not connect to service. Verify the server is running.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Pre-populate Edit Info
  const startEditProperty = (prop: Property) => {
    setEditingId(prop.id);
    setFormTitle(prop.title);
    setFormDesc(prop.description);
    setFormPrice(prop.price);
    setFormLocation(prop.location);
    setFormCountry(prop.country);
    setFormType(prop.type);
    setFormBedrooms(prop.bedrooms);
    setFormBathrooms(prop.bathrooms);
    setFormArea(prop.area);
    setFormStatus(prop.status);
    setFormImagesText(prop.images.join("\n"));
    setFormAmenitiesText(prop.amenities.join(", "));
    setFormFeatured(prop.featured);
    
    setShowPropertyForm(true);
    setFormError("");
  };

  const startAddProperty = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormPrice(500000);
    setFormLocation("");
    setFormCountry("Nigeria");
    setFormType("Mansion");
    setFormBedrooms(4);
    setFormBathrooms(4);
    setFormArea(4500);
    setFormStatus("sale");
    setFormImagesText("https://images.unsplash.com/photo-1613490493576-7fde63acd811\nhttps://images.unsplash.com/photo-1613977257363-707ba9348227");
    setFormAmenitiesText("Infinity Pool, Smart Home, Security Patrol, Backup Solar");
    setFormFeatured(false);

    setShowPropertyForm(true);
    setFormError("");
  };

  // Submit property change (create or update)
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation || !formPrice) {
      setFormError("Title, Location, and Pricing are mandatory fields.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    const token = localStorage.getItem("ese-admin-token") || "";

    const imagesArray = formImagesText.trim().split("\n").map(l => l.trim()).filter(l => l !== "");
    const amenitiesArray = formAmenitiesText.trim().split(",").map(a => a.trim()).filter(a => a !== "");

    // Prepare default agent model
    const payload = {
      title: formTitle,
      description: formDesc,
      price: Number(formPrice),
      location: formLocation,
      country: formCountry,
      type: formType,
      bedrooms: Number(formBedrooms),
      bathrooms: Number(formBathrooms),
      area: Number(formArea),
      status: formStatus,
      images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1613490493576-7fde63acd811"],
      amenities: amenitiesArray,
      featured: formFeatured,
      virtualTour: [
        {
          sceneId: "scene_living",
          name: "Elegant Living Space",
          imageUrl: imagesArray[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
          description: "Stunning lounge space displaying double glazed windows and structural panoramic columns."
        }
      ],
      agent: {
        name: "Ese Imperial",
        email: "listings@eseimperialhomes.com",
        phone: "+234 812 345 6789",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
      }
    };

    try {
      const url = editingId ? `/api/properties/${editingId}` : "/api/properties";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        let newProperties = [...properties];
        if (editingId) {
          newProperties = newProperties.map(p => p.id === editingId ? data : p);
        } else {
          newProperties.push(data);
        }
        
        onPropertiesUpdate(newProperties);
        setShowPropertyForm(false);
        setEditingId(null);
      } else {
        const err = await res.json();
        setFormError(err.error || "Could not publish property configurations.");
      }
    } catch (err: any) {
      setFormError("Connection anomaly. Verify authorization specs.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete property listing
  const handlePropertyDelete = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to withdraw this property from the marketplace?")) return;
    
    const token = localStorage.getItem("ese-admin-token") || "";
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        onPropertiesUpdate(properties.filter(p => p.id !== id));
      } else {
        alert("Could not withdraw property. Check administrator permission level.");
      }
    } catch (err) {
      alert("Error deleting listing.");
    }
  };

  // Manage Bookings approvals
  const handleBookingAction = async (bookingId: string, nextStatus: "approved" | "cancelled") => {
    const token = localStorage.getItem("ese-admin-token") || "";
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        onBookingsUpdate(bookings.map(b => b.id === bookingId ? updated : b));
      } else {
        alert("Failed to modify booking schedule.");
      }
    } catch (err) {
      alert("Error managing booking.");
    }
  };

  // Convert prices for presentation
  const symbol = CURRENCY_SYMBOLS[currency];
  const rate = CURRENCY_CONVERSIONS[currency];

  // LOGIN PAGE INJECTION IF USER IS NOT LOGGED IN
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-clay/10 p-8 rounded-sm shadow-2xl animate-fade-in" id="admin-login-card">
        <div className="text-center space-y-3 mb-6">
          <div className="p-3.5 bg-primary-gold text-clay rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-md">
            <Lock className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-display font-medium text-lg uppercase tracking-wider text-clay">
              Administrative Gateway
            </h1>
            <p className="text-[10px] font-mono uppercase text-clay/50 mt-1">
              For Ese Imperial Partners &amp; Brokers
            </p>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4" id="admin-login-form">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
              User ID
            </label>
            <input
              type="text"
              required
              disabled
              value={username}
              className="w-full bg-marble text-clay/55 px-3 py-2 border border-clay/15 rounded-xs text-xs cursor-not-allowed font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
              Administrative Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-3.5 w-3.5 text-clay/35" />
              <input
                type="password"
                required
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (e.g. eseadmin2026)"
                className="w-full bg-marble text-clay pl-9 pr-3 py-2 border border-clay/15 rounded-xs text-xs focus:outline-hidden focus:border-primary-gold font-mono"
              />
            </div>
            <p className="text-[9px] text-clay/40 italic font-mono mt-1">
              *Try our standard authorization key &quot;eseadmin2026&quot;
            </p>
          </div>

          {loginError && (
            <p className="text-[10px] font-mono text-red-500 leading-relaxed">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            id="admin-login-submit-btn"
            className="w-full bg-clay text-marble hover:bg-primary-gold hover:text-clay py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xs transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loggingIn ? "Validating Authorization..." : "Authenticate Credentials"}
          </button>
        </form>

        <button
          onClick={() => onViewChange("listings")}
          className="w-full mt-4 bg-transparent border border-clay/10 text-clay hover:bg-clay/5 py-2 px-4 text-[10px] font-mono uppercase tracking-widest rounded-xs flex items-center justify-center space-x-1.5 duration-150 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Gate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="admin-hub-dashboard">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-clay/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-primary-gold font-mono tracking-widest uppercase text-[10px] flex items-center space-x-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Secured Control Room</span>
          </span>
          <h1 className="font-display font-medium text-2xl text-clay uppercase">
            Imperial Brokerage Command
          </h1>
        </div>

        <button
          onClick={startAddProperty}
          id="admin-add-property-btn"
          className="bg-clay text-marble hover:bg-primary-gold hover:text-clay py-2.5 px-5 text-xs font-mono font-bold uppercase tracking-widest rounded-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-clay/10 p-5 rounded-xs shadow-xs">
          <span className="text-[9px] font-mono uppercase tracking-widest text-clay/55 block">
            Net Portfolio Worth
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="font-display text-2xl font-bold text-clay">
              ${(totalValuation / 1000000).toFixed(2)}M
            </span>
            <span className="text-[10px] text-clay/45 font-mono">USD Base</span>
          </div>
        </div>

        <div className="bg-white border border-clay/10 p-5 rounded-xs shadow-xs">
          <span className="text-[9px] font-mono uppercase tracking-widest text-clay/55 block">
            Approved Field Tours
          </span>
          <div className="text-2xl font-display font-bold text-clay mt-1">
            {activeTours} <span className="text-xs text-primary-gold font-mono font-normal">Tours Confirmed</span>
          </div>
        </div>

        <div className="bg-white border border-clay/10 p-5 rounded-xs shadow-xs">
          <span className="text-[9px] font-mono uppercase tracking-widest text-clay/55 block">
            Secured Broker Registries
          </span>
          <div className="text-2xl font-display font-bold text-clay mt-1">
            {properties.length} <span className="text-xs text-primary-gold font-mono font-normal">Active Homes</span>
          </div>
        </div>

        <div className="bg-white border border-clay/10 p-5 rounded-xs shadow-xs">
          <span className="text-[9px] font-mono uppercase tracking-widest text-clay/55 block">
            Client Inquiries Received
          </span>
          <div className="text-2xl font-display font-bold text-clay mt-1">
            {inquiries.length} <span className="text-xs text-primary-gold font-mono font-normal">Messages</span>
          </div>
        </div>
      </div>

      {/* Primary Panels tabs */}
      <div className="flex space-x-1 border-b border-clay/10 mb-6">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4.5 py-3 text-xs font-mono uppercase tracking-widest border-t-2 cursor-pointer transition-colors ${
            activeTab === "inventory"
              ? "bg-white text-clay border-clay font-bold"
              : "border-transparent text-clay/60 hover:bg-clay/5"
          }`}
        >
          Residences ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4.5 py-3 text-xs font-mono uppercase tracking-widest border-t-2 cursor-pointer transition-colors ${
            activeTab === "bookings"
              ? "bg-white text-clay border-clay font-bold"
              : "border-transparent text-clay/60 hover:bg-clay/5"
          }`}
        >
          Tours &amp; Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-4.5 py-3 text-xs font-mono uppercase tracking-widest border-t-2 cursor-pointer transition-colors ${
            activeTab === "inquiries"
              ? "bg-white text-clay border-clay font-bold"
              : "border-transparent text-clay/60 hover:bg-clay/5"
          }`}
        >
          Messages ({inquiries.length})
        </button>
      </div>

      {/*PROPERTIES INVENTORY */}
      <div className="bg-white border border-clay/10 rounded-xs overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-clay text-marble uppercase font-mono tracking-wider">
                  <th className="px-6 py-4">Residence Info</th>
                  <th className="px-6 py-4">Global location</th>
                  <th className="px-6 py-4 text-right">Valuation</th>
                  <th className="px-6 py-4 text-center">Specs</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay/5">
                {properties.map((p) => {
                  const propertyPriceAdjusted = Math.round(p.price * rate);
                  return (
                    <tr key={p.id} className="hover:bg-clay/5 font-mono">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={p.images[0]} 
                            alt="" 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-xs border border-clay/15" 
                          />
                          <div>
                            <span className="font-display text-xs font-bold text-clay block leading-tight">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-clay/50 block font-mono mt-0.5">
                              ID: {p.id} {p.featured && <span className="text-primary-gold font-bold">★ Featured</span>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-clay/90">{p.location}</td>
                      <td className="px-6 py-4 text-right text-clay font-bold">
                        {symbol}{propertyPriceAdjusted.toLocaleString()}
                        {p.status === "rent" && <span className="text-[10px] font-normal text-clay/50">/mo</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.bedrooms}B / {p.bathrooms}Ba / {p.area} SF
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-clay text-white px-2 py-0.5 rounded-3xs text-[9px] uppercase">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => startEditProperty(p)}
                            className="p-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-xs hover:bg-yellow-100 cursor-pointer"
                            title="Edit specifications"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePropertyDelete(p.id)}
                            className="p-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xs hover:bg-red-100 cursor-pointer"
                            title="Remove catalog"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white border border-clay/10 p-10 text-center rounded-xs text-clay/50 font-mono text-xs">
              <Calendar className="h-8 w-8 mx-auto text-primary-gold mb-2" />
              <span>No touring schedules requested currently.</span>
            </div>
          ) : (
            <div className="bg-white border border-clay/10 rounded-xs overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-clay text-marble uppercase tracking-wider">
                      <th className="px-6 py-4">Client Contact</th>
                      <th className="px-6 py-4">Target House</th>
                      <th className="px-6 py-4">Viewing Date</th>
                      <th className="px-6 py-4">Tour Category</th>
                      <th className="px-6 py-4">Directives</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Approve / Cancel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clay/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-clay/5">
                        <td className="px-6 py-4">
                          <span className="font-bold text-clay">{b.clientName}</span>
                          <span className="block text-[10px] text-clay/55">{b.clientEmail}</span>
                          {b.clientPhone && <span className="block text-[10px] text-clay/55">{b.clientPhone}</span>}
                        </td>
                        <td className="px-6 py-4 font-display font-medium text-xs text-clay">
                          {b.propertyTitle}
                          <span className="block font-mono text-[9px] text-clay/40">ID: {b.propertyId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold">{b.date}</span>
                          <span className="block text-[10px] text-primary-gold">{b.time}</span>
                        </td>
                        <td className="px-6 py-4 uppercase text-[10px]">
                          {b.type === "virtual" ? (
                            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-200 rounded-3xs">
                              Virtual Tour Link
                            </span>
                          ) : (
                            <span className="text-zinc-600 bg-zinc-50 px-2 py-0.5 border border-zinc-200 rounded-3xs">
                              In-Person Visit
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-clay/70 max-w-xs truncate" title={b.comments}>
                          {b.comments || <span className="text-clay/35 italic">No notes</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-3xs ${
                            b.status === "approved" 
                              ? "bg-emerald-50 text-emerald-700" 
                              : b.status === "cancelled" 
                              ? "bg-red-50 text-red-700" 
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-1.5">
                            {b.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b.id, "approved")}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-xs cursor-pointer"
                                  title="Approve Viewing"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b.id, "cancelled")}
                                  className="p-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-xs cursor-pointer"
                                  title="Decline Viewing"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {b.status !== "pending" && (
                              <span className="text-[10px] text-zinc-400">Locked</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/*MESSAGES & INQUIRIES */}
       <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-white border border-clay/10 p-10 text-center rounded-xs text-clay/50 font-mono text-xs">
              <FileText className="h-8 w-8 mx-auto text-primary-gold mb-2" />
              <span>No client messages logged in the database.</span>
            </div>
          ) : (
            <div className="bg-white border border-clay/10 rounded-xs overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-clay text-marble uppercase tracking-wider">
                      <th className="px-6 py-4">Client Info</th>
                      <th className="px-6 py-4">Listing Spec</th>
                      <th className="px-6 py-4">Message Log</th>
                      <th className="px-6 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clay/5">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-clay/5">
                        <td className="px-6 py-4 font-bold text-clay">
                          {inq.clientName}
                          <span className="block text-[10px] text-clay/55 font-normal">{inq.clientEmail}</span>
                          {inq.clientPhone && <span className="block text-[10px] text-clay/55 font-normal">{inq.clientPhone}</span>}
                        </td>
                        <td className="px-6 py-4 text-clay/80 font-medium">
                          {inq.propertyTitle || <span className="italic text-clay/40">General Inquiry</span>}
                        </td>
                        <td className="px-6 py-4 text-clay max-w-sm whitespace-pre-wrap leading-relaxed">
                          {inq.message}
                        </td>
                        <td className="px-6 py-4 text-clay/50">{new Date(inq.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>



      {/* MODAL / BOTTOM FORM TO ADD OR EDIT PROPERTIES */}
      {showPropertyForm && (
        <div className="fixed inset-0 bg-clay/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-marble border border-clay/15 rounded-sm shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 relative animate-fade-in">
            
            <button
              onClick={() => {
                setShowPropertyForm(false);
                setEditingId(null);
              }}
              className="absolute top-4 right-4 text-clay/60 hover:text-clay text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div>
              <span className="text-primary-gold font-mono tracking-widest uppercase text-[9px] block">
                Catalog Operations Engine
              </span>
              <h2 className="font-display font-medium text-lg uppercase text-clay">
                {editingId ? "Revise Elite Listing" : "Register New Estate Residence"}
              </h2>
            </div>

            <form onSubmit={handlePropertySubmit} className="space-y-4 text-xs font-mono text-clay">
              
              {/* Title & Price */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
                    Property Showcase Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Imperial Belgravia Townhouse"
                    className="w-full bg-white p-2.5 border border-clay/15 rounded-xs"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
                    Asking Price (Base USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white p-2.5 border border-clay/15 rounded-xs"
                  />
                </div>
              </div>

              {/* Location & country details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1 font-sans">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
                    Physical Address (City, Area) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Old Ikoyi, Lagos, Nigeria"
                    className="w-full bg-white p-2.5 border border-clay/15 rounded-xs text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block">
                    Country Group
                  </label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-white p-2.5 border border-clay/15 rounded-xs cursor-pointer"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>

              {/* Architectural layout specifications */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono block">Arch Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-white p-2 border border-clay/15 rounded-xs"
                  >
                    <option value="Mansion">Mansion</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono block">Bedrooms</label>
                  <input
                    type="number"
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full bg-white p-2 border border-clay/15 rounded-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono block">Bathrooms</label>
                  <input
                    type="number"
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full bg-white p-2 border border-clay/15 rounded-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono block">Area Size (SQFT)</label>
                  <input
                    type="number"
                    value={formArea}
                    onChange={(e) => setFormArea(Number(e.target.value))}
                    className="w-full bg-white p-2 border border-clay/15 rounded-xs"
                  />
                </div>

                <div className="col-span-2 md:col-span-1 space-y-1.5">
                  <label className="text-[10px] uppercase font-mono block">Procuring Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "sale" | "rent")}
                    className="w-full bg-white p-2 border border-clay/15 rounded-xs"
                  >
                    <option value="sale">For Purchase</option>
                    <option value="rent">Monthly Rent</option>
                  </select>
                </div>
              </div>

              {/* Long Description */}
              <div className="space-y-1 font-sans">
                <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                  Compelling Masterpiece Spec Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize structural elements, custom marble configurations, high-security profiles, and gorgeous surroundings."
                  className="w-full bg-white p-3 border border-clay/15 rounded-xs text-xs font-mono"
                />
              </div>

              {/* Images URL List */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                  Imagery URLs (Split paths using NEW LINE)
                </label>
                <textarea
                  required
                  rows={2}
                  value={formImagesText}
                  onChange={(e) => setFormImagesText(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1628624747186-a941c476b7ef"
                  className="w-full bg-white p-3 border border-clay/15 rounded-xs text-[11px] font-mono"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-widest text-clay/60 block font-bold">
                  Amenities (Split using COMMA)
                </label>
                <input
                  type="text"
                  value={formAmenitiesText}
                  onChange={(e) => setFormAmenitiesText(e.target.value)}
                  placeholder="e.g. Infinity Pool, Backup Turbine, Cinema Suite, Yacht Dock"
                  className="w-full bg-white p-3 border border-clay/15 rounded-xs text-[11px]"
                />
              </div>

              {/* Badges/Featured */}
              <div className="flex items-center space-x-2.5 py-1">
                <input
                  type="checkbox"
                  id="form-featured-checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 text-primary-gold accent-primary-gold cursor-pointer"
                />
                <label htmlFor="form-featured-checkbox" className="text-[10px] uppercase tracking-wider font-bold text-clay/80 cursor-pointer">
                  Promote to Premium Featured Portfolio Grid
                </label>
              </div>

              {formError && (
                <p className="text-[10px] text-red-500 font-bold leading-normal">
                  {formError}
                </p>
              )}

              {/* Action operations buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-clay/10 col-span-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPropertyForm(false);
                    setEditingId(null);
                  }}
                  className="bg-zinc-100 hover:bg-zinc-200 text-clay py-2 px-5 text-xs font-mono font-bold uppercase tracking-widest rounded-xs cursor-pointer"
                >
                  Withdraw Edit
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-clay text-marble hover:bg-primary-gold hover:text-clay py-2 px-6 text-xs font-mono font-bold uppercase tracking-widest rounded-xs disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {formSubmitting ? "Publishing Database Changes..." : "Publish Listing Specifications"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
