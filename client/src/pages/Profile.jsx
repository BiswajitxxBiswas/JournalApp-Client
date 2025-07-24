import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Save,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    joinDate: "",
    emotionalStatus: "neutral",
    totalEntries: 0,
    streakDays: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sample emotional trend data for charts
  const emotionalData = [
    { date: "01/01", happy: 3, sad: 1, neutral: 2, excited: 1, anxious: 0 },
    { date: "01/02", happy: 4, sad: 0, neutral: 1, excited: 2, anxious: 1 },
    { date: "01/03", happy: 2, sad: 2, neutral: 3, excited: 0, anxious: 1 },
    { date: "01/04", happy: 5, sad: 0, neutral: 1, excited: 1, anxious: 0 },
    { date: "01/05", happy: 3, sad: 1, neutral: 2, excited: 2, anxious: 0 },
    { date: "01/06", happy: 4, sad: 0, neutral: 2, excited: 1, anxious: 1 },
    { date: "01/07", happy: 6, sad: 0, neutral: 1, excited: 0, anxious: 0 },
  ];

  // Pie chart data for emotional distribution
  const pieData = [
    { name: "Happy", value: 35, color: "#31c48d" },
    { name: "Excited", value: 25, color: "#5eead4" },
    { name: "Neutral", value: 20, color: "#cbd5e1" },
    { name: "Anxious", value: 12, color: "#f87171" },
    { name: "Sad", value: 8, color: "#fbbf24" },
  ];

  // Populate mock profile data on component mount; replace with real API call if needed
  useEffect(() => {
    // try{
    //   const fetchProfile = async()=>{
    //     try{
    //       const token = localStorage.getItem("userToken");
    //       const res = await axios.get("http://localhost:8080/journal",{
    //         headers : {
    //           "Content-Type" : "application/json",
    //           Authorization: `Bearer ${token}`,
    //         }
    //       });

    //     }
    //   }
    // }
    const mockProfile = {
      username: "JournalWriter",
      email: "user@example.com",
      joinDate: "2024-01-01",
      emotionalStatus: "happy",
      totalEntries: 12,
      streakDays: 7,
    };
    setProfile(mockProfile);
  }, []);

  // Handle changes in profile input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Validate password fields before submitting
  const validatePasswords = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("All password fields are required.");
      return false;
    }
    if (passwords.new.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return false;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Submits password update (mocked here)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setPasswordLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast({
        title: "Password updated!",
        description: "Your password has been successfully changed.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Saves profile changes (mocked here)
  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility: calculate days since join date
  const calculateDaysSince = (dateString) => {
    const joinDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Utility: format join date nicely
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Heading */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
              Profile Dashboard
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Manage your account and track your journaling progress
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile info & password */}
            <div className="lg:col-span-2 flex flex-col gap-6 animate-fade-in">
              {/* Profile Information Card */}
              <Card className="bg-[var(--gradient-card)] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-[hsl(var(--foreground))]">
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          value={profile.username}
                          onChange={handleInputChange}
                          className="pl-10 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        />
                      </div>
                    </div>
                    {/* Email (readonly) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[hsl(var(--foreground))]">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          readOnly
                          disabled
                          className="pl-10 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] placeholder:text-[hsl(var(--muted-foreground))] cursor-not-allowed opacity-70"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Change Password Form */}
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Change Password</Label>
                    <form
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                      onSubmit={handlePasswordSubmit}
                      autoComplete="off"
                    >
                      {/* Current Password */}
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="current"
                          name="current"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Current"
                          value={passwords.current}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 mb-0 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                          className="absolute right-3 top-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                          aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* New Password */}
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="new"
                          name="new"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New"
                          value={passwords.new}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 mb-0 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                          aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* Confirm Password */}
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="confirm"
                          name="confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm"
                          value={passwords.confirm}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 mb-0 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Submit Button & Password error */}
                      <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          disabled={passwordLoading}
                          className="border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] order-1"
                        >
                          {passwordLoading ? "Updating..." : "Change Password"}
                        </Button>
                        {passwordError && (
                          <div className="flex-1 order-2">
                            <Alert variant="destructive">
                              <AlertDescription>{passwordError}</AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Save Profile Changes */}
                  <Button
                    onClick={handleSave}
                    variant="journal"
                    disabled={isLoading}
                    className="w-full md:w-auto mt-4 bg-[hsl(var(--journal-primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-glow))] transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Membership & Journal Stats */}
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Membership info */}
              <Card className="bg-[var(--gradient-card)] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Membership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Member since</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{formatJoinDate(profile.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Member for</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">
                      {calculateDaysSince(profile.joinDate)} days
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Journal stats */}
              <Card className="bg-[var(--gradient-card)] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Journal Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Total entries</p>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))]">{profile.totalEntries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Writing streak</p>
                    <p className="text-2xl font-bold text-[hsl(var(--journal-warm))]">{profile.streakDays} days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emotional Trends charts full width */}
          <Card className="bg-[var(--gradient-card)] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] max-w-4xl mx-auto animate-fade-in mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--primary))]" />
                Emotional Trends
              </CardTitle>
              <CardDescription>Your emotional patterns over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="happy"
                      stroke="#31c48d"
                      strokeWidth={2}
                      dot={{ fill: "#31c48d", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="excited"
                      stroke="#5eead4"
                      strokeWidth={2}
                      dot={{ fill: "#5eead4", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                      dot={{ fill: "#cbd5e1", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-32 mt-6">
                <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Overall Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={50} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
