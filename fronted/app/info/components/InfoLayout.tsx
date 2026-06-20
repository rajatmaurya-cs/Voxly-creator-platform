"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LucideIcon, Calendar, Clock, Globe, Shield } from "lucide-react";

export type InfoSection = {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
};

export type MetaBadge = {
  icon: LucideIcon;
  label: string;
};

type InfoLayoutProps = {
  tag: string;
  titleNormal: string;
  titleHighlight: string;
  description: string;
  metaBadges: MetaBadge[];
  sections: InfoSection[];
};

export default function InfoLayout({
  tag,
  titleNormal,
  titleHighlight,
  description,
  metaBadges,
  sections,
}: InfoLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px", 
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {}
          <div className="inline-block mb-4">
            <span className="px-3.5 py-1 rounded-full border border-zinc-800/80 bg-zinc-900/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              {tag}
            </span>
          </div>

          {}
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
              {titleNormal}{" "}
              <span className="text-indigo-400 font-extrabold">{titleHighlight}</span>
            </h1>
            <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed font-medium font-sans">
              {description}
            </p>
          </div>

          {}
          <div className="flex flex-wrap gap-3 mb-12">
            {metaBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-900 bg-zinc-900/10 text-xs text-zinc-400 font-medium"
                >
                  <Icon size={14} className="text-indigo-400/80" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-4">
                  Contents
                </h3>
                <nav className="flex flex-col gap-1.5">
                  {sections.map((sec) => {
                    const isActive = activeId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNavClick(sec.id)}
                        className={`flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                          isActive
                            ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-semibold"
                            : "bg-transparent border-transparent hover:bg-zinc-900/30 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className={`text-xs mt-0.5 ${
                            isActive ? "text-indigo-400" : "text-zinc-500"
                          }`}
                        >
                          {sec.number}
                        </span>
                        <span className="text-xs tracking-wide">{sec.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {}
            <section className="lg:col-span-8 space-y-12">
              {sections.map((sec) => (
                <article
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-28 border-b border-zinc-900/40 pb-8 last:border-none"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900/20 text-indigo-400 font-bold text-xs">
                      {sec.number}
                    </div>
                    <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                      {sec.title}
                    </h2>
                  </div>
                  <div className="text-zinc-400 text-xs md:text-sm leading-relaxed space-y-4 font-normal pl-14">
                    {sec.content}
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
