"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { checkUserSession } from "@/lib/auth/auth-utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    checkUserSession(router);
  }, [router]);

  // Handle forgot password request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMessage(
        "Password reset link has been sent to your email. Please check your inbox."
      );
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="text-3xl font-bold text-purple-600">
              <Image
                src="/logo/flowva_logo.png"
                height={150}
                width={300}
                alt="Flowva Logo"
                className="h-20 w-auto"
              />
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h3>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700">
                {successMessage}
              </div>
            )}

            {!successMessage ? (
              <>
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending Reset Link...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <Link
                  href="/signin"
                  className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <FiArrowLeft size={16} />
                  Back to Login
                </Link>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>

                <Link
                  href="/signin"
                  className="inline-block w-full bg-linear-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Link to Sign Up */}
        <div className="text-center text-gray-500 text-sm mt-8">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-600 hover:text-purple-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
