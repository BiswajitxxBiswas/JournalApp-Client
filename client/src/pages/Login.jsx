import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/auth";
import VerifyEmailOTP from "./VerifyEmailOTP";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/public/login", {
        userName: formData.userName,
        password: formData.password,
      });

      const { user } = response.data;

      // If email not verified, require OTP check
      if (!user.mailVerify) {
        await api.post("/public/resend-otp", null, {
          params: { email: user.email },
        });

        setEmailForVerification(user.email);
        setShowVerifyOtp(true);
        toast.info("Email not verified. A verification code has been sent.");
        setIsLoading(false);
        return;
      }

      // Hydrate auth state after login by calling handleLogin from context
      await handleLogin();

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_CALLBACK_LINK;

    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      "&access_type=online";

    window.location.href = googleAuthUrl;
  };

  // Render OTP verification UI if user needs to verify email
  if (showVerifyOtp) {
    return (
      <VerifyEmailOTP
        email={emailForVerification}
        onVerifySuccess={async () => {
          setShowVerifyOtp(false);
          toast.success("Email verified! Please log in.");
          // Optionally, auto-log the user in after verification:
          await handleLogin();
          navigate("/dashboard");
        }}
        onBackToLogin={() => setShowVerifyOtp(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)), hsl(var(--journal-soft)) 60%, hsl(var(--journal-light)) 100%)",
      }}
    >
      <Card className="w-full max-w-md bg-[hsl(var(--card))] shadow-[var(--shadow-card)] border border-[hsl(var(--border))] animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-[hsl(var(--primary))]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[hsl(var(--muted-foreground))]">
            Sign in to continue your journaling journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className="text-[hsl(var(--foreground))]"
              >
                Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="pl-10 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[hsl(var(--foreground))]"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="journal"
              size="lg"
              className="w-full bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.5 24.5C47.5 22.8175 47.3375 21.17 47.0375 19.5775H24V28.6875H37.765C37.0675 32.0175 34.845 34.7225 31.735 36.3325V41.5725H39.34C43.9475 37.2025 47.5 31.5025 47.5 24.5Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24 48C30.64 48 36.41 45.7925 39.34 41.5725L31.735 36.3325C30.0875 37.3675 27.963 37.9725 24 37.9725C19.14 37.9725 14.9375 34.625 13.3625 30.1525H5.5025V35.565C8.365 41.0175 15.3975 48 24 48Z"
                    fill="#34A853"
                  />
                  <path
                    d="M13.3625 30.1525C12.96 29.1175 12.73 27.9975 12.73 26.835C12.73 25.6725 12.96 24.5525 13.3625 23.5175V18.105H5.5025C3.9775 21.1125 3.9775 24.8875 5.5025 27.895L13.3625 30.1525Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M24 15.5275C26.645 15.5275 29.03 16.4225 30.8775 18.16L38.12 11.0075C34.4075 7.5675 29.9875 5.5275 24 5.5275C15.3975 5.5275 8.365 12.4825 5.5025 17.935L13.3625 23.5175C14.9375 19.045 19.14 15.5275 24 15.5275Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Sign in with Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-glow))] hover:underline font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
