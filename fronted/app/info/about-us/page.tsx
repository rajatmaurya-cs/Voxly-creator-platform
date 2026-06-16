"use client";

import React from "react";
import InfoLayout, { InfoSection, MetaBadge } from "../components/InfoLayout";
import { Users, Target, Shield, Heart } from "lucide-react";

export default function AboutUsPage() {
  const metaBadges: MetaBadge[] = [
    { icon: Users, label: "Team: Global Creators" },
    { icon: Target, label: "Mission: Simplify Social Media" },
    { icon: Shield, label: "Secured: Enterprise Grade" },
    { icon: Heart, label: "Built for Creators" },
  ];

  const sections: InfoSection[] = [
    {
      id: "our-story",
      number: "01",
      title: "Our Story",
      content: (
        <>
          <p>
            Postify began with a simple idea: social media management shouldn't require complex workflows, endless manual scheduling, or expensive enterprise tooling. Founded by a team of passionate developers and creators, we set out to build a platform that leverages the power of next-generation AI to make social media scheduling, creation, and optimization seamless and affordable for everyone.
          </p>
          <p>
            Today, Postify helps hundreds of creators, influencers, and businesses coordinate their digital brand presence, save hours of manual design time, and focus on what truly matters: building meaningful connections.
          </p>
        </>
      ),
    },
    {
      id: "our-mission",
      number: "02",
      title: "Our Mission",
      content: (
        <>
          <p>
            Our mission is to democratize digital marketing and social brand-building. We believe that professional-grade content scheduling, automated caption generation, and analytics insights should be available to small business owners, indie developers, and seasoned marketing professionals alike.
          </p>
          <p>
            We strive to provide intuitive, fast, and feature-rich software that runs beautifully on modern web technologies without cluttering your workflow.
          </p>
        </>
      ),
    },
    {
      id: "what-we-do",
      number: "03",
      title: "What We Do",
      content: (
        <>
          <p>
            Postify provides a robust all-in-one workspace for content creators. Our main product capabilities include:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>AI-Driven Content Generation: Generate relevant captions, tags, and posts tailored to your brand voice.</li>
            <li>Multi-Channel Scheduling: Schedule and plan post releases across multiple platforms directly from our central dashboard.</li>
            <li>Usage Analytics: Track metrics, leaderboard stats, and platform activity insights to understand user engagement.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-values",
      number: "04",
      title: "Our Core Values",
      content: (
        <>
          <p>
            At Postify, our operations and engineering decisions are guided by four core values:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>User First:</strong> We build features based directly on creator feedback and practical day-to-day requirements.</li>
            <li><strong>Clarity:</strong> We value clean, modern interfaces that reduce clutter and cognitive load.</li>
            <li><strong>Innovation:</strong> We continuously research and integrate state-of-the-art AI tooling to give you a competitive edge.</li>
            <li><strong>Privacy:</strong> We keep your data secure, transparent, and under your control at all times.</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <InfoLayout
      tag="Company"
      titleNormal="About"
      titleHighlight="Us"
      description="Postify is a modern AI-powered scheduling and content creation platform built to help creators and brands expand their digital footprints."
      metaBadges={metaBadges}
      sections={sections}
    />
  );
}
