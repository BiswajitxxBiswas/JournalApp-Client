import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BookOpen, Save, Plus, X, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

const moodOptions = [
  { value: "HAPPY", label: "Happy", emoji: "😊" },
  { value: "EXCITED", label: "Excited", emoji: "🤩" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐" },
  { value: "ANXIOUS", label: "Anxious", emoji: "😰" },
  { value: "SAD", label: "Sad", emoji: "😔" }
];

export default function CreateEntry() {
  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: undefined,
    tags: []
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if this is an edit operation
  const editEntry = location.state?.editEntry;
  const isEditing = !!editEntry;

  // Pre-populate form if editing
  useEffect(() => {
    if (editEntry) {
      setEntry({
        title: editEntry.title || "",
        content: editEntry.content || "",
        mood: editEntry.sentiments || undefined,
        tags: editEntry.tags || []
      });
    }
  }, [editEntry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleMoodChange = (mood) => {
    setEntry(prev => ({ ...prev, mood: prev.mood === mood ? undefined : mood }));
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !entry.tags.includes(tag)) {
      setEntry(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!entry.title.trim() || !entry.content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }
    if (!entry.mood) {
      setError("Please select your mood.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        title: entry.title.trim(),
        content: entry.content.trim(),
        tags: entry.tags,
        sentiments: entry.mood
      };
      const token = localStorage.getItem("userToken");

      if (isEditing) {
        // Update existing entry
        await axios.put(`http://localhost:8080/journal/${editEntry.id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        toast({
          title: "Entry updated successfully!",
          description: "Your journal entry has been updated."
        });
      } else {
        // Create new entry
        await axios.post("http://localhost:8080/journal", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        toast({
          title: "Entry saved successfully!",
          description: "Your journal entry has been created."
        });
      }
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        `Failed to ${isEditing ? 'update' : 'save'} entry. Please try again.`;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)), hsl(var(--journal-soft)) 60%, hsl(var(--journal-light)) 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1 text-left">
              {isEditing ? "Edit Entry" : "Create New Entry"}
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-left">
              {isEditing ? "Update your thoughts and emotions" : "Capture your thoughts and emotions in this moment"}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Editor */}
            <div className="lg:col-span-2">
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] rounded-xl p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))] text-xl font-semibold mb-1">
                    <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Your Entry
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--muted-foreground))] mb-0">
                    Express yourself freely and authentically
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[hsl(var(--foreground))] font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Give your entry a meaningful title..."
                      value={entry.title}
                      onChange={handleInputChange}
                      className="text-base bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-[hsl(var(--foreground))] font-medium">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Pour your heart out here... What's on your mind today?"
                      value={entry.content}
                      onChange={handleInputChange}
                      className="min-h-[260px] resize-none leading-relaxed bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={
                        isLoading ||
                        !entry.title.trim() ||
                        !entry.content.trim() ||
                        !entry.mood
                      }
                      className="flex-1 bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] rounded-lg font-semibold"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isLoading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Entry" : "Save Entry")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 sm:flex-initial border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-transparent hover:bg-[hsl(var(--muted))] rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mood Selector */}
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] rounded-xl p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))] font-semibold">
                    <Heart className="h-5 w-5 text-[hsl(var(--primary))]" />
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-3">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleMoodChange(option.value)}
                        className={`w-full flex flex-col items-center justify-center rounded-lg border-2 py-3 transition-all duration-200 font-medium ${
                          entry.mood === option.value
                            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary-glow))] text-[hsl(var(--primary))]"
                            : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]"
                        }`}
                      >
                        <span className="text-xl mb-1">{option.emoji}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)] rounded-xl p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg text-[hsl(var(--foreground))] font-semibold">Tags</CardTitle>
                  <CardDescription className="text-[hsl(var(--muted-foreground))]">
                    Add tags to organize your entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                      className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {entry.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-[hsl(var(--secondary-foreground))]/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] italic">No tags added yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
