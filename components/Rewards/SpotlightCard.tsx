import Image from "next/image";
import { LuCalendar } from "react-icons/lu";
import { FaGift, FaUserPlus } from "react-icons/fa6";

export default function SpotlightCard() {
  return (
    // Main card container with shadow and rounded corners
    <div className="w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl  overflow-hidden font-sans leading-snug transition-all duration-600 ease-out hover:-translate-y-1">
      {/* === HEADER SECTION (Gradient Background) === */}
      <div className="relative bg-[linear-gradient(135deg,#9013FE_0%,#70D6FF_100%)] p-4 text-white h-35 flex flex-col justify-center">
        {/* Featured Badge */}
        <div className="absolute top-4">
          <span className="bg-white/25 backdrop-blur-sm text-xs font-bold px-4 py-1.5 rounded-full">
            Featured
          </span>
        </div>

        {/* Header Text */}
        <div className="mt-6 z-10">
          <div className=" flex justify-between items-center">
            <h2 className="text-xl font-bold opacity-95">Top Tool Spotlight</h2>
            <Image
              src="/utils/reclaim-removebg-preview(1).png"
              height={400}
              width={400}
              alt="reclaim"
              className=" h-15 w-15"
            />
          </div>
          <h1 className="text-xl font-bold mt-0">Reclaim</h1>
        </div>
      </div>

      {/* === BODY SECTION (White Background) === */}
      <div className="p-2 pt-4 px-4 bg-white">
        {/* Content Area with Icon and Text */}
        <div className="flex items-start space-x-5">
          {/* Calendar Icon */}
          <div className="shrink-0 text-[#7a25ea] text-2xl">
            <LuCalendar />
          </div>

          {/* Text Content */}
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 leading-tight pt-1">
              Automate and Optimize Your Schedule
            </h3>
            <p className="text-gray-600 mt-1 text-[14px] leading-relaxed">
              Reclaim.ai is an AI-powered calendar assistant that automatically
              schedules your tasks, meetings, and breaks to boost productivity.
              Free to try — earn Flowva Points when you sign up!
            </p>
          </div>
        </div>

        {/* === BUTTONS SECTION === */}
        <div className="mt-8 flex justify-between gap-5">
          {/* Sign up Button (Solid Purple) */}
          <button className=" flex items-center justify-center gap-2 bg-[#9f25ea] hover:bg-[#8a1ed0] transition-colors text-white font-bold text-sm py-1 px-4 rounded-full h-10 w-fit">
            <FaUserPlus />
            Sign up
          </button>

          {/* Claim points Button (Gradient Pink/Purple) */}
          <button className=" flex items-center justify-center gap-2 bg-gradient-to-r from-[#d123e1] to-[#f75f7d] hover:opacity-90 transition-opacity text-white font-bold text-sm py-1 px-4 rounded-full  h-10 w-fit">
            <FaGift />
            Claim 50 pts
          </button>
        </div>
      </div>
    </div>
  );
}
