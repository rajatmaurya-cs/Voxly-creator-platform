"use client";

import React from "react";
import InfoLayout, { InfoSection, MetaBadge } from "../components/InfoLayout";
import { Calendar, Clock, Globe, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  const metaBadges: MetaBadge[] = [
    { icon: Calendar, label: "Effective: January 1, 2026" },
    { icon: Clock, label: "Last Updated: June 2026" },
    { icon: Globe, label: "Jurisdiction: India" },
    { icon: Shield, label: "Applies to all Postify platforms" },
  ];

  const sections: InfoSection[] = [
    {
      id: "introduction",
      number: "01",
      title: "Introduction & Scope",
      content: (
        <>
          <p>
            Postify (“we”, “our”, or “us”), a platform designed for content generation and social media scheduling, operates under the laws of India. Postify is dedicated to protecting your personal data and privacy. This policy explains what personal data we collect, why we collect it, how we protect it, and the choices you have.
          </p>
          <p>
            This Privacy Policy applies to all services, websites, and applications offered by Postify. By accessing our platform, you consent to the data practices described in this policy.
          </p>
        </>
      ),
    },
    {
      id: "information-collect",
      number: "02",
      title: "Information We Collect",
      content: (
        <>
          <p>
            We collect information you provide directly to us when creating an account, updating your profile, subscribing to a plan, or communicating with us. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Account Information: Name, email address, password, and avatar.</li>
            <li>Payment Details: Transactions, subscription status, and limited billing data (handled securely via third-party processors).</li>
            <li>Content Data: Prompts, drafts, schedules, and generated social posts created on Postify.</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      number: "03",
      title: "How We Use Your Information",
      content: (
        <>
          <p>
            We use the collected information for various purposes to provide and improve our services, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>To manage and authenticate your account on Postify.</li>
            <li>To process transactions and manage your billing subscriptions.</li>
            <li>To run our AI content generation engines based on your prompts.</li>
            <li>To monitor usage trends and optimize our platform layout and performance.</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing-info",
      number: "04",
      title: "Sharing Your Information",
      content: (
        <>
          <p>
            We do not sell your personal data. We may share information with trusted third-party service providers to help run our business, such as:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>AI Engine Providers (e.g. OpenAI, Google Gemini) to generate text/images.</li>
            <li>Payment processors for secure handling of your subscription fees.</li>
            <li>Hosting and cloud database providers (e.g. MongoDB Atlas, Vercel) to host our application.</li>
          </ul>
        </>
      ),
    },
    {
      id: "data-security",
      number: "05",
      title: "Data Storage & Security",
      content: (
        <>
          <p>
            The security of your personal data is highly important to us. We implement industry-standard administrative, physical, and technical safeguards to protect your personal information from unauthorized access, loss, or alteration.
          </p>
          <p>
            Data is stored securely on encrypted cloud servers. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: "cookies-tracking",
      number: "06",
      title: "Cookies & Tracking Technologies",
      content: (
        <>
          <p>
            We use cookies and similar tracking technologies to track session activity on our platform and hold certain configuration parameters. Cookies are small files sent to your browser from a website and stored on your device.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
          </p>
        </>
      ),
    },
  ];

  return (
    <InfoLayout
      tag="Legal"
      titleNormal="Privacy"
      titleHighlight="Policy"
      description="At Postify, your privacy is a fundamental priority. This policy explains what personal data we collect, why we collect it, how we protect it, and the choices you have."
      metaBadges={metaBadges}
      sections={sections}
    />
  );
}
