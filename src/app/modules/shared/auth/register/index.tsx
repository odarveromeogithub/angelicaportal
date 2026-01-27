import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/cclpi-logo.png";

import { Button } from "@/app/core/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Checkbox } from "@/app/core/components/ui/checkbox";
import { FormField, FormSelect, PhoneInput } from "@/app/core/components/form";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { register, resetRegister } from "@/app/core/state/reducer/auth";
import {
  AREA_OPTIONS,
  AUTH_CLASSES,
  AUTH_MESSAGES,
} from "@/app/core/constants/auth";
import { registerSchema } from "@/app/core/schemas/auth.schema";
import { APP_ROUTES } from "@/app/core/constants/routes";
import { selectRegisterState } from "@/app/core/state/selector/auth.selector";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const registerState = useAppSelector(selectRegisterState);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_no: "",
    country_code: "+63",
    area: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(
    null,
  );

  useEffect(() => {
    if (registerState.success && registerState.data) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      toast.success(AUTH_MESSAGES.register.success);
      setTimeout(() => {
        // Determine verification method based on area
        const isPhilippines =
          formData.area === "Luzon" ||
          formData.area === "Visayas" ||
          formData.area === "Mindanao";
        const verificationType = isPhilippines ? "phone" : "email";
        const verificationValue = isPhilippines
          ? `${formData.country_code}${formData.contact_no}`
          : formData.email;

        navigate(APP_ROUTES.OTP, {
          state: {
            email: formData.email,
            contact_no: verificationValue,
            verificationType: verificationType,
          },
        });
        dispatch(resetRegister());
      }, 1500);
    }
  }, [
    registerState.success,
    registerState.data,
    navigate,
    dispatch,
    formData.email,
    formData.contact_no,
    formData.country_code,
    formData.area,
    loadingToastId,
  ]);

  useEffect(() => {
    if (registerState.error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      toast.error(AUTH_MESSAGES.register.error);
    }
  }, [registerState.error, loadingToastId]);

  useEffect(() => {
    return () => {
      dispatch(resetRegister());
    };
  }, [dispatch]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      await registerSchema.validate(formData);
      return true;
    } catch (error: unknown) {
      const firstError =
        error instanceof Error ? error.message : "Validation failed";
      if (firstError) {
        toast.error(firstError);
      }
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      setShowPreview(true);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    try {
      registerSchema.validateSync(formData);
      return true;
    } catch {
      return false;
    }
  };

  const handleSendVerificationCode = () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    const toastId = toast.loading(AUTH_MESSAGES.register.loading);
    setLoadingToastId(toastId);
    dispatch(
      register({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        contact_no: formData.contact_no
          ? `${formData.country_code}${formData.contact_no}`
          : "",
        area: formData.area,
        middle_name: formData.middle_name,
      }),
    );
  };

  const handleBackToForm = () => {
    setShowPreview(false);
    setAgreedToTerms(false);
  };

  return (
    <div className={AUTH_CLASSES.container}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className={AUTH_CLASSES.card}>
          <CardAction className="self-start p-0 pl-3">
            <Button
              type="button"
              variant="ghost"
              asChild
              className="h-auto p-0 !text-blue-600 dark:!text-blue-300 hover:!bg-transparent hover:!text-blue-500 dark:hover:!text-blue-200"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft className="size-4" />
                Return to Login
              </Link>
            </Button>
          </CardAction>
          <CardHeader className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex justify-center w-full">
              <img
                src={logo}
                alt="CCLPI Plans Logo"
                className="h-24 object-contain"
                loading="lazy"
              />
            </div>
            <CardTitle className="text-lg font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Registration
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            <div className="rounded-xl bg-slate-50/70 dark:bg-slate-900/60 px-4 py-3 text-center">
              <p className="text-xs italic leading-relaxed text-slate-500 dark:text-slate-400">
                For using CCLPI Plans services, you are required to provide your
                mobile number and/or email address to complete the creation and
                verification of your account. We value your data privacy, any
                information gathered and collected is safely secured and manage
                by CCLPI Plans.
              </p>
            </div>

            {registerState.error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200/60 dark:border-red-900/40 bg-red-50 dark:bg-red-950/40 px-4 py-3">
                <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  Registration failed. Please check your information and try
                  again.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {/* Area Selection - First Field */}
              <FormSelect
                label="Area"
                id="area"
                value={formData.area}
                onValueChange={(value) => handleChange("area", value)}
                options={AREA_OPTIONS}
                placeholder="Select Area"
                required
              />

              {/* Conditional: Phone for PH, Email for International */}
              {formData.area &&
                (formData.area === "Luzon" ||
                  formData.area === "Visayas" ||
                  formData.area === "Mindanao") && (
                  <PhoneInput
                    label="Contact Number"
                    id="contact_no"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={(value) => handleChange("contact_no", value)}
                    placeholder="10 digit number"
                    required
                    countryCode={formData.country_code}
                    onCountryCodeChange={(value) =>
                      handleChange("country_code", value)
                    }
                  />
                )}

              {formData.area === "Other" && (
                <>
                  <FormField
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                  <PhoneInput
                    label="Contact Number (Optional)"
                    id="contact_no"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={(value) => handleChange("contact_no", value)}
                    placeholder="Phone number"
                    required={false}
                    countryCode={formData.country_code}
                    onCountryCodeChange={(value) =>
                      handleChange("country_code", value)
                    }
                  />
                </>
              )}

              {/* Name Fields - Side by Side */}
              {formData.area && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                      placeholder="First Name"
                      required
                      autoFocus
                    />

                    <FormField
                      label="Last Name"
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <FormField
                    label="Middle Name (Optional)"
                    id="middle_name"
                    name="middle_name"
                    type="text"
                    value={formData.middle_name}
                    onChange={(e) =>
                      handleChange("middle_name", e.target.value)
                    }
                    placeholder="Middle Name"
                  />

                  {/* Show email field for PH users as optional */}
                  {(formData.area === "Luzon" ||
                    formData.area === "Visayas" ||
                    formData.area === "Mindanao") && (
                    <FormField
                      label="Email Address (Optional)"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="example@email.com"
                    />
                  )}
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={registerState.loading || !isFormValid()}
              className={AUTH_CLASSES.button.primary}
              aria-label="Preview registration information"
            >
              Preview
            </Button>
            {!isFormValid() && (
              <p className={AUTH_CLASSES.success}>
                Please fill in all required fields correctly
              </p>
            )}
          </CardFooter>
        </Card>
      </form>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 sm:py-8 shadow-2xl my-4">
            <CardHeader className="items-center gap-3 text-center px-6 sm:px-8">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Preview Registration
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Please verify that your information is correct before sending
                the verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {/* Information Summary */}
              <div className="space-y-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 p-4 mb-5">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Name:
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white text-right">
                    {formData.first_name}{" "}
                    {formData.middle_name && `${formData.middle_name} `}
                    {formData.last_name}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Area:
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {formData.area}
                  </span>
                </div>
                {formData.contact_no && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Contact:
                    </span>
                    <span className="text-sm text-slate-900 dark:text-white">
                      {formData.country_code}
                      {formData.contact_no}
                    </span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Email:
                    </span>
                    <span className="text-sm text-slate-900 dark:text-white text-right break-all">
                      {formData.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Code Destination Info */}
              <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 px-4 py-3 mb-5">
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-medium mb-1">
                  📱 Verification Code Will Be Sent To:
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300 font-semibold">
                  {formData.area === "Luzon" ||
                  formData.area === "Visayas" ||
                  formData.area === "Mindanao"
                    ? `${formData.country_code}${formData.contact_no}`
                    : formData.email}
                </p>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed cursor-pointer"
                  >
                    I hereby confirm that the information provided is accurate
                    and correct. I understand and agree that this information
                    will be used for CCLPI Plans Portal purposes and is
                    protected under the{" "}
                    <span className="font-semibold">
                      Data Privacy Act of 2012 (Republic Act No. 10173)
                    </span>
                    . CCLPI Plans is committed to safeguarding your personal
                    data and ensuring its confidentiality and security.
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 sm:px-8 pb-6">
              <Button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={!agreedToTerms || registerState.loading}
                className={`${AUTH_CLASSES.button.primary} w-full`}
                aria-label="Send verification code"
              >
                {registerState.loading
                  ? "Sending..."
                  : "Send Verification Code"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToForm}
                disabled={registerState.loading}
                className={`${AUTH_CLASSES.button.outline} w-full`}
                aria-label="Go back to edit form"
              >
                Go Back to Edit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
