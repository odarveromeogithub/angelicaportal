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
import { toast } from "sonner";
import { validateFaceInImage } from "../../../core/lib/faceValidation";
import { FacialVerificationCamera } from "../../../core/components/verification/FacialVerificationCamera";
import { usePermissions } from "../../../core/hooks/usePermissions";
import { useSignaturePad } from "../../../core/hooks/useSignaturePad";
import { useFileUpload } from "../../../core/hooks/useFileUpload";

export default function ProfilePage() {
  const currentUser = useAppSelector(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isProfileLoading = !currentUser;
  const isVerified = selectIsFullyVerified();
  const missingItems = selectMissingVerificationItems();

  // Verification state
  const [facialPhoto, setFacialPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [idImages, setIdImages] = useState<string[]>([]);

  const signaturePad = useSignaturePad({
    initialSignature: getSignaturePhoto(),
  });
  const fileUpload = useFileUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);

  const requirementLabels: Record<string, string> = {
    facial: "Facial verification (selfie)",
    id: "Upload valid ID",
    signatures: "Provide 3 specimen signatures",
  };

  // Permissions and user data
  const permissions = usePermissions();
  const {
    user: userFromPermissions,
    dashboardRole: userRole,
    isNonClientRole,
    referralCode,
    referralUrl,
  } = permissions;

  // Get user data from permissions
  const email = userFromPermissions?.email || "user@example.com";
  const fullName = userFromPermissions?.name || "User";
  const phoneNumber = userFromPermissions?.contact_number || "+63 912 345 6789";

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
      // Signature is now initialized via hook options
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
  }, [facialPhoto, idImages]); // Trigger on photo changes

  const handleCopyReferralLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
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

      try {
        const result = await fileUpload.uploadFile(file);
        if (result) {
          const validationResult = await validateFaceInImage(result);
          if (!validationResult.valid) {
            throw new Error(validationResult.error || "Validation failed");
          }

          setFacialPhoto(result);
          saveFacialPhotoToStorage(result);
          setVerificationFacial(true);
          toast.success("✓ Facial verification completed!");
        }
      } catch (error) {
        toast.error(
          `❌ ${error instanceof Error ? error.message : "Failed to upload photo"}`,
        );
      }
    },
    [fileUpload],
  );

  // Signature Handlers
  const initSignaturePad = useCallback(() => {
    signaturePad.openModal();
  }, [signaturePad]);

  const clearSignaturePad = useCallback(() => {
    signaturePad.clear();
  }, [signaturePad]);

  const saveSignature = useCallback(() => {
    signaturePad.saveSignature(() => {
      setVerificationSignatures(true);
      toast.success("Signature saved!");
    });
  }, [signaturePad]);

  const handleUploadSignature = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      signaturePad.uploadSignature(e.target.files?.[0] || null, () => {
        setVerificationSignatures(true);
        toast.success("Signature uploaded!");
      });
    },
    [signaturePad],
  );

  // ID Upload Handlers
  const handleUploadID = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const result = await fileUpload.uploadFile(file);
        if (result) {
          const imageArray = [result];
          setIdImages(imageArray);
          saveIdPhotosToStorage(imageArray);
          setVerificationID(true);
          toast.success("ID with 3 specimen signatures uploaded!");
        }
      } catch (error) {
        toast.error(
          `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    [fileUpload],
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
    } catch {
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
                      {signaturePad.signatureImage && (
                        <Button
                          size="sm"
                          onClick={() => {
                            signaturePad.setSignatureImage(null);
                            saveSignaturePhotoToStorage(null);
                            setVerificationSignatures(false);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {signaturePad.signatureImage ? (
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                          <div className="border-2 border-green-200 dark:border-green-800 rounded-xl p-6 md:p-8 h-40 md:h-48 flex items-center justify-center bg-white dark:bg-slate-950">
                            <img
                              src={signaturePad.signatureImage}
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
                      ) : signaturePad.isModalOpen ? (
                        <div className="space-y-4">
                          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                            <canvas
                              ref={signaturePad.canvasRef}
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
                              onClick={signaturePad.closeModal}
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
