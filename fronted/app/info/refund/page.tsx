"use client";

import React from "react";
import InfoLayout, { InfoSection, MetaBadge } from "../components/InfoLayout";
import { CreditCard, ShieldAlert, CheckCircle, HelpCircle } from "lucide-react";

export default function RefundPolicyPage() {
  const metaBadges: MetaBadge[] = [
    { icon: CreditCard, label: "Refund window: 14 Days" },
    { icon: ShieldAlert, label: "Processor: Stripe / Razorpay" },
    { icon: CheckCircle, label: "Response Time: 2-3 Business Days" },
    { icon: HelpCircle, label: "Support: 24/7 Available" },
  ];

  const sections: InfoSection[] = [
    {
      id: "eligibility",
      number: "01",
      title: "Refund Eligibility",
      content: (
        <>
          <p>
            We offer refunds for subscription purchases made on Postify within 14 calendar days of your original payment date. To be eligible for a refund, you must satisfy the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your refund request is submitted within 14 days of the transaction date.</li>
            <li>Your account has not violated our core Terms of Service or been suspended for malicious behavior.</li>
            <li>You have not consumed more than 20% of your allocated monthly AI generation tokens/limits.</li>
          </ul>
        </>
      ),
    },
    {
      id: "process",
      number: "02",
      title: "How to Request a Refund",
      content: (
        <>
          <p>
            To request a refund, please contact our support team. Please include the following details in your email or support ticket:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The email address associated with your Postify account.</li>
            <li>The transaction ID, invoice number, or payment date.</li>
            <li>A brief explanation of why you are requesting a refund (this helps us improve our platform).</li>
          </ul>
          <p className="mt-2">
            Our finance team will review your request and respond to you within 2 to 3 business days.
          </p>
        </>
      ),
    },
    {
      id: "processing-time",
      number: "03",
      title: "Processing and Payouts",
      content: (
        <>
          <p>
            Once your refund is approved, we will initiate the transaction back to your original payment method. Please note the following timelines:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Stripe & Cards: Typically takes 5-10 business days for the funds to reflect on your card statement.</li>
            <li>UPI & Netbanking: Often takes 1-3 business days.</li>
          </ul>
          <p className="mt-2">
            You will receive a automated email notification from Postify with details of the transaction as soon as it is processed by our gateway.
          </p>
        </>
      ),
    },
    {
      id: "exceptions",
      number: "04",
      title: "Exceptions and Exclusions",
      content: (
        <>
          <p>
            Please note that certain transactions are non-refundable:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Renewals: Automatic renewal charges are non-refundable unless the request is submitted within 48 hours of renewal. We encourage you to cancel your subscription prior to your billing date.</li>
            <li>Custom Plans: High-volume custom corporate plans with specific SLA terms are governed by their individual contracts and may not be subject to the standard 14-day refund window.</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <InfoLayout
      tag="Billing"
      titleNormal="Refund"
      titleHighlight="Policy"
      description="We want you to be fully satisfied with Postify. Read our refund policies to understand under what circumstances you are eligible for subscription refunds."
      metaBadges={metaBadges}
      sections={sections}
    />
  );
}
