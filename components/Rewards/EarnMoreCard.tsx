"use client";

import React, { useState } from "react";
import { LuStar, LuShare2, LuX } from "react-icons/lu";
import { BsStack } from "react-icons/bs";

export default function EarnMoreSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="w-full mx-auto font-sans relative">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[5px] h-9 bg-[#a800ff] rounded-full" />
        <h2 className="text-[25px] font-semibold text-[#111827]">
          Earn More Points
        </h2>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Referral Card */}
        <div className="bg-white rounded-[24px] border border-slate-200 hover:border-purple-700 hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-1300 ease-out">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f5ebff] flex items-center justify-center flex-shrink-0">
              <LuStar className="text-[#a800ff] text-xl" />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">
              Refer and win 10,000 points!
            </h3>
          </div>
          <div className="flex-1 bg-[#f8fafc] p-4 border-t border-slate-100">
            <p className="text-[#000000] text-[14px] leading-relaxed">
              Invite 3 friends by{" "}
              <span className="font-semibold text-slate-900">Nov 20</span> and
              earn a chance to be one of 5 winners of{" "}
              <span className="text-[#a800ff] font-medium">10,000 points</span>.
              Friends must complete onboarding to qualify.
            </p>
          </div>
        </div>

        {/* Card 2: Share Card */}
        <div className="bg-white rounded-[24px] border border-slate-200 hover:border-purple-700 hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-1300 ease-out">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f5ebff] flex items-center justify-center flex-shrink-0">
              <LuShare2 className="text-[#a800ff] text-xl" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-slate-800">
                Share Your Stack
              </h3>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">
                Earn +25 pts
              </p>
            </div>
          </div>
          <div className="flex-1 p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-700 text-[14px] font-medium -mt-10">
              Share your tool stack
            </p>

            <button
              onClick={toggleModal}
              className="bg-[#f3ebff] hover:bg-[#ebdfff] transition-all px-4 py-2 rounded-full flex items-center gap-3 group -mt-10"
            >
              <LuShare2 className="text-[#a800ff] text-xl transition-transform group-hover:scale-110" />
              <span className="text-[#a800ff] font-bold text-[14px]">
                Share
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Popup Implementation */}
      {isModalOpen && (
        <>
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
            onClick={toggleModal}
          />

          {/* Popup Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg p-8 shadow-2xl relative text-center">
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute right-8 top-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LuX size={20} />
              </button>

              {/* Title */}
              <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                Share Your Stack
              </h2>

              {/* Stack Icon in Purple Circle */}
              <div className="w-11 h-11 bg-[#f3ebff] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BsStack className="text-[#a800ff] text-xl" />
              </div>

              {/* Description Text */}
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                You have no stack created yet, go to{" "}
                <span className="font-semibold text-gray-800">Tech Stack</span>{" "}
                to create one.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
