import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, ArrowLeft } from "lucide-react";

import api from "../utils/auth"; // your configured Axios instance

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

const VerifyEmailOTP = ({
  email,
  onVerifySuccess,
  onLogin,
  onBackToLogin,
  title = "Verify Your Email",
  description = "We've sent a verification code to your email address",
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    const visibleStart = localPart.substring(0, 2);
    const visibleEnd = localPart.substring(localPart.length - 1);
    return `${visibleStart}***${visibleEnd}@${domain}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post(
        `/public/verify-otp`,
        {},
        {
          params: {
            email,
            otp,
          },
        }
      );

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("userToken", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin();
      if (onVerifySuccess) onVerifySuccess();

      toast.success("Your email has been successfully verified");

      navigate("/dashboard");
    } catch (error) {
      const msg =
        error?.response?.data || "Invalid verification code. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post(`/public/resend-otp`, null, {
        params: { email },
      });
      toast.info("A new verification code has been sent to your email");
    } catch (error) {
      const msg =
        error?.response?.data || "Failed to resend OTP. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
          <div className="text-center text-sm text-muted-foreground mt-2">
            <span className="font-medium">{maskEmail(email)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter verification code
            </label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-primary hover:underline"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          {onBackToLogin && (
            <Button variant="ghost" onClick={onBackToLogin} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailOTP;
