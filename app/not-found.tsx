"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaHome,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  // Countdown timer for automatic redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image
              src="/logo/flowva_logo.png"
              height={180}
              width={400}
              alt="Flowva Logo"
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left: Illustration and Error Code */}
            <div className="lg:w-2/5 text-center lg:text-left">
              <div className="relative inline-block mb-8">
                <div className="w-64 h-64 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-linear-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-linear-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="text-6xl text-purple-600" />
                    </div>
                  </div>
                </div>
                {/* Floating number */}
                <div className="absolute -top-4 -right-4">
                  <span className="text-9xl font-black text-purple-600/20">
                    4
                  </span>
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <span className="text-9xl font-black text-purple-600/20">
                    4
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 mb-4">
                  404
                </h1>
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                  Page Not Found
                </p>
              </div>
            </div>

            {/* Right: Message and Actions */}
            <div className="lg:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Oops! Lost in the Reward Space?
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                The page you're looking for seems to have vanished into the
                digital void. Don't worry, you can still earn amazing rewards!
              </p>

              <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 text-purple-700 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <p className="font-semibold">
                    Redirecting in {countdown} seconds
                  </p>
                </div>
                <p className="text-purple-600 text-sm">
                  You'll be automatically taken back to the home page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                  href="/"
                  className="group bg-linear-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-200"
                >
                  <FaHome className="text-xl" />
                  Back to Home
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="bg-white text-gray-800 p-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200"
                >
                  <FaArrowLeft />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Still having trouble?{" "}
            <Link
              href="mailto:support@flowva.com"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 opacity-10">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-purple-600"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-16 h-16 opacity-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-600">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
