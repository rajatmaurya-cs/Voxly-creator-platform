"use client";

import React from "react";
import InfoLayout, { InfoSection, MetaBadge } from "../components/InfoLayout";
import { FileText, Award, Scale, HelpCircle } from "lucide-react";

export default function TermsOfServicePage() {
  const metaBadges: MetaBadge[] = [
    { icon: FileText, label: "Version: 1.2" },
    { icon: Award, label: "Governing Law: India" },
    { icon: Scale, label: "Compliance: GDPR / CCPA Ready" },
    { icon: HelpCircle, label: "Support: support@postify.com" },
  ];

  const sections: InfoSection[] = [
    {
      id: "acceptance",
      number: "01",
      title: "Acceptance of Terms",
      content: (
        <>
          <p>
            By accessing or using the Postify platform, web application, API, or service, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use or access our services.
          </p>
          <p>
            We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      number: "02",
      title: "Account Registration and Security",
      content: (
        <>
          <p>
            To access certain features of Postify, you must create a personal account. When registering, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Provide accurate, current, and complete registration information.</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
            <li>Promptly notify us if you discover or suspect any security breaches related to the platform.</li>
          </ul>
        </>
      ),
    },
    {
      id: "use-restrictions",
      number: "03",
      title: "Acceptable Use & Restrictions",
      content: (
        <>
          <p>
            You are solely responsible for all content, schedules, and prompts created on your Postify account. You agree not to use Postify to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Generate or distribute content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
            <li>Spam, automate excessive bot traffic, or attempt to bypass platform rate-limits.</li>
            <li>Reverse engineer, decompile, or extract proprietary code, AI generation models, or styling systems.</li>
          </ul>
        </>
      ),
    },
    {
      id: "subscriptions",
      number: "04",
      title: "Subscriptions, Fees, and Cancellations",
      content: (
        <>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly or annually depending on your plan).
          </p>
          <p>
            At the end of each billing cycle, your subscription will automatically renew under the exact same conditions unless you cancel it or Postify cancels it. You can cancel your subscription renewal at any time via your account settings page.
          </p>
        </>
      ),
    },
    {
      id: "termination",
      number: "05",
      title: "Account Termination",
      content: (
        <>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you can simply delete your account or contact our support team.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      number: "06",
      title: "Limitation of Liability & Disclaimer",
      content: (
        <>
          <p>
            Postify is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the uptime, accuracy of AI generated outputs, or fitness of the platform for a particular commercial purpose.
          </p>
          <p>
            In no event shall Postify, its founders, or employees be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.
          </p>
        </>
      ),
    },
  ];

  return (
    <InfoLayout
      tag="Legal"
      titleNormal="Terms of"
      titleHighlight="Service"
      description="Read the rules, terms, and guidelines that govern your usage of Postify. By using our platform, you agree to these legal conditions."
      metaBadges={metaBadges}
      sections={sections}
    />
  );
}
