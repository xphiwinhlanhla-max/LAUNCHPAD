import React, { useState } from "react";
import { MEMBERSHIP_TIERS } from "../data";
import { MembershipTier, TierId } from "../types";
import { Check, Flame, Zap } from "lucide-react";

interface PricingMatrixProps {
  onSelectTier: (tier: MembershipTier, isAnnual: boolean) => void;
  currentTier: TierId;
}

export default function PricingMatrix({ onSelectTier, currentTier }: PricingMatrixProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div id="pricing-matrix" className="py-12 bg-[#111112] rounded-[2rem] border border-white/10 px-6 sm:px-12 my-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px] pointer-events-none" />
      
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 mb-4 font-mono uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          CHOOSE YOUR LEVEL OF MOMENTUM
        </div>
        <h2 className="text-3.5xl font-display font-medium tracking-tight text-white sm:text-4xl">
          Membership Pricing & Access Tiers
        </h2>
        <p className="mt-4 text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Scale your launch, secure code-level reviews, or establish a persistent technical system to achieve commercial readiness.
        </p>

        {/* Annual / Monthly Billing Toggle */}
        <div className="mt-8 flex justify-center items-center gap-4 relative z-10">
          <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${!isAnnual ? "text-indigo-400" : "text-gray-500"}`}>
            Bill Monthly
          </span>
          <button
            id="billing-cycle-toggle"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAnnual ? "translate-x-5 bg-indigo-600" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-1.5 ${isAnnual ? "text-indigo-400" : "text-gray-500"}`}>
            Bill Annually
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch relative z-10">
        {MEMBERSHIP_TIERS.map((tier) => {
          const isCurrentActive = currentTier === tier.id;
          const monthlyPrice = parseInt(tier.price, 10);
          const displayPrice = isAnnual 
            ? Math.floor(monthlyPrice * 0.8) 
            : monthlyPrice;

          return (
            <div
              key={tier.id}
              id={`tier-card-${tier.id}`}
              className={`relative flex flex-col justify-between rounded-3xl p-8 bg-black/40 border transition-all duration-300 shadow-xl ${
                tier.popular 
                  ? "border-indigo-500 ring-2 ring-indigo-500/10 scale-102 z-10" 
                  : "border-white/10 hover:border-white/15"
              }`}
            >
              {tier.popular && (
                <div id="badge-popular" className="absolute -top-4 right-8 flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold bg-indigo-600 text-white shadow-lg font-mono uppercase tracking-widest">
                  <Flame className="w-3 h-3 fill-current" />
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide">{tier.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold font-mono border bg-white/5 border-white/10 text-indigo-300">
                    {tier.id.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-gray-400 tracking-wide leading-relaxed min-h-[48px] mt-2 font-sans">{tier.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-semibold tracking-tight text-white font-mono">
                    ${displayPrice}
                  </span>
                  <span className="ml-2 text-xs font-medium text-gray-500">/{tier.period}</span>
                </div>

                {isAnnual && (
                  <div className="text-[10px] font-mono font-medium text-emerald-400 mt-1">
                    Billed annually at ${displayPrice * 12}/yr
                  </div>
                )}

                <ul id={`features-list-${tier.id}`} className="mt-8 space-y-4">
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id={`subscribe-btn-${tier.id}`}
                  onClick={() => onSelectTier(tier, isAnnual)}
                  disabled={isCurrentActive}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                    isCurrentActive
                      ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                      : tier.popular
                      ? "bg-indigo-600 hover:bg-indigo-505 text-white shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                      : "bg-white text-black hover:bg-gray-100 active:scale-[0.98]"
                  }`}
                >
                  {isCurrentActive ? "Active Subscriber" : `Join ${tier.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
