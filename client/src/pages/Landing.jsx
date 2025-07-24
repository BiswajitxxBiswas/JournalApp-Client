import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  BookOpen,
  Heart,
  Shield,
  Zap,
  Sparkles,
  Quote,
  ArrowRight,
  PenTool
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="feature-icon" />,
      title: "Express Yourself",
      description: "Write freely and capture your thoughts, dreams, and daily experiences"
    },
    {
      icon: <Heart className="feature-icon" />,
      title: "Track Emotions",
      description: "Monitor your emotional wellbeing and discover patterns in your mood"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Private & Secure",
      description: "Your thoughts are safe with bank-level security and encryption"
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Lightning Fast",
      description: "Quick and responsive journaling that keeps up with your thoughts"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <Sparkles className="floating-icon animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-30">
          <Quote className="floating-icon animate-float" />
        </div>
        <div className="absolute bottom-32 left-16 opacity-25">
          <PenTool className="floating-icon animate-bounce" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-4 py-2 rounded-full text-sm font-medium mb-8 border border-[hsl(var(--primary))]/20">
            <Sparkles className="h-4 w-4" />
            Transform Your Inner World
          </div>

          {/* Heading */}
          <div className="mb-8 space-y-2 text-center">
  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
    Write Your
  </h1>
  <div className="relative inline-block">
    <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent relative z-10">
      Story
    </span>
    <div className="absolute -inset-4 bg-gradient-to-r from-teal-400/20 to-blue-400/20 blur-2xl rounded-full"></div>
  </div>
  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
    Every Day
  </h1>
</div>


          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the magic of journaling with our beautifully crafted platform. 
            Track emotions, unlock insights, and create lasting memories in your personal digital sanctuary.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="text-lg px-10 py-4 group bg-[hsl(var(--journal-primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              Begin Your Journey
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="text-lg px-10 py-4 group bg-[hsl(var(--journal-primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              Welcome Back
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
