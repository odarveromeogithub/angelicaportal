import { STORAGE_KEYS } from "../config/storage";

export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setTokens = (
  accessToken: string,
  refreshToken?: string | null,
) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// Verification helpers
export const getVerificationCompleted = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.VERIFICATION_COMPLETED) === "true";
};

export const setVerificationCompleted = (completed: boolean) => {
  localStorage.setItem(
    STORAGE_KEYS.VERIFICATION_COMPLETED,
    completed ? "true" : "false",
  );
};

export const clearVerificationCompleted = () => {
  localStorage.removeItem(STORAGE_KEYS.VERIFICATION_COMPLETED);
};

// Individual verification item helpers
export const getVerificationFacial = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.VERIFICATION_FACIAL) === "true";
};

export const setVerificationFacial = (completed: boolean) => {
  localStorage.setItem(
    STORAGE_KEYS.VERIFICATION_FACIAL,
    completed ? "true" : "false",
  );
  checkAndUpdateFullVerification();
};

export const getVerificationID = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.VERIFICATION_ID) === "true";
};

export const setVerificationID = (completed: boolean) => {
  localStorage.setItem(
    STORAGE_KEYS.VERIFICATION_ID,
    completed ? "true" : "false",
  );
  checkAndUpdateFullVerification();
};

export const getVerificationSignatures = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.VERIFICATION_SIGNATURES) === "true";
};

export const setVerificationSignatures = (completed: boolean) => {
  localStorage.setItem(
    STORAGE_KEYS.VERIFICATION_SIGNATURES,
    completed ? "true" : "false",
  );
  checkAndUpdateFullVerification();
};

// Check if all items are completed and update overall status
const checkAndUpdateFullVerification = () => {
  const allComplete =
    getVerificationFacial() &&
    getVerificationID() &&
    getVerificationSignatures();
  setVerificationCompleted(allComplete);
};

// Get missing verification items
export const getMissingVerificationItems = (): string[] => {
  const missing: string[] = [];
  if (!getVerificationFacial()) missing.push("facial");
  if (!getVerificationID()) missing.push("id");
  if (!getVerificationSignatures()) missing.push("signatures");
  return missing;
};
