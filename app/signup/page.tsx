"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {
  storeReferralCode,
  createUserNotifications,
  processUserReferral,
  checkUserSession,
} from "@/lib/auth/auth-utils";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get referral code from URL
  const referralCode = searchParams.get("ref");

  // Store referral code if present in URL
  useEffect(() => {
    if (referralCode) {
      storeReferralCode(referralCode);
    }
  }, [referralCode]);

  // Check if user is already logged in
  useEffect(() => {
    checkUserSession(router);
  }, [router]);

  // Handle email/password signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Register with referral code if present
      const userMetadata: any = {};
      if (referralCode) {
        userMetadata.referral_code = referralCode;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Show success message for email confirmation
        if (data.user.identities?.length === 0) {
          throw new Error("User already registered. Please sign in instead.");
        }

        // ✅ CREATE NOTIFICATIONS AND REFERRAL CODE FOR NEW USER
        await createUserNotifications(data.user.id);

        // ✅ PROCESS REFERRAL FOR NEW USER
        await processUserReferral(data.user.id);

        // For demo purposes, auto-login after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If auto-login fails, show success message
          setSuccessMessage(
            "Registration successful! Please check your email to confirm your account."
          );
          setLoading(false);
          return;
        }

        router.push("/dashboard/earn-rewards");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;

      // Store referral code in localStorage for OAuth callback
      if (referralCode) {
        storeReferralCode(referralCode);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      setGoogleLoading(false);
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

        {/* Show referral banner if referral code exists */}
        {referralCode && (
          <div className="mb-6 bg-linear-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-purple-700 font-medium">
              🎉 You've been invited to join Flowva!
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Sign up with this referral to earn bonus rewards
            </p>
            <p className="text-xs text-purple-500 mt-2">
              Referral Code:{" "}
              <span className="font-mono font-bold">{referralCode}</span>
            </p>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Join Flowva and start earning rewards
          </p>

          {error && (
            <div className="p-3 rounded-lg mb-6 text-sm bg-red-50 text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg mb-6 text-sm bg-green-50 text-green-700">
              {successMessage}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <svg
                className="animate-spin h-5 w-5"
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
            ) : (
              <>
                <FcGoogle className="text-xl" />
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">
              Or continue with email
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
                minLength={6}
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Link to Sign In */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By continuing, you agree to Flowva's{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
