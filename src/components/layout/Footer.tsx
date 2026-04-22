"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { personal } from "@/data/personal";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Systems", href: "#systems" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const PLATFORM_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
};

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-24 bg-[#0a0e1a] text-[#e2e8f0]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              MUHAMMAD QASIM
            </h2>
            <p className="font-[var(--font-jp)] text-lg text-[#94a3b8]">
              {personal.japaneseName}
            </p>
            <p className="max-w-md text-sm text-[#94a3b8]">{personal.tagline}</p>
          </div>

          <div className="flex flex-col gap-4">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[#e2e8f0] hover:text-[#f472b6]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex gap-3">
              {personal.socials.map((s) => {
                const Icon = PLATFORM_ICON[s.platform] ?? Mail;
                const isPlaceholder = s.href === "#";
                return (
                  <a
                    key={s.platform}
                    href={s.href}
                    target={isPlaceholder ? undefined : "_blank"}
                    rel={isPlaceholder ? undefined : "noopener noreferrer"}
                    aria-disabled={isPlaceholder || undefined}
                    data-placeholder={isPlaceholder ? "true" : undefined}
                    title={isPlaceholder ? "Coming soon" : s.label}
                    onClick={(event) => {
                      if (isPlaceholder) event.preventDefault();
                    }}
                    className={
                      "inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 " +
                      (isPlaceholder
                        ? "cursor-not-allowed text-[#64748b] opacity-60"
                        : "text-[#e2e8f0] hover:border-[#f472b6] hover:text-[#f472b6]")
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <blockquote className="mt-12 border-l-2 border-[#f472b6] pl-4 text-sm italic text-[#e2e8f0]">
          &ldquo;{personal.quote.text}&rdquo;
          <cite className="mt-1 block not-italic text-xs text-[#94a3b8]">
            — {personal.quote.attribution}
          </cite>
        </blockquote>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#64748b] md:flex-row md:items-center md:justify-between">
          <span>{personal.copyright}</span>
          <span>
            This portfolio has an embedded AI agent. Try asking it about my work.
          </span>
        </div>
      </div>
    </footer>
  );
}
