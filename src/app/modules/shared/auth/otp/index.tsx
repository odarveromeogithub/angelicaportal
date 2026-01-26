import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/core/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/core/components/ui/card";
import { OTPInput } from "@/app/core/components/form";
import {
  AUTH_CLASSES,
  AUTH_MESSAGES,
  OTP_CONFIG,
} from "@/app/core/constants/auth";
import { otpSchema } from "@/app/core/schemas/auth.schema";
import { APP_ROUTES } from "@/app/core/constants/routes";
import { DASHBOARD_ROOT } from "@/app/core/constants/dashboard-paths";
import { useAppDispatch } from "@/app/core/state/hooks";
import { setUser } from "@/app/core/state/reducer/auth";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const email = location.state?.email as string;

  const [otp, setOtp] = useState<string[]>(Array(OTP_CONFIG.length).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_CONFIG.expiryMinutes * 60);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) {
      navigate(APP_ROUTES.REGISTER);
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error(AUTH_MESSAGES.otp.expired);
      navigate(APP_ROUTES.REGISTER);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    try {
      await otpSchema.validate({ otp: otpCode, email });
    } catch (error: unknown) {
      const firstError =
        error instanceof Error ? error.message : "Validation failed";
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual OTP verification API call
      if (otpCode === "123456") {
        toast.success(AUTH_MESSAGES.otp.success);

        // Set mock user data after successful OTP verification
        dispatch(
          setUser({
            id: Date.now(),
            email: email,
            name: "New User",
            role: "client", // Default role for newly registered users
            contact_number: "",
            username: email.split("@")[0],
            first_name: "New",
            last_name: "User",
            middle_name: "",
            is_active: true,
          }),
        );

        setTimeout(() => {
          navigate(DASHBOARD_ROOT.client);
        }, 1500);
      } else {
        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        if (newWrongAttempts >= OTP_CONFIG.maxAttempts) {
          toast.error(AUTH_MESSAGES.otp.maxAttempts);
          setTimeout(() => {
            navigate(APP_ROUTES.REGISTER);
          }, 2000);
        } else {
          toast.error(
            `${AUTH_MESSAGES.otp.wrongAttempt} ${OTP_CONFIG.maxAttempts - newWrongAttempts} attempts remaining.`,
          );
          setOtp(Array(OTP_CONFIG.length).fill(""));
        }
      }
    } catch {
      toast.error(AUTH_MESSAGES.otp.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before resending`);
      return;
    }

    // TODO: Replace with actual resend OTP API call
    toast.success("OTP resent successfully");
    setResendCooldown(OTP_CONFIG.resendDelaySeconds);
    setTimeLeft(OTP_CONFIG.expiryMinutes * 60);
    setOtp(Array(OTP_CONFIG.length).fill(""));
    setWrongAttempts(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={AUTH_CLASSES.container}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleVerifyOtp();
        }}
        className="w-full max-w-md"
      >
        <Card className={AUTH_CLASSES.card}>
          <CardHeader className="flex flex-col items-center justify-center gap-4 text-center"></CardHeader>
          <CardAction className="self-start p-0 pl-7">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/register")}
              className="h-auto p-0 !text-blue-600 dark:!text-blue-300 hover:!bg-transparent hover:!text-blue-500 dark:hover:!text-blue-200"
            >
              <span className="inline-flex items-center gap-1 text-sm font-medium">
                <ChevronLeft className="size-4" />
                Back to Register
              </span>
            </Button>
          </CardAction>
          <CardHeader className="items-center gap-4 text-center">
            <div className="flex justify-center w-full">
              <img
                src="/assets/cclpi-logo.png"
                alt="CCLPI Plans Logo"
                className="h-24 object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Verify OTP
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter the 6-digit code sent to {email}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            <OTPInput
              id="otp"
              value={otp}
              onChange={setOtp}
              length={OTP_CONFIG.length}
              disabled={isLoading}
            />

            <div
              className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              role="timer"
              aria-live="polite"
            >
              <Clock className="size-4" aria-hidden="true" />
              <span>Time remaining: {formatTime(timeLeft)}</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={isLoading || otp.join("").length !== OTP_CONFIG.length}
              className={AUTH_CLASSES.button.primary}
              aria-label="Verify OTP code"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0}
              className={AUTH_CLASSES.button.ghost}
              aria-label={
                resendCooldown > 0
                  ? `Resend available in ${resendCooldown} seconds`
                  : "Resend OTP"
              }
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </Button>

            {wrongAttempts > 0 && (
              <div
                className="rounded-xl bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300"
                role="alert"
                aria-live="assertive"
              >
                {wrongAttempts === 1 &&
                  `1 wrong attempt. ${OTP_CONFIG.maxAttempts - 1} attempts remaining.`}
                {wrongAttempts === 2 &&
                  `2 wrong attempts. ${OTP_CONFIG.maxAttempts - 2} attempt remaining.`}
                {wrongAttempts >= OTP_CONFIG.maxAttempts &&
                  "Maximum attempts reached."}
              </div>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
