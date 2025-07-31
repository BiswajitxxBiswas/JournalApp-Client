import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../utils/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "../AuthContext";

const VerifyEmailOTP = ({
  email = "",
  onVerifySuccess,
  onBackToLogin,
  title = "Verify Your Email",
  description = "We've sent a verification code to your email address",
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const maskEmail = (inputEmail) => {
    if (!inputEmail || !inputEmail.includes("@")) return "";
    const [localPart, domain] = inputEmail.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0] || ""}***@${domain}`;
    }
    const visibleStart = localPart.substring(0, 2);
    const visibleEnd = localPart.slice(-1);
    return `${visibleStart}***${visibleEnd}@${domain}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }
    setIsLoading(true);
    try {
      await api.post(
        "/public/verify-otp",
        {},
        {
          params: {
            email,
            otp,
          },
        }
      );
      // After successful verify, hydrate auth and redirect
      await handleLogin();
      toast.success("Your email has been successfully verified");
      if (onVerifySuccess) onVerifySuccess();
      navigate("/dashboard");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid verification code. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post("/public/resend-otp", null, {
        params: { email },
      });
      toast.info("A new verification code has been sent to your email");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to resend OTP. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)), hsl(var(--journal-soft)) 60%, hsl(var(--journal-light)) 100%)",
      }}
      aria-label="Verify email OTP page"
    >
      <Card className="w-full max-w-md bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-[hsl(var(--primary)/.07)]">
              <Mail className="h-6 w-6 text-[hsl(var(--primary))]" aria-hidden="true" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-[hsl(var(--foreground))]">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-[hsl(var(--muted-foreground))]">
            {description}
          </CardDescription>
          <div className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-2">
            <span className="font-medium">{maskEmail(email)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp-input" className="text-sm font-medium text-[hsl(var(--foreground))]">
              Enter verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                id="otp-input"
                maxLength={6}
                value={otp}
                onChange={setOtp}
                autoFocus
                inputMode="numeric"
                aria-label="6-digit verification code"
                className="ring-2 ring-[hsl(var(--primary))]/10 focus:ring-[hsl(var(--primary))] rounded-lg p-2 transition"
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="text-2xl border-b-2 border-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] transition-colors text-[hsl(var(--foreground))] w-8 mx-1"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="button"
            aria-label="Verify Email"
            onClick={handleVerifyOTP}
            className="w-full bg-[hsl(var(--journal-primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-glow))] transition-colors font-semibold"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-[hsl(var(--primary))] hover:underline transition-colors"
              disabled={isLoading}
            >
              Didn't receive the code? Resend
            </button>
          </div>

          {typeof onBackToLogin === "function" && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToLogin}
              className="w-full text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.07)] transition-colors mt-2"
              aria-label="Back to Login"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailOTP;
