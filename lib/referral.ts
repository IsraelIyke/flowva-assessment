const REFERRAL_STORAGE_KEY = "flowva_referral_data";
const REFERRAL_PROCESSED_KEY = "flowva_referral_processed";

export interface ReferralData {
  code: string;
  timestamp: string;
  source: "url" | "share" | "manual";
}

// Save referral code to localStorage
export const saveReferralCode = (
  code: string,
  source: ReferralData["source"] = "url"
) => {
  const referralData: ReferralData = {
    code,
    timestamp: new Date().toISOString(),
    source,
  };
  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referralData));
  localStorage.removeItem(REFERRAL_PROCESSED_KEY);
  return referralData;
};

// Get stored referral code
export const getStoredReferral = (): ReferralData | null => {
  const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Check if referral was already processed
export const isReferralProcessed = (): boolean => {
  return localStorage.getItem(REFERRAL_PROCESSED_KEY) === "true";
};

// Mark referral as processed
export const markReferralProcessed = () => {
  localStorage.setItem(REFERRAL_PROCESSED_KEY, "true");
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
};

// Clear referral data
export const clearReferralData = () => {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
  localStorage.removeItem(REFERRAL_PROCESSED_KEY);
};
