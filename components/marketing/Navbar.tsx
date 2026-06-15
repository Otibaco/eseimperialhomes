"use client";

import Link from "next/link";
import React from "react";
import { Building2, Menu, PhoneCall, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Properties",
      href: "/properties",
    },

  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-clay/95 text-marble backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="rounded-xs bg-primary-gold p-2.5 text-clay transition-all duration-300 group-hover:scale-105">
              <Building2 className="h-6 w-6 stroke-[1.5]" />
            </div>

            <div>
              <span className="block font-display text-lg font-semibold uppercase tracking-widest">
                ESE IMPERIAL
              </span>

              <span className="-mt-1 block font-mono text-[10px] uppercase tracking-widest text-primary-gold">
                L U X U R Y • H O M E S
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-10 lg:flex">
            {navigationItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative py-2
                    font-display text-sm uppercase tracking-widest
                    transition-colors duration-200
                    hover:text-primary-gold
                    ${
                      active
                        ? "font-medium text-primary-gold"
                        : "text-marble/85"
                    }
                  `}
                >
                  {item.name}

                  <span
                    className={`
                      absolute bottom-0 left-0 h-[1px]
                      bg-primary-gold
                      transition-all duration-300
                      ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0"
                      }
                    `}
                  />
                </Link>
              );
            })}

            {/* Market Codes */}
            <div className="flex items-center space-x-2 border-l border-white/10 pl-6 font-mono text-xs text-marble/60">
              <span className="transition-colors duration-150 hover:text-primary-gold">
                LOS
              </span>
              <span>•</span>
              <span className="transition-colors duration-150 hover:text-primary-gold">
                LHR
              </span>
              <span>•</span>
              <span className="transition-colors duration-150 hover:text-primary-gold">
                DXB
              </span>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex">
            <a
              href="tel:+2348123456789"
              className="flex items-center gap-2 rounded-xs bg-primary-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-clay transition-all duration-300 hover:bg-primary-gold-focus"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Direct Link</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-marble transition-colors hover:text-primary-gold lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in border-t border-white/5 bg-zinc-950 lg:hidden">
          <div className="space-y-2 px-4 py-5">
            {navigationItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block border-l-2 px-4 py-3
                    font-mono text-sm uppercase tracking-wider
                    transition-colors
                    ${
                      active
                        ? "border-primary-gold bg-primary-gold/5 text-primary-gold"
                        : "border-transparent text-marble/70 hover:bg-white/5"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-white/5 pt-4">
              <a
                href="tel:+2348123456789"
                className="flex items-center justify-center gap-2 rounded-xs bg-primary-gold px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-clay"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Direct Link</span>
              </a>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 font-mono text-xs text-marble/50">
              <span>LOS • LHR • DXB</span>
              <span>+234 812 345 6789</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}