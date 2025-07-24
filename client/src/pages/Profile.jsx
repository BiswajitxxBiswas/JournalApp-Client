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
import { toast } from "react-toastify";
import api from "../utils/auth"
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

// Vibrant emotion colors for charts
const EMOTION_COLORS = {
  HAPPY: "hsl(158, 72%, 58%)",        // Vibrant green/teal
  EXCITED: "hsl(47, 100%, 60%)",      // Lively yellow/gold
  NEUTRAL: "hsl(211, 27%, 70%)",      // Soft blue-gray
  ANXIOUS: "hsl(0, 82%, 66%)",        // Warm red/coral
  SAD: "hsl(221, 83%, 63%)",          // Strong blue
};

const ALL_EMOTIONS = ["HAPPY", "EXCITED", "NEUTRAL", "ANXIOUS", "SAD"];

const tagColors = [
  "bg-[hsl(var(--accent))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  "bg-[hsl(var(--journal-light))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
  "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
  "bg-[hsl(var(--journal-warm))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
];

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

  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [emotionalData, setEmotionalData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const formatJoinDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysSince = (dateString) => {
    if (!dateString) return "-";
    const joinDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  function computeStreakDays(entries) {
    if (!entries || entries.length === 0) return 0;
    const uniqueDates = [...new Set(entries.map(e => e.date))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; ++i) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  function createEmotionalTrend(entries) {
    const last7Days = getLast7Days();
    const chart = last7Days.map(d => ({
      date: d.slice(5),
      happy: 0,
      sad: 0,
      neutral: 0,
      excited: 0,
      anxious: 0
    }));
    entries.forEach(entry => {
      const idx = last7Days.indexOf(entry.date);
      let s = entry.sentiments ? entry.sentiments.toLowerCase() : "neutral";
      if (idx >= 0 && chart[idx][s] !== undefined) chart[idx][s]++;
    });
    return chart;
  }

  function createPieData(entries) {
    const counts = { HAPPY: 0, EXCITED: 0, NEUTRAL: 0, ANXIOUS: 0, SAD: 0 };
    entries.forEach(e => {
      const key = (e.sentiments || "NEUTRAL").toUpperCase();
      if (counts.hasOwnProperty(key)) counts[key]++;
    });
    return ALL_EMOTIONS.map(key => ({
      name: key.charAt(0) + key.slice(1).toLowerCase(),
      value: counts[key],
      color: EMOTION_COLORS[key]
    })).filter(e => e.value > 0);
  }

  function getLatestSentiment(entries) {
    if (!entries?.length) return "neutral";
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const s = sorted[0].sentiments || "neutral";
    return s.toLowerCase();
  }

  useEffect(() => {
    setIsLoading(true);
    setError("");
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("userToken");
        const res = await api.get("/users");
        const user = res.data;
        setProfile({
          username: user.userName || "",
          email: user.email || "",
          joinDate: user.id?.date ? user.id.date.slice(0, 10) : "",
          emotionalStatus: getLatestSentiment(user.journalEntryList),
          totalEntries: user.journalEntryList?.length || 0,
          streakDays: computeStreakDays(user.journalEntryList || []),
        });
        setJournalEntries(user.journalEntryList || []);
        setEmotionalData(createEmotionalTrend(user.journalEntryList || []));
        setPieData(createPieData(user.journalEntryList || []));
      } catch (err) {
        setError("Could not load profile. Check your server.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    if ((passwords.new && !passwords.confirm) || (!passwords.new && passwords.confirm)) {
      setPasswordError("Both password fields are required to change password.");
      return false;
    }
    if (passwords.new && passwords.new.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return false;
    }
    if (passwords.new && passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSave = async () => {
    if (!validatePasswords()) return;
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("userToken");
      const data = {};
      if (profile.username) data.userName = profile.username;
      if (passwords.new) data.password = passwords.new;

      await api.put("/users/update-user",data);
      toast.success("Profile updated successfully!");
      setPasswords({ new: "", confirm: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 font-semibold text-lg">Loading profile...</div>;
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)), hsl(var(--journal-soft)) 60%, hsl(var(--journal-light)) 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
              Profile Dashboard
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Manage your account and track your journaling progress
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6 animate-fade-in">
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
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
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Change Password</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="new"
                          name="new"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={passwords.new}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 mb-0 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
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
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <Input
                          id="confirm"
                          name="confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          value={passwords.confirm}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 mb-0 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
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
                    </div>
                    {passwordError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
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
            <div className="flex flex-col gap-6 animate-fade-in">
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
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
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]">
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
          <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] max-w-4xl mx-auto animate-fade-in mt-6">
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
                      stroke={EMOTION_COLORS.HAPPY}
                      strokeWidth={3}
                      dot={{ fill: EMOTION_COLORS.HAPPY, r: 5 }}
                      name="Happy"
                    />
                    <Line
                      type="monotone"
                      dataKey="excited"
                      stroke={EMOTION_COLORS.EXCITED}
                      strokeWidth={3}
                      dot={{ fill: EMOTION_COLORS.EXCITED, r: 5 }}
                      name="Excited"
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke={EMOTION_COLORS.NEUTRAL}
                      strokeWidth={3}
                      dot={{ fill: EMOTION_COLORS.NEUTRAL, r: 5 }}
                      name="Neutral"
                    />
                    <Line
                      type="monotone"
                      dataKey="anxious"
                      stroke={EMOTION_COLORS.ANXIOUS}
                      strokeWidth={3}
                      dot={{ fill: EMOTION_COLORS.ANXIOUS, r: 5 }}
                      name="Anxious"
                    />
                    <Line
                      type="monotone"
                      dataKey="sad"
                      stroke={EMOTION_COLORS.SAD}
                      strokeWidth={3}
                      dot={{ fill: EMOTION_COLORS.SAD, r: 5 }}
                      name="Sad"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-40 mt-6 flex flex-col items-center justify-center">
                <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Overall Distribution</h4>
                <div className="w-full flex justify-center">
                  <ResponsiveContainer width={220} height={120}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={55}
                        dataKey="value"
                        label
                        paddingAngle={2}
                        stroke="hsl(var(--card))"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name.toUpperCase()]} />
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
