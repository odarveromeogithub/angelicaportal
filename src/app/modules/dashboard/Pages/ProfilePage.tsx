import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { Breadcrumb } from "../../../core/components/ui/breadcrumb";
import { Button } from "../../../core/components/ui/button";
import { Camera, Upload, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../core/components/ui/card";
import { useState } from "react";
import { useAppSelector } from "../../../core/state/hooks";
import { selectAuthUser } from "../../../core/state/selector/auth.selector";
import { getDashboardRoleFromUser } from "../../../core/constants/dashboard-paths";
import { ErrorBoundary } from "../../../core/components/error";
import { ProfileSkeleton } from "../../../core/components/ui/skeleton";

export default function ProfilePage() {
  const currentUser = useAppSelector(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isProfileLoading = !currentUser;

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

  const handleCopyReferralLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch (e) {
      // noop
    }
  };

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
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/50 rounded-xl p-4 md:p-6"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-200 dark:bg-orange-900/60 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl md:text-2xl">⚠️</span>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          Account Verification Pending
                        </h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                          Complete facial verification to confirm your identity
                          and unlock all features.
                        </p>
                      </div>
                    </div>
                  </motion.div>

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
                          <p className="text-sm md:text-base font-medium text-orange-600 mt-1">
                            Unverified
                          </p>
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
                  <Card className="border border-blue-200/60 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/40">
                    <CardHeader>
                      <div className="flex items-center gap-2 md:gap-3">
                        <Camera className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                        <CardTitle className="text-base md:text-lg">
                          Facial Verification Required
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-4">
                        To verify your account, we need to confirm that you are
                        the same person who uploaded the ID and signatures.
                        Please take a selfie or upload a clear photo of your
                        face.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <Button className="w-full sm:w-auto">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Selfie
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Signature */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base md:text-lg">
                        Signature
                      </CardTitle>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 h-40 md:h-48 flex items-center justify-center">
                          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                            No signature uploaded
                          </p>
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
                    </CardContent>
                  </Card>

                  {/* ID with 3 Specimen Signature */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base md:text-lg">
                        ID with 3 Specimen Signature
                      </CardTitle>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 h-48 md:h-64 flex items-center justify-center">
                          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                            No ID uploaded
                          </p>
                        </div>
                        <div className="flex items-center">
                          <ul className="list-disc list-inside text-xs md:text-sm text-slate-500 dark:text-slate-400 space-y-2">
                            <li>
                              The ID and Signatures uploaded are protected by
                              the data privacy law
                            </li>
                          </ul>
                        </div>
                      </div>
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
