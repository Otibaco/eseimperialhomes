'use client'
import { Building2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Footer() {
    const router = useRouter();
    // General Inquiry form state (frontpage footer)
    const [inquiringName, setInquiringName] = React.useState("");
    const [inquiringEmail, setInquiringEmail] = React.useState("");
    const [inquiringPhone, setInquiringPhone] = React.useState("");
    const [inquiringMessage, setInquiringMessage] = React.useState("");
    const [inquirySuccess, setInquirySuccess] = React.useState(false);
    const [inquiryError, setInquiryError] = React.useState("");
    const [inquiryLoading, setInquiryLoading] = React.useState(false);
    // Submit direct footer inquiry form
    const handleGeneralInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inquiringName || !inquiringEmail || !inquiringMessage) {
            setInquiryError("Please complete mandatory items (Name, Email, Message)");
            return;
        }

        setInquiryLoading(true);
        setInquiryError("");
    };
    return (
        <div className="bg-clay text-marble border-t border-white/5 pt-12 pb-6" id="footer-inquiry-deck">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">

                {/* General Inquiries Form card */}
                <div className="md:col-span-5 bg-zinc-950/45 border border-white/10 p-6 sm:p-8 rounded-xs space-y-4 shadow-xl">
                    <div className="space-y-1">
                        <span className="text-primary-gold font-mono tracking-widest uppercase text-[9px] block">
                            Partner Interaction Gateway
                        </span>
                        <h3 className="font-display font-medium uppercase text-sm tracking-wide">
                            Direct Portfolio Advisory Inquiries
                        </h3>
                    </div>

                    {inquirySuccess ? (
                        <div className="bg-amber-950/20 text-primary-gold border border-primary-gold/20 p-5 rounded-xs text-center space-y-3 font-mono text-xs">
                            <ShieldCheck className="h-8 w-8 mx-auto" />
                            <h4 className="font-bold uppercase">Inquiry Registered Securely!</h4>
                            <p className="leading-relaxed text-[11px] text-marble/80">
                                Your global portfolio inquiry has been synced with partner databases. An executive sales consultant is mandated to consult shortly.
                            </p>
                            <button
                                type="button"
                                onClick={() => setInquirySuccess(false)}
                                className="mt-2 text-primary-gold hover:underline text-[10px] font-bold block mx-auto cursor-pointer"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleGeneralInquirySubmit} className="space-y-3 text-xs text-marble" id="footer-inquiry-form">
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase font-mono tracking-widest text-white/50 block">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={inquiringName}
                                    onChange={(e) => setInquiringName(e.target.value)}
                                    placeholder="Aliko Dangote"
                                    className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded-xs text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-mono tracking-widest text-white/50 block">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={inquiringEmail}
                                        onChange={(e) => setInquiringEmail(e.target.value)}
                                        placeholder="client@exclusive.com"
                                        className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded-xs text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-mono tracking-widest text-white/50 block font-mono">Phone</label>
                                    <input
                                        type="tel"
                                        value={inquiringPhone}
                                        onChange={(e) => setInquiringPhone(e.target.value)}
                                        placeholder="+234 812 345 6789"
                                        className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded-xs text-xs font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] uppercase font-mono tracking-widest text-white/50 block">Inquiry specifications *</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={inquiringMessage}
                                    onChange={(e) => setInquiringMessage(e.target.value)}
                                    placeholder="e.g. Schedule secure physical viewing of Lekki mansions, or clarify Belgravia lift mechanics."
                                    className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded-xs text-[11px]"
                                />
                            </div>

                            {inquiryError && (
                                <p className="text-[10px] font-mono text-red-400">
                                    {inquiryError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={inquiryLoading}
                                id="footer-inquiry-submit-btn"
                                className="w-full bg-primary-gold hover:bg-primary-gold-focus text-clay py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xs transition-transform cursor-pointer"
                            >
                                {inquiryLoading ? "Syncing..." : "Submit Inquiry Portfolio"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Corporate locations details */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6 md:pl-10">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-primary-gold">
                            <div className="p-2.5 bg-primary-gold/15 text-primary-gold border border-primary-gold/35 rounded-xs">
                                <Building2 className="h-6 w-6 stroke-[1.5]" />
                            </div>
                            <div>
                                <span className="font-display text-lg tracking-widest font-semibold uppercase block leading-none">
                                    ESE IMPERIAL HOMES Ltd
                                </span>
                                <span className="text-[10px] tracking-widest text-primary-gold/75 uppercase font-mono block mt-1">
                                    C R O W N &bull; O F &bull; R E A L &bull; E S T A T E
                                </span>
                            </div>
                        </div>
                        <p className="text-[11px] text-marble/65 font-mono leading-relaxed">
                            Ese Imperial Homes represents architectural distinctiveness, implementing elite secure designs and immersive digital interfaces to serve global capital buyers and luxury seekers.
                        </p>
                    </div>

                    {/* Hub sectors list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[10px] text-marble/65 pt-4 border-t border-white/10">
                        <div className="space-y-1.5 border-l border-primary-gold/20 pl-3">
                            <span className="text-primary-gold font-bold uppercase block">Lagos Retail Office</span>
                            <span className="block text-white/50 leading-normal">
                                No 15, Admiralty Way,<br />
                                Lekki Phase 1, Lagos, Nigeria<br />
                                +234 812 345 6789
                            </span>
                        </div>

                        <div className="space-y-1.5 border-l border-primary-gold/20 pl-3">
                            <span className="text-primary-gold font-bold uppercase block">London Hub</span>
                            <span className="block text-white/50 leading-normal">
                                8 Belgrave Square,<br />
                                Belgravia, London SW1X, UK<br />
                                +44 7700 900077
                            </span>
                        </div>

                        <div className="space-y-1.5 border-l border-primary-gold/20 pl-3">
                            <span className="text-primary-gold font-bold uppercase block">Dubai Pavilion</span>
                            <span className="block text-white/50 leading-normal">
                                Level 28, Boulevard Plaza II,<br />
                                Downtown Dubai, UAE<br />
                                +971 4 123 4567
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Legal copyrights */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-white/40 gap-3">
                <span>&copy; {new Date().getFullYear()} Ese Imperial Homes Corporation. All Rights Privileged and Reserved.</span>
                <div className="flex space-x-4">
                    <span className="hover:text-marble cursor-pointer duration-100">Registries Protocols</span>
                    <span>&bull;</span>
                    <span className="hover:text-marble cursor-pointer duration-100 font-mono">Secured SSL Enclave</span>
                </div>
            </div>
        </div>
    )
}
