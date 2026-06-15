"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Compass } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";

export default function NotFound() {
    return (
        <div>
            <Navbar />
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-clay px-6">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center brightness-[0.12]"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-clay/85 to-clay" />
                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
                            backgroundSize: "80px 80px",
                        }}
                    />
                </div>

                {/* Gold Lines */}
                <div className="absolute left-10 top-0 hidden h-full w-px bg-primary-gold/10 lg:block" />
                <div className="absolute right-10 top-0 hidden h-full w-px bg-primary-gold/10 lg:block" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    className="relative z-10 mx-auto max-w-4xl text-center"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.6,
                        }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="rounded-xs border border-primary-gold/20 bg-primary-gold/10 p-5 backdrop-blur-sm">
                            <Building2 className="h-10 w-10 text-primary-gold" />
                        </div>
                    </motion.div>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 block font-mono text-[11px] uppercase tracking-[0.35em] text-primary-gold"
                    >
                        Estate Registry Exception
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.8,
                        }}
                        className="font-serif text-7xl italic text-marble sm:text-9xl"
                    >
                        404
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 120 }}
                        transition={{
                            delay: 0.6,
                            duration: 0.6,
                        }}
                        className="mx-auto my-8 h-px bg-primary-gold"
                    />

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="font-display text-3xl uppercase tracking-[0.15em] text-marble sm:text-5xl"
                    >
                        Property Record Not Found
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-relaxed text-marble/70"
                    >
                        The requested estate dossier, luxury portfolio, or advisory page
                        could not be located within the ESE Imperial registry system.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xs bg-primary-gold px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-clay transition-all duration-300 hover:scale-105 hover:bg-primary-gold-focus"
                        >
                            Return Home
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/properties"
                            className="inline-flex items-center gap-2 rounded-xs border border-primary-gold/30 px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
                        >
                            <Compass className="h-4 w-4" />
                            Browse Collection
                        </Link>
                    </motion.div>

                    {/* Markets */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="mt-16 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.25em] text-marble/40"
                    >
                        <span>LOS</span>
                        <span>•</span>
                        <span>LHR</span>
                        <span>•</span>
                        <span>DXB</span>
                    </motion.div>
                </motion.div>
            </main>
        </div>

    );
}