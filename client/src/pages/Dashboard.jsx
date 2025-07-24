import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Plus, Calendar, Book, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import api from "../utils/auth"

const moodEmojis = {
  happy: "😊",
  sad: "😔",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰"
};

// Metallic/Material green colors from your design system tokens!
const moodColors = {
  happy:   "bg-[hsl(var(--journal-soft))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  excited: "bg-[hsl(var(--accent))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  neutral: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
  anxious: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--foreground))] border-[hsl(var(--destructive))]",
  sad:     "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]",
};

// Green-accented but lively tag palette
const tagColors = [
  "bg-[hsl(var(--accent))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  "bg-[hsl(var(--journal-light))] text-[hsl(var(--primary))] border-[hsl(var(--primary))]",
  "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
  "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
  "bg-[hsl(var(--journal-warm))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
];

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await api.get("/journal");
        const normalizedEntries = res.data.map((entry) => ({
          ...entry,
          mood: entry.sentiments ? entry.sentiments.toLowerCase() : null,
        }));
        setEntries(normalizedEntries);
      } catch (error) {
        toast.error("Failed to load journal entries.");
      }
    };
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((entry) =>
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.tags && entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const token = localStorage.getItem("userToken");
      await api.delete(`/journal/${entryId}`);
      setEntries(entries.filter(entry => entry.id !== entryId));
      setSelectedEntry(null);
      toast.success("Your journal entry has been successfully deleted.")
    } catch {
      toast.error("Failed to delete entry. Please try again.");
    }
  };

  const handleEditEntry = (entry) => {
    navigate("/create", { state: { editEntry: entry } });
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)), hsl(var(--journal-soft)) 60%, hsl(var(--journal-light)) 100%)"
      }}
    >
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">Your Journal</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              {entries.length} entries • Continue your journaling journey
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <Button
              onClick={() => navigate("/create")}
              className="shrink-0 bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] transition-colors rounded-lg"
            >
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md text-center p-12 rounded-xl">
            <Book className="h-16 w-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
              {searchTerm ? "No entries found" : "Start Your Journey"}
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {searchTerm
                ? "Try different search terms or create a new entry"
                : "Your first journal entry is just a click away"}
            </p>
            <Button
              onClick={() => navigate("/create")}
              className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] transition-colors rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Create Your First Entry
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md rounded-xl hover:shadow-[var(--shadow-journal)] transition-shadow duration-300 cursor-pointer hover:-translate-y-1 group"
                onClick={() => setSelectedEntry(entry)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                      {entry.title}
                    </CardTitle>
                    {entry.mood && (
                      <Badge className={`${moodColors[entry.mood]} border text-xs px-2 py-1`}>
                        {moodEmojis[entry.mood]}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Calendar className="h-3 w-3" />
                    {formatDate(entry.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-3 mb-3">{entry.content}</p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={tag} className={`text-xs border ${tagColors[idx % tagColors.length]} rounded-full`}>
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge className={`text-xs border ${tagColors[3 % tagColors.length]} rounded-full`}>
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Entry Detail Modal */}
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-lg">
            {selectedEntry && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                        {selectedEntry.title}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-4 text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(selectedEntry.date)}
                        </span>
                        {selectedEntry.mood && (
                          <Badge className={`${moodColors[selectedEntry.mood]} border`}>
                            {moodEmojis[selectedEntry.mood]} {selectedEntry.mood}
                          </Badge>
                        )}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEntry(selectedEntry)}
                    className="flex-1 border-none bg-[hsl(var(--accent))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-glow))] transition-colors font-semibold"
                  >
                    <Edit className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                    Edit Entry
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEntry(selectedEntry.id)}
                    className="flex-1 bg-[hsl(var(--destructive))] text-white hover:brightness-75 border-none transition-all font-semibold"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-white" />
                    Delete Entry
                  </Button>
                </div>

                <ScrollArea className="max-h-96 pr-4">
                  <div className="space-y-4">
                    <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.content}
                    </p>
                    {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                      <div className="pt-4 border-t border-[hsl(var(--border))]">
                        <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEntry.tags.map((tag, idx) => (
                            <Badge
                              key={tag}
                              className={`text-xs border ${tagColors[idx % tagColors.length]} rounded-full`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Floating "+": journal green */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 z-50 shadow-[var(--shadow-journal)] bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] rounded-full flex items-center justify-center"
        onClick={() => navigate("/create")}
        aria-label="Create new entry"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
