import React, { useState } from "react";
import { BookingSlot, TierId } from "../types";
import { BOOKING_SLOTS } from "../data";
import { Calendar, Clock, Video, Lock, CheckCircle2, Ticket, Sparkles, Send } from "lucide-react";

interface SchedulerProps {
  currentTier: TierId;
  userName: string;
  userEmail: string;
  onUpgradePrompt: () => void;
}

export default function Scheduler({ currentTier, userName, userEmail, onUpgradePrompt }: SchedulerProps) {
  const [slots, setSlots] = useState<BookingSlot[]>(BOOKING_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [focusProblem, setFocusProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<BookingSlot | null>(null);
  const [bookingRef, setBookingRef] = useState("");

  const isEligible = currentTier === "masterclass";

  const handleBookingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const activeSlot = slots.find((s) => s.id === selectedSlotId);
      if (activeSlot) {
        setSlots(slots.map((s) => (s.id === selectedSlotId ? { ...s, isAvailable: false } : s)));
        setBookedSlot(activeSlot);
        setBookingRef(`BOOK-RIV-${Math.floor(100000 + Math.random() * 900000)}`);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const handleResetBooking = () => {
    setBookedSlot(null);
    setSelectedSlotId(null);
    setFocusProblem("");
    setBookingRef("");
  };

  return (
    <div id="booking-portal-container" className="my-8 font-sans">
      {!isEligible ? (
        /* LOCK SCREEN (Gatekeeper verification failure) */
        <div id="scheduler-paywall-interstitial" className="bg-[#111112] border border-white/10 rounded-[2rem] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-6 h-6 text-indigo-400 shrink-0" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 font-mono tracking-wider uppercase mb-4 border border-indigo-500/25">
            MEMBERSHIP GATEKEEPER VERIFICATION
          </span>

          <h3 className="text-2.5xl font-display font-medium text-white tracking-tight">
            1-on-1 Consulting Scheduler Locked
          </h3>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-sm mx-auto font-sans">
            Our automated gatekeeper system has checked your subscriber metadata. Personal consulting dates with lead advisor <strong className="text-white font-medium">Alex Rivers</strong> are restricted exclusively to members of our <strong className="text-indigo-400 font-semibold font-display">Elite Masterclass</strong> plan.
          </p>

          <div id="verification-results" className="my-8 bg-black/40 p-5 rounded-2xl max-w-sm mx-auto text-left border border-white/10 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Your current tier</span>
              <span className="font-bold text-white capitalize">{currentTier} Member</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Requirement</span>
              <span className="font-bold text-indigo-400">Elite Masterclass</span>
            </div>
            <div className="flex justify-between text-gray-500 pt-2 border-t border-white/5">
              <span>Status</span>
              <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider">INSUFFICIENT PERKS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onUpgradePrompt}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl font-bold font-mono text-xs tracking-wider shadow-md active:scale-98 cursor-pointer transition-all uppercase"
            >
              Upgrade to Masterclass
            </button>
            <button
              onClick={() => alert("Basic members get aggregate feedback in our monthly QA forums. Check the Community Hub!")}
              className="px-5 py-3 text-xs font-semibold text-gray-400 hover:text-white uppercase font-mono tracking-wider cursor-pointer"
            >
              Check Basic Perks Instead
            </button>
          </div>
        </div>
      ) : bookedSlot ? (
        /* BOOKING SUCCESS SCREEN */
        <div id="booking-success-summary" className="bg-[#111112] border border-emerald-500/20 rounded-[2rem] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-emerald-505/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6 shrink-0">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 font-mono uppercase mb-4 tracking-wider border border-emerald-500/15">
            AUTOMATED BOOKING VERIFIED
          </span>

          <h3 className="text-2.5xl font-display font-medium text-white tracking-tight">
            Consultation Scheduled Effectively
          </h3>
          <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed font-sans">
            Congratulations, your technical launch consulting slot has been registered. You will meet with <strong className="text-white">Alex Rivers</strong> via our integrated video channel.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 bg-black/40 p-6 rounded-2xl border border-white/10 text-left mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Consulting Date</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {new Date(bookedSlot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Assigned Slot Time</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {bookedSlot.time} (UTC)
              </div>
            </div>

            <div className="col-span-2 border-t border-white/5 pt-4 mt-2 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Client Details</span>
              <div className="text-xs font-semibold text-gray-300 capitalize">
                {userName} ({userEmail})
              </div>
            </div>

            <div className="col-span-2 border-t border-white/5 pt-4 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Secure Access Ref</span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400">
                <Ticket className="w-3.5 h-3.5" />
                {bookingRef}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleResetBooking}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider cursor-pointer border border-white/10 transition-colors"
            >
              Book Another Call
            </button>
            <button
              onClick={() => alert("Dynamic video call simulator initiated: Alex is reading your code audit feedback...")}
              className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              Simulate Video Lobby
            </button>
          </div>
        </div>
      ) : (
        /* LIVE CALENDAR SCREEN (unlocked for masterclass members) */
        <div id="live-calendar-scheduler" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#111112] border border-white/10 rounded-[2rem] p-6 sm:p-8">
          
          {/* Calendar Selectors Left Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex gap-1 items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 font-mono uppercase border border-indigo-500/20 mb-3 tracking-wider">
                <Sparkles className="w-3 h-3 fill-current" />
                Elite Access Verified
              </span>
              <h3 className="text-xl font-display font-medium text-white tracking-tight">
                Select Your Private Consult Time
              </h3>
              <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-normal font-sans">
                Choose an available slot in June 2026. All times are represented in Universal UTC.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      !slot.isAvailable
                        ? "bg-black/20 border-white/5 text-gray-600 cursor-not-allowed opacity-40"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500 text-indigo-400"
                        : "border-white/10 bg-black/40 hover:border-white/20 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-gray-500"}`} />
                      <div className="text-xs">
                        <div className="font-bold text-white font-sans">
                          {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-gray-400 font-mono mt-0.5">{slot.time}</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md ${
                      slot.isAvailable 
                        ? (isSelected ? "bg-indigo-600 text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15")
                        : "bg-white/5 text-gray-500"
                    }`}>
                      {slot.isAvailable ? (isSelected ? "SELECTED" : "AVAILABLE") : "BOOKED"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm details Right Side (7 cols) */}
          <div className="lg:col-span-7 h-full">
            {selectedSlotId ? (
              <form onSubmit={handleBookingConfirm} className="bg-black/40 p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between space-y-5 h-full">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-widest">Confirm Consultation Context</h4>
                  
                  <div className="p-4 bg-[#111112] rounded-xl border border-white/10 text-xs flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-indigo-400 font-mono text-[9px] uppercase tracking-wider">Selected Appointment</span>
                      <span className="font-semibold text-white block mt-1">
                        {slots.find((s) => s.id === selectedSlotId)?.date} @ {slots.find((s) => s.id === selectedSlotId)?.time}
                      </span>
                    </div>
                    <Video className="w-5 h-5 text-gray-500" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 font-mono uppercase mb-1.5 tracking-wider">Client Identity</label>
                    <input
                      type="text"
                      disabled
                      value={userName}
                      className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 font-mono uppercase mb-1.5 tracking-wider">Audit Request Case Details</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="e.g. Please audit my server.ts file where I parse stream chunks. My rate limits are trigger-happy under scale, and I'd like your design review."
                      value={focusProblem}
                      onChange={(e) => setFocusProblem(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111112] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-1.5">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Locking Schedule Slot...
                    </div>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Book Verification Slot
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="h-full min-h-[320px] bg-black/20 border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 font-sans">
                <Calendar className="w-8 h-8 opacity-20 mb-3 text-indigo-400" />
                <p className="text-xs font-sans max-w-xs">Please select an available calendar slot from the panel to configure your private consultation.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
