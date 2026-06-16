'use client'
import { CurrencyType, Property } from '@/types/types';
import { ArrowRight, CalendarCheck, Compass, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import PropertyCard from '../property/PropertyCard';
import Navbar from './Navbar';
import AIAssistant from '../ai/AIAssistant';
// Property details are now full pages at /properties/[slug]
import { PropertyComparisonDrawer } from '@/components/property/PropertyComparison';
import { MOCK_PROPERTIES } from '@/lib/mockProperties';

export default function Homepage() {
    const [properties, setProperties] = React.useState<Property[]>([]);
    // No modal selection — navigate to property pages instead

    // Selected properties for side-by-side comparison
    const [comparedProperties, setComparedProperties] = React.useState<Property[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    // Load properties on mount
    React.useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch('/api/properties');
                if (!mounted) return;
                if (res.ok) {
                    const data = await res.json();
                    setProperties(data);
                } else {
                    // Fallback to mock data
                    setProperties(MOCK_PROPERTIES);
                }
            } catch (err) {
                console.error('Error loading properties, using mock data', err);
                // Fallback to mock data
                setProperties(MOCK_PROPERTIES);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    const featuredProperties = React.useMemo(() => {
        return properties.filter(p => p.featured === true);
    }, [properties]);

    const [currency, setCurrency] = React.useState<CurrencyType>("NGN");

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
        <div className="space-y-16 animate-fade-in" id="landing-screen-view">

            {/* Majestic Architectural Hero Section */}
            <div className="relative h-[85vh] bg-clay overflow-hidden flex items-center justify-center text-center px-4">
                {/* Premium Background image with gradient mask overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-[0.4]"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clay via-transparent to-zinc-950/45" />

                <div className="relative z-10 max-w-4xl space-y-6">
                    <div>
                        <span className="font-mono text-primary-gold text-xs tracking-widest uppercase block mb-3 font-semibold">
                            &bull; ESE IMPERIAL PORTFOLIO &bull;
                        </span>
                        <h1 className="font-serif italic text-4xl sm:text-6xl text-marble tracking-tight leading-tight">
                            Architectural Excellence.<br />
                            <span className="font-display font-medium uppercase tracking-wide text-marble not-italic text-3xl sm:text-5xl">
                                Uncompromised Luxury
                            </span>
                        </h1>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-marble/85 leading-relaxed max-w-2xl mx-auto font-mono uppercase tracking-wider">
                        Representing the absolute crown of high-security luxury estates in Nigeria.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                router.push("/properties");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="bg-primary-gold hover:bg-primary-gold-focus text-clay py-3.5 px-8 font-mono font-bold text-xs uppercase tracking-widest rounded-xs transition-transform duration-300 transform hover:scale-105 cursor-pointer shadow-lg w-full sm:w-auto"
                        >
                            Explore Private Collection
                        </button>
                        <a
                            href="#footer-inquiry-deck"
                            className="bg-transparent border border-marble/30 hover:border-marble text-marble py-3.5 px-8 font-mono text-xs uppercase tracking-widest rounded-xs transition-colors duration-200 w-full sm:w-auto block text-center"
                        >
                            Consult With Advisory
                        </a>
                    </div>
                </div>

                {/* Bottom Scroll Indicator tag */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 text-white/50 text-[10px] tracking-widest font-mono uppercase">
                    <span>Direct Scroll</span>
                    <span className="h-4 w-[1px] bg-primary-gold animate-bounce" />
                </div>
            </div>

            {/* Global Hubs Grid segment */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center space-y-2">
                    <span className="text-primary-gold font-mono tracking-widest text-[10px] uppercase block">
                        Metropolitan Hubs
                    </span>
                    <h2 className="font-display font-medium uppercase text-2xl text-clay tracking-wide">
                        Strategic Global Markets
                    </h2>
                    <div className="h-[1px] w-20 bg-primary-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hub 1 */}
                    <div className="relative aspect-4/3 rounded-xs overflow-hidden group shadow-lg border border-clay/5">
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                            alt="Lagos Waterfront"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover brightness-[0.55] group-hover:scale-105 duration-300 transition-transform"
                        />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <span className="text-primary-gold font-mono text-[9px] uppercase tracking-widest">Nigeria Market</span>
                            <h3 className="font-display text-lg uppercase font-semibold">Lekki &amp; Ikoyi</h3>
                            <p className="text-[11px] text-marble/70 font-sans mt-2 leading-relaxed">
                                Lagos premier waterfront mansions, boasting custom biometric perimeters, private marine terminals, and multi-tier off-grid micro-turbines.
                            </p>
                        </div>
                    </div>

                    {/* Hub 2 */}
                    <div className="relative aspect-4/3 rounded-xs overflow-hidden group shadow-lg border border-clay/5">
                        <img
                            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"
                            alt="Maitama Stately"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover brightness-[0.55] group-hover:scale-105 duration-300 transition-transform"
                        />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <span className="text-primary-gold font-mono text-[9px] uppercase tracking-widest">UK Market</span>
                            <h3 className="font-display text-lg uppercase font-semibold">Maitama, Abuja</h3>
                            <p className="text-[11px] text-marble/70 font-sans mt-2 leading-relaxed">
                                Grade II listed heritage Georgian squares representing extreme preservation and bespoke luxury elevators in prime European circles.
                            </p>
                        </div>
                    </div>

                    {/* Hub 3 */}
                    <div className="relative aspect-4/3 rounded-xs overflow-hidden group shadow-lg border border-clay/5">
                        <img
                            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                            alt="Woji Views"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover brightness-[0.55] group-hover:scale-105 duration-300 transition-transform"
                        />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <span className="text-primary-gold font-mono text-[9px] uppercase tracking-widest">Middle East</span>
                            <h3 className="font-display text-lg uppercase font-semibold">Woji, Port Harcourt</h3>
                            <p className="text-[11px] text-marble/70 font-sans mt-2 leading-relaxed">
                                Skyline topping luxury duplex penthouses, soaring high above standard clouds with panoramic water-show viewing terraces.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CURATED GRID PORTFOLIO : FEATURED HOMES */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-clay/10 pb-4">
                    <div>
                        <span className="text-primary-gold font-mono tracking-widest text-[10px] uppercase block">
                            Curated Collection
                        </span>
                        <h2 className="font-display font-medium uppercase text-2xl text-clay tracking-wide">
                            Signature Residences
                        </h2>
                    </div>
                    <button
                        onClick={() => {
                            router.push("/properties");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-primary-gold hover:text-clay text-xs tracking-wider uppercase font-mono font-bold flex items-center space-x-1 group duration-150 cursor-pointer"
                    >
                        <span>Review full catalog</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 duration-150" />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-clay/5 rounded-xs aspect-4/5 border border-clay/10" />
                        ))}
                    </div>
                ) : featuredProperties.length === 0 ? (
                    <div className="bg-white border p-12 text-center rounded-xs font-mono text-clay/50">
                        No houses marked for signature portfolio display.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProperties.map((prop) => (
                            <PropertyCard
                                key={prop.id}
                                property={prop}
                                currency={currency}
                                onSelect={(property) => {
                                    const target = property.slug ? property.slug : property.id;
                                    router.push(`/properties/${encodeURIComponent(target)}`);
                                }}
                                isCompared={comparedProperties.some((p) => p.id === prop.id)}
                                onCompareToggle={handleCompareToggle}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Digital Concierge Callout card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-clay text-marble p-8 sm:p-12 rounded-xs border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(9,13,22,0.8) 100%) pointer-events-none" />

                    <div className="relative z-10 max-w-xl space-y-4">
                        <div className="flex items-center space-x-2 text-primary-gold font-mono uppercase text-[10px] tracking-widest font-bold">
                            <Sparkles className="h-4 w-4 animate-spin-slow" />
                            <span>Real-Time International Assistance</span>
                        </div>
                        <h2 className="font-serif italic text-2xl sm:text-3xl text-marble leading-tight">
                            Translate Specs &amp; Exchange Currencies Instantly With Our AI Advisor
                        </h2>
                        <p className="text-xs text-marble/70 font-mono leading-relaxed">
                            Ese Imperial utilizes a server-side Gemini 3.5 Assistant. Direct it to filter homes by bedrooms, compute mortgage indices, or clarify localized security systems.
                        </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                        <button
                            onClick={() => {
                                // Trigger AI assistant opening manually
                                const trigger = document.getElementById("launch-ai-chat-btn");
                                if (trigger) {
                                    trigger.click();
                                }
                            }}
                            className="w-full md:w-auto bg-primary-gold hover:bg-primary-gold-focus text-clay py-4 px-8 font-mono text-xs font-bold uppercase tracking-widest rounded-xs shadow-lg duration-150 cursor-pointer text-center block"
                        >
                            Activate Chat Concierge
                        </button>
                    </div>
                </div>
            </div>

            {/* Corporate Values grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
                <div className="text-center space-y-2">
                    <span className="text-primary-gold font-mono tracking-widest text-[10px] uppercase block">Why Invest With Us</span>
                    <h2 className="font-display font-medium uppercase text-2xl text-clay tracking-wide">
                        Corporate Distinctions
                    </h2>
                    <div className="h-[1px] w-20 bg-primary-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-center">
                    <div className="p-6 bg-white border border-clay/10 rounded-xs">
                        <Globe className="h-8 w-8 text-primary-gold mx-auto mb-3" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-wider mb-2">Global Access</h3>
                        <span className="text-[10px] leading-relaxed text-clay/65 block">
                            Full presence in primary hubs of Lagos, London, Dubai, and Malibu with dynamic multi-currency systems.
                        </span>
                    </div>

                    <div className="p-6 bg-white border border-clay/10 rounded-xs">
                        <ShieldCheck className="h-8 w-8 text-primary-gold mx-auto mb-3" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-wider mb-2">Diplomatically Secure</h3>
                        <span className="text-[10px] leading-relaxed text-clay/65 block">
                            Uncompromising security designs including bulletproof parameters and deep secure gates.
                        </span>
                    </div>

                    <div className="p-6 bg-white border border-clay/10 rounded-xs">
                        <Compass className="h-8 w-8 text-primary-gold mx-auto mb-3" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-wider mb-2">3D Virtual Tours</h3>
                        <span className="text-[10px] leading-relaxed text-clay/65 block">
                            Walk through custom layout salons, kitchens, and roofs in high fidelity directly from client browser tabs.
                        </span>
                    </div>

                    <div className="p-6 bg-white border border-clay/10 rounded-xs">
                        <CalendarCheck className="h-8 w-8 text-primary-gold mx-auto mb-3" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-wider mb-2">Advisory Bookings</h3>
                        <span className="text-[10px] leading-relaxed text-clay/65 block">
                            Fully automated booking engine linking you with senior designated sales partners instantly.
                        </span>
                    </div>
                </div>
            </div>

            {/* Property details moved to pages. Navigate to /properties/[slug] for details and /properties/[slug]/tour for tours. */}

            {/* SIDE-BY-SIDE PROPERTY MATRIX SYSTEM */}
            <PropertyComparisonDrawer
                comparedProperties={comparedProperties}
                onRemove={(p) => setComparedProperties((prev) => prev.filter((item) => item.id !== p.id))}
                onClearAll={() => setComparedProperties([])}
                currency={currency}
                onSelect={(p) => {
                    const target = p.slug ? p.slug : p.id;
                    router.push(`/properties/${encodeURIComponent(target)}`);
                }}
            />

        </div>
    )
}
