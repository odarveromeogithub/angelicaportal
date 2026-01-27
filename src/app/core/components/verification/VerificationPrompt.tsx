import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/core/components/ui/dialog";
import { Button } from "@/app/core/components/ui/button";
import {
  setVerificationCompleted,
  getVerificationCompleted,
} from "@/app/core/helpers/auth-storage";
import { useAppSelector } from "@/app/core/state/hooks";
import {
  selectAuthUser,
  selectMissingVerificationItems,
} from "@/app/core/state/selector/auth.selector";
import {
  getDashboardRoleFromUser,
  DASHBOARD_SEGMENTS,
  buildDashboardPath,
} from "@/app/core/constants/dashboard-paths";

interface VerificationPromptProps {
  open: boolean;
  onClose: () => void;
}

export default function VerificationPrompt({
  open,
  onClose,
}: VerificationPromptProps) {
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const dashboardRole = getDashboardRoleFromUser(
    (authUser?.role || "client") as "admin" | "client" | "sc" | "um",
  );
  const profilePath = buildDashboardPath(
    dashboardRole,
    DASHBOARD_SEGMENTS.PROFILE,
  );

  const missingItems = useMemo(() => selectMissingVerificationItems(), []);

  const requirementLabels: Record<string, string> = {
    facial: "Facial verification (selfie)",
    id: "Upload a valid ID",
    signatures: "Provide 3 specimen signatures",
  };

  useEffect(() => {
    // Prevent showing if already completed elsewhere
    if (getVerificationCompleted()) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    // User can skip for now; add plan remains disabled
    setVerificationCompleted(false);
    onClose();
  };

  const handleGoToProfile = () => {
    onClose();
    navigate(profilePath);
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Complete Your Verification</DialogTitle>
          <DialogDescription>
            To fully verify your account, go to your Profile page and submit
            facial verification, a valid ID, and three specimen signatures. You
            can skip for now, but adding new plans will be disabled until
            completion.
          </DialogDescription>
        </DialogHeader>
        {/* Guidance and CTA */}
        <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 px-4 py-3 mb-4">
          <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 font-medium">
            {missingItems.length > 0
              ? "To fully verify, please complete these on your Profile:"
              : "Your account is fully verified!"}
          </p>
          {missingItems.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs md:text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {missingItems.map((item) => (
                <li key={item}>{requirementLabels[item]}</li>
              ))}
            </ul>
          )}
          <div className="mt-3">
            <Button
              onClick={handleGoToProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {missingItems.length > 0
                ? "Start Verification in Profile"
                : "Go to Profile"}
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
