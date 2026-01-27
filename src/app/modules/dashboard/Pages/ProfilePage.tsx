import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { Breadcrumb } from "../../../core/components/ui/breadcrumb";
import { Button } from "../../../core/components/ui/button";
import { Camera, Upload, Edit, X, Check, Pen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../core/components/ui/card";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAppSelector } from "../../../core/state/hooks";
import {
  selectAuthUser,
  selectIsFullyVerified,
  selectMissingVerificationItems,
} from "../../../core/state/selector/auth.selector";
import { getDashboardRoleFromUser } from "../../../core/constants/dashboard-paths";
import { ErrorBoundary } from "../../../core/components/error";
import { ProfileSkeleton } from "../../../core/components/ui/skeleton";
import {
  setVerificationFacial,
  setVerificationID,
  setVerificationSignatures,
  getVerificationFacial,
  getVerificationID,
  getVerificationSignatures,
  getFacialPhoto,
  setFacialPhoto as saveFacialPhotoToStorage,
  getSignaturePhoto,
  setSignaturePhoto as saveSignaturePhotoToStorage,
  getIdPhotos,
  setIdPhotos as saveIdPhotosToStorage,
} from "../../../core/helpers/auth-storage";
import SignaturePad from "signature_pad";
import { toast } from "sonner";
import { SIGNATURE_CONFIG } from "../../../core/constants/angelica-life-plan";
import { validateFaceInImage } from "../../../core/lib/faceValidation";
import { FacialVerificationCamera } from "../../../core/components/verification/FacialVerificationCamera";

export default function ProfilePage() {
  const currentUser = useAppSelector(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isProfileLoading = !currentUser;
  const isVerified = selectIsFullyVerified();
  const missingItems = selectMissingVerificationItems();

  // Verification state
  const [facialPhoto, setFacialPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [idImages, setIdImages] = useState<string[]>([]);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);

  const requirementLabels: Record<string, string> = {
    facial: "Facial verification (selfie)",
    id: "Upload valid ID",
    signatures: "Provide 3 specimen signatures",
  };

  // Get user role from Redux auth state (not from pathname)
  const authenticatedUserRole = currentUser?.role || "client";
  const userRole = getDashboardRoleFromUser(
    authenticatedUserRole as "admin" | "client" | "sc" | "um",
  );

  // Get user data from current user
  const email = currentUser?.email || "user@example.com";
  const fullName = currentUser?.name || "User";
  const phoneNumber = currentUser?.contact_number || "+63 912 345 6789";
  const isNonClientRole = userRole !== "client";
  const referralCode =
    currentUser?.referral_code || currentUser?.referral_link_code || "";
  const referralUrl = referralCode
    ? `https://sc.cclpi.com.ph/#/referral/${referralCode}`
    : "";

  // Clear verification state on mount if there's no actual photo data
  useEffect(() => {
    // Load facial photo from localStorage on mount
    const savedFacialPhoto = getFacialPhoto();
    const savedSignaturePhoto = getSignaturePhoto();
    const savedIdPhotos = getIdPhotos();

    if (savedFacialPhoto) {
      setFacialPhoto(savedFacialPhoto);
    } else if (getVerificationFacial()) {
      setVerificationFacial(false);
    }

    if (savedSignaturePhoto) {
      setSignatureImage(savedSignaturePhoto);
    } else if (getVerificationSignatures()) {
      setVerificationSignatures(false);
    }

    if (savedIdPhotos.length > 0) {
      setIdImages(savedIdPhotos);
    } else if (getVerificationID()) {
      setVerificationID(false);
    }
  }, []); // Only run on mount

  // Check if all verifications are complete and update status
  useEffect(() => {
    const isFacialDone = getVerificationFacial();
    const isSignatureDone = getVerificationSignatures();
    const isIDDone = getVerificationID();

    // Force re-render by recalculating derived state
    const allComplete = isFacialDone && isSignatureDone && isIDDone;

    if (allComplete) {
      // All verifications complete - status should be pending
      console.log("✓ All verifications complete - Status should be: PENDING");
    }
  }, [facialPhoto, signatureImage, idImages]); // Trigger on photo changes

  const handleCopyReferralLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch (e) {
      // noop
    }
  };

  const handleGoToVerification = () => {
    const el = document.getElementById("verification-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Facial Verification Handlers
  const handleFacialCapture = useCallback((imageData: string) => {
    setFacialPhoto(imageData);
    saveFacialPhotoToStorage(imageData);
    setVerificationFacial(true);
    setShowCamera(false);
    toast.success("Facial verification completed!");
  }, []);

  const handleUploadFacialPhoto = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      e.target.value = "";

      toast.loading("Validating face in photo...", { id: "upload-facial" });

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageData = event.target?.result as string;

          const result = await validateFaceInImage(imageData);

          if (!result.valid) {
            toast.error(result.error || "Validation failed", {
              id: "upload-facial",
            });
            return;
          }

          setFacialPhoto(imageData);
          saveFacialPhotoToStorage(imageData);
          setVerificationFacial(true);
          toast.success("✓ Facial verification completed!", {
            id: "upload-facial",
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("❌ Failed to upload photo", { id: "upload-facial" });
      }
    },
    [],
  );

  // Signature Handlers
  const initSignaturePad = useCallback(() => {
    setShowSignaturePad(true);
  }, []);

  // Initialize signature pad when canvas becomes available
  useEffect(() => {
    if (
      !showSignaturePad ||
      !signatureCanvasRef.current ||
      signaturePadRef.current
    )
      return;

    const rect = signatureCanvasRef.current.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    signatureCanvasRef.current.width = rect.width * ratio;
    signatureCanvasRef.current.height = 200 * ratio;
    signatureCanvasRef.current.style.width = `${rect.width}px`;
    signatureCanvasRef.current.style.height = "200px";

    const ctx = signatureCanvasRef.current.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    signaturePadRef.current = new SignaturePad(signatureCanvasRef.current, {
      penColor: SIGNATURE_CONFIG.penColor,
      backgroundColor: SIGNATURE_CONFIG.backgroundColor,
      minWidth: SIGNATURE_CONFIG.minWidth,
      maxWidth: SIGNATURE_CONFIG.maxWidth,
      throttle: SIGNATURE_CONFIG.throttle,
    });
  }, [showSignaturePad]);

  // Handle signature pad resize
  useEffect(() => {
    if (
      !showSignaturePad ||
      !signatureCanvasRef.current ||
      !signaturePadRef.current
    )
      return;

    const resizeCanvas = () => {
      if (!signatureCanvasRef.current || !signaturePadRef.current) return;
      const rect = signatureCanvasRef.current.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);

      signatureCanvasRef.current.width = rect.width * ratio;
      signatureCanvasRef.current.height = 200 * ratio;
      signatureCanvasRef.current.style.width = `${rect.width}px`;
      signatureCanvasRef.current.style.height = "200px";

      const ctx = signatureCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
      }

      const data = signaturePadRef.current.toData();
      signaturePadRef.current.clear();
      signaturePadRef.current.fromData(data);
    };

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [showSignaturePad]);

  const clearSignaturePad = useCallback(() => {
    signaturePadRef.current?.clear();
  }, []);

  const saveSignature = useCallback(() => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const imageData = signaturePadRef.current.toDataURL("image/png");
      setSignatureImage(imageData);
      saveSignaturePhotoToStorage(imageData);
      setVerificationSignatures(true);
      toast.success("Signature saved!");
      setShowSignaturePad(false);
    } else {
      toast.error("Please provide a signature first");
    }
  }, []);

  const handleUploadSignature = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          setSignatureImage(imageData);
          saveSignaturePhotoToStorage(imageData);
          setVerificationSignatures(true);
          toast.success("Signature uploaded!");
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  // ID Upload Handlers
  const handleUploadID = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0]; // Get the first (and only) file
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const imageData = reader.result as string;
          if (imageData) {
            const imageArray = [imageData];
            setIdImages(imageArray);
            saveIdPhotosToStorage(imageArray);
            setVerificationID(true);
            toast.success("ID with 3 specimen signatures uploaded!");
            // Reset the input value after successful read
            e.target.value = "";
          }
        } catch (error) {
          console.error("Error reading file:", error);
          toast.error("Failed to upload image. Please try again.");
        }
      };

      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        toast.error("Failed to read the file. Please try again.");
      };

      reader.readAsDataURL(file);
    },
    [],
  );

  const handleDownloadQR = async () => {
    if (!referralUrl) return;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
      referralUrl,
    )}`;
    try {
      const res = await fetch(qrSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `referral-qr-${referralCode || "code"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // noop
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <TopNav minimal onMenuClick={() => setSidebarOpen(true)} />

        <div className="md:ml-60">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="content-with-topnav-compact pb-10"
          >
            <div className="px-4 sm:px-2 md:px-4 lg:px-6 space-y-3 sm:space-y-3">
              <div className="mb-4">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/dashboard" },
                    { label: "Profile", href: "#" },
                  ]}
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                Profile Overview
              </h2>
              {isProfileLoading ? (
                <ProfileSkeleton />
              ) : (
                <>
                  {/* Account Verification Alert */}
                  {!isVerified && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/50 rounded-xl p-4 md:p-6"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-200 dark:bg-orange-900/60 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl md:text-2xl">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            Account Verification Pending
                          </h3>
                          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                            To fully verify, please complete:
                          </p>
                          <ul className="mt-2 list-disc list-inside text-xs md:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            {missingItems.map((item) => (
                              <li key={item}>{requirementLabels[item]}</li>
                            ))}
                          </ul>
                          <div className="mt-3">
                            <Button
                              onClick={handleGoToVerification}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Start Verification
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg">
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            Full Name
                          </label>
                          <p className="text-sm md:text-base font-medium text-slate-900 dark:text-white mt-1">
                            {fullName}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            Email Address
                          </label>
                          <p className="text-sm md:text-base font-medium text-slate-900 dark:text-white mt-1 break-all">
                            {email}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            Phone Number
                          </label>
                          <p className="text-sm md:text-base font-medium text-slate-900 dark:text-white mt-1">
                            {phoneNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            Account Status
                          </label>
                          {isVerified ? (
                            <p className="text-sm md:text-base font-medium text-green-600 mt-1">
                              Verified
                            </p>
                          ) : getVerificationFacial() &&
                            getVerificationSignatures() &&
                            getVerificationID() ? (
                            <p className="text-sm md:text-base font-medium text-blue-600 mt-1">
                              Pending
                            </p>
                          ) : (
                            <p className="text-sm md:text-base font-medium text-orange-600 mt-1">
                              Unverified
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* QR Code and Referral Section - Only for non-client roles */}
                  {isNonClientRole && referralUrl && (
                    <Card className="mt-2">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4">
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
                                referralUrl,
                              )}`}
                              alt="Referral QR"
                              className="h-64 w-64 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <Button onClick={handleDownloadQR} className="w-48">
                            DOWNLOAD QR
                          </Button>
                          <div className="text-center">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {fullName}
                            </p>
                            {referralCode && (
                              <p className="text-slate-600 dark:text-slate-400">
                                {referralCode}
                              </p>
                            )}
                          </div>
                          <div className="w-full max-w-xl space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Sales Counselor Referral Link
                            </label>
                            <div className="flex gap-2">
                              <input
                                value={referralUrl}
                                readOnly
                                className="flex-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                              />
                              <Button
                                variant="outline"
                                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                                onClick={handleCopyReferralLink}
                              >
                                COPY
                              </Button>
                            </div>
                          </div>

                          {/* Sales Counselor Calling Card */}
                          <div className="w-full max-w-xl space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">
                              Sales Counselor Calling Card
                            </label>
                            <div className="flex gap-2">
                              <input
                                value="Click to generate Calling Card PDF."
                                readOnly
                                className="flex-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                              />
                              <Button
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                              >
                                OPEN
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Facial Verification */}
                  <Card
                    id="verification-section"
                    className={`border ${
                      getVerificationFacial()
                        ? "border-green-200/60 bg-green-50/70 dark:border-green-900/50 dark:bg-green-950/40"
                        : "border-blue-200/60 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/40"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 md:gap-3">
                        <Camera
                          className={`w-5 h-5 md:w-6 md:h-6 ${
                            getVerificationFacial()
                              ? "text-green-600 dark:text-green-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                        <CardTitle className="text-base md:text-lg">
                          Facial Verification{" "}
                          {getVerificationFacial() && (
                            <Check className="inline w-5 h-5 text-green-600" />
                          )}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {facialPhoto ? (
                        <div className="space-y-4">
                          <img
                            src={facialPhoto}
                            alt="Selfie"
                            className="w-full max-w-md mx-auto rounded-xl border-2 border-green-200 dark:border-green-800"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              setFacialPhoto(null);
                              saveFacialPhotoToStorage(null);
                              setVerificationFacial(false);
                            }}
                            className="w-full sm:w-auto"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove Photo
                          </Button>
                        </div>
                      ) : showCamera ? (
                        <FacialVerificationCamera
                          onCapture={handleFacialCapture}
                          onClose={() => setShowCamera(false)}
                        />
                      ) : (
                        <div>
                          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-4">
                            To verify your account, we need to confirm that you
                            are the same person who uploaded the ID and
                            signatures. Please take a selfie or upload a clear
                            photo of your face.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <Button
                              onClick={() => setShowCamera(true)}
                              className="w-full sm:w-auto"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Take Selfie
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full sm:w-auto"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Photo
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleUploadFacialPhoto}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Signature */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        Signature
                        {getVerificationSignatures() && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </CardTitle>
                      {signatureImage && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSignatureImage(null);
                            saveSignaturePhotoToStorage(null);
                            setVerificationSignatures(false);
                            signaturePadRef.current = null;
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {signatureImage ? (
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                          <div className="border-2 border-green-200 dark:border-green-800 rounded-xl p-6 md:p-8 h-40 md:h-48 flex items-center justify-center bg-white dark:bg-slate-950">
                            <img
                              src={signatureImage}
                              alt="Signature"
                              className="max-h-full"
                            />
                          </div>
                          <div className="flex items-center">
                            <ul className="list-disc list-inside text-xs md:text-sm text-slate-500 dark:text-slate-400 space-y-2">
                              <li>
                                The Signature uploaded is protected by the data
                                privacy law
                              </li>
                              <li className="text-green-600 dark:text-green-400 font-medium">
                                Signature verified
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : showSignaturePad ? (
                        <div className="space-y-4">
                          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                            <canvas
                              ref={signatureCanvasRef}
                              className="w-full"
                              style={{ display: "block" }}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={saveSignature}
                              className="w-full sm:w-auto"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Save Signature
                            </Button>
                            <Button
                              variant="outline"
                              onClick={clearSignaturePad}
                              className="w-full sm:w-auto"
                            >
                              Clear
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowSignaturePad(false);
                                signaturePadRef.current = null;
                              }}
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 h-40 md:h-48 flex items-center justify-center">
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                              No signature uploaded
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={initSignaturePad}
                              className="w-full sm:w-auto"
                            >
                              <Pen className="w-4 h-4 mr-2" />
                              Sign with Pad
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                signatureFileInputRef.current?.click()
                              }
                              className="w-full sm:w-auto"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Signature
                            </Button>
                            <input
                              ref={signatureFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleUploadSignature}
                              className="hidden"
                            />
                          </div>
                          <div className="flex items-center">
                            <ul className="list-disc list-inside text-xs md:text-sm text-slate-500 dark:text-slate-400 space-y-2">
                              <li>
                                The Signature uploaded is protected by the data
                                privacy law
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ID with 3 Specimen Signature */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        ID with 3 Specimen Signature
                        {getVerificationID() && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </CardTitle>
                      {idImages.length > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setIdImages([]);
                            saveIdPhotosToStorage([]);
                            setVerificationID(false);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {idImages.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="border-2 border-green-200 dark:border-green-800 rounded-xl p-4 bg-white dark:bg-slate-950 max-w-md">
                              <img
                                src={idImages[0]}
                                alt="ID with 3 Specimen Signatures"
                                className="w-full h-64 object-contain"
                              />
                              <p className="text-xs text-center mt-2 text-slate-600 dark:text-slate-400">
                                ID with 3 Specimen Signatures
                              </p>
                            </div>
                          </div>
                          {idImages.length === 1 && (
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              ✓ ID with 3 specimen signatures uploaded
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 h-48 md:h-64 flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-2">
                                No ID uploaded
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                Upload 1 photo of your ID with 3 specimen
                                signatures on bond paper
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => idFileInputRef.current?.click()}
                            className="w-full sm:w-auto"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload ID with 3 Signatures
                          </Button>
                          <input
                            ref={idFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUploadID}
                            className="hidden"
                          />
                          <div className="flex items-center">
                            <ul className="list-disc list-inside text-xs md:text-sm text-slate-500 dark:text-slate-400 space-y-2">
                              <li>
                                The ID and Signatures uploaded are protected by
                                the data privacy law
                              </li>
                              <li>
                                Please upload 1 photo showing your ID with 3
                                specimen signatures on bond paper
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </motion.main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
