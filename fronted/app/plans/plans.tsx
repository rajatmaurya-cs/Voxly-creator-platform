"use client";
import React, { useContext } from "react";
import Script from "next/script";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  MessageSquare,
  Brain,
  FlaskConical,
  Code,
  HelpCircle
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { AuthContext } from "../ContextProvider/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import PriceCards from "../Animations/PriceCards";



type Plan = {
  _id: string;
  name: string;
  price: number;
  limits: {
    aiGeneration: number;
    aiSummarizer: number;
  };
};

interface PlansProps {
  dbPlans?: Plan[];
}

const Plans = ({ dbPlans = [] }: PlansProps) => {

  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;

  const router = useRouter();

  const queryClient = useQueryClient();

  const handlePayment = async (plan: string) => {
    try {
      if (plan === 'free') { router.push('/Home'); return; }
      toast.loading("Initiating payment request...", { id: "payment-toast" });
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            plan,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        
        toast.error(data.message , {id:"payment-toast"})
        return ;
      }

      if (!window.Razorpay) {
        
        toast.error("Something Went Wrong.")
        return ;
      }

      toast.success("Order created! Opening payment modal...", { id: "payment-toast" });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Postify",
        description: `${plan.toUpperCase()} Plan Subscription`,
        handler: async function (response: any) {
          try {
            toast.loading("Verifying your payment...", { id: "payment-toast" });
            const verifyResponse = await apiFetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payment/verifypayment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success("Plan upgraded successfully 🎉", { id: "payment-toast" });
              queryClient.invalidateQueries({
                queryKey: ["auth-user"],
              });
              router.replace("/Home");
            } else {
              toast.error("Payment Verification Failed", { id: "payment-toast" });
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment Verification Failed", { id: "payment-toast" });
          }
        },
        theme: {
          color: "#0f172a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Something went wrong. Please try again.",
        { id: "payment-toast" }
      );
    }
  };

  const plansList = [
    {
      id: "free",
      name: "Free",
      price: dbPlans.find((p) => p.name.toLowerCase() === "free")?.price ?? 0,
      subtitle: "Ideal for trying out Postify",
      buttonText: "Get Started",
      everythingText: "Everything you need:",
      popular: false,
      features: [
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "free")?.limits?.aiGeneration ?? 1} AI Generation limit`, 
          icon: Zap 
        },
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "free")?.limits?.aiSummarizer ?? 2} AI Summariser limit`, 
          icon: MessageSquare 
        },
        { text: "Standard generation speed", icon: TrendingUp },
        { text: "Access to standard model", icon: Cpu },
        { text: "Basic dashboard analytics", icon: Brain },
        { text: "Standard support", icon: HelpCircle },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: dbPlans.find((p) => p.name.toLowerCase() === "pro")?.price ?? 199,
      subtitle: "Maximize your productivity",
      buttonText: "Upgrade to Pro",
      everythingText: "Everything in Free and:",
      popular: true,
      features: [
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "pro")?.limits?.aiGeneration ?? 10} AI Generation limit`, 
          icon: Zap 
        },
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "pro")?.limits?.aiSummarizer ?? 10} AI Summariser limit`, 
          icon: MessageSquare 
        },
        { text: "Fast generation speed", icon: TrendingUp },
        { text: "Access to premium model", icon: Sparkles },
        { text: "Advanced dashboard analytics", icon: Brain },
        { text: "Priority support", icon: HelpCircle },
      ],
    },
    {
      id: "plus",
      name: "Plus",
      price: dbPlans.find((p) => p.name.toLowerCase() === "plus")?.price ?? 499,
      subtitle: "For power users and teams",
      buttonText: "Upgrade to Plus",
      everythingText: "Everything in Pro and:",
      popular: false,
      features: [
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "plus")?.limits?.aiGeneration ?? 40} AI Generation limit`, 
          icon: Zap 
        },
        { 
          text: `${dbPlans.find((p) => p.name.toLowerCase() === "plus")?.limits?.aiSummarizer ?? 40} AI Summariser limit`, 
          icon: MessageSquare 
        },
        { text: "Maximum generation speed", icon: TrendingUp },
        { text: "Access to elite writing models", icon: Sparkles },
        { text: "Full analytics & engagement stats", icon: Brain },
        { text: "24/7 Priority support", icon: HelpCircle },
        { text: "Custom editorial style templates", icon: FlaskConical },
      ],
    },
  ];

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center">
       
        <div className="max-w-7xl w-full mx-auto relative z-10">
          {/* Header Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 max-w-6xl mx-auto">
            {/* Header Text */}
            <div className="text-center lg:text-left">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 rounded-full uppercase">
                Pricing Plans
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Choose your perfect plan
              </h1>
              <p className="mt-4 text-lg text-neutral-400 max-w-2xl lg:mx-0 mx-auto">
                Supercharge your social presence and content workflow with Postify's advanced AI toolset.
              </p>
            </div>

            {/* Wallet Graphic */}
            <div className="flex justify-center items-center overflow-visible mt-2.5">
              <PriceCards />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plansList.map((plan) => {
              const isPopular = plan.popular;
              const isCurrentPlan = !!(user && ((user as any).plan?.name ? ((user as any).plan.name.toLowerCase() === plan.id.toLowerCase()) : (plan.id === "free")));
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col justify-between p-8 sm:p-10 rounded-[32px] bg-[#212121] border transition-all duration-300 hover:scale-[1.02] hover:border-neutral-700/80 ${isPopular
                      ? "border-neutral-700 shadow-[0_0_40px_rgba(139,92,246,0.05)] ring-1 ring-neutral-700"
                      : "border-neutral-800/80"
                    }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <h3 className="text-4xl  text-white tracking-tight">
                        {plan.name}
                      </h3>
                      {isCurrentPlan ? (
                        <span className="px-3 py-1 text-[11px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-full uppercase">
                          Current Plan
                        </span>
                      ) : isPopular ? (
                        <span className="px-3 py-1 text-[11px] font-semibold tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800/40 rounded-full uppercase">
                          Most Popular
                        </span>
                      ) : null}
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col gap-1 mt-6">
                      {plan.id === "pro" && (
                        <span className="text-sm text-neutral-400 font-medium">From</span>
                      )}
                      <div className="flex items-start gap-1">
                        <span className="text-2xl font-semibold text-white mt-1">₹</span>
                        <span className="text-6xl  text-white tracking-tight leading-none">
                          {plan.price.toLocaleString()}
                        </span>
                        <div className="flex flex-col text-[12px] text-zinc-400 font-normal ml-2 mt-4 leading-tight">
                          <span>INR / month</span>
                          {plan.price > 0 && <span>(inclusive of GST)</span>}
                        </div>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="mt-4 text-base text-zinc-300 font-medium">
                      {plan.subtitle}
                    </p>

                    {/* Action Button */}
                    <button
                      onClick={() => handlePayment(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full mt-6 py-3.5 px-6 rounded-full font-semibold text-center transition-all duration-200 cursor-pointer ${isCurrentPlan
                          ? "bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-60"
                          : plan.id === "free"
                            ? "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                            : "bg-white hover:bg-neutral-200 text-neutral-900"
                        }`}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.buttonText}
                    </button>

                    {/* Everything In and Features */}
                    <div className="mt-8">
                      <p className="text-sm font-semibold text-zinc-200 mb-4">
                        {plan.everythingText}
                      </p>
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => {
                          const IconComponent = feature.icon;
                          return (
                            <li key={idx} className="flex items-start gap-3">
                              <IconComponent className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                              <span className="text-sm text-neutral-300 font-normal">
                                {feature.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Disclaimers inside Card */}
                  <div className="mt-8 pt-6 border-t border-neutral-900/60 text-[11px] text-neutral-500 space-y-2">
                    <p>Unlimited subject to abuse guardrails.</p>
                    <div className="flex flex-col gap-1.5">
                      <span className="hover:text-neutral-300 underline cursor-pointer transition-colors duration-150">
                        Learn about limits and promos on both tiers
                      </span>
                      <span className="hover:text-neutral-300 underline cursor-pointer transition-colors duration-150">
                        I need help with a billing issue
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;