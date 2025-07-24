import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Plus, Calendar, Heart, Book, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";

const moodEmojis = {
  happy: "😊",
  sad: "😔",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰"
};

const moodColors = {
  happy:    "bg-[hsl(var(--accent))] text-[hsl(var(--primary))] border-[hsl(var(--accent-foreground))]",
  sad:      "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))]",
  neutral:  "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]",
  excited:  "bg-[hsl(var(--primary-glow))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]",
  anxious:  "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border-[hsl(var(--destructive))]"
};

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:8080/journal", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const normalizedEntries = res.data.map((entry) => ({
          ...entry,
          mood: entry.sentiments ? entry.sentiments.toLowerCase() : null,
        }));

        setEntries(normalizedEntries);
      } catch (error) {
        console.error("Failed to fetch entries", error);
        toast({
          title: "Error",
          description: "Failed to load journal entries.",
          variant: "destructive",
        });
      }
    };
    fetchEntries();
  }, [toast]);

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #e6f1f5 0%, #f6fbfc 100%)"
      }}
    >
    <div className="container mx-auto px-4 py-8">
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
        <Card className="bg-white border border-[hsl(var(--border))] shadow-md text-center p-12 rounded-xl">
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
              className="bg-white border border-[hsl(var(--border))] shadow-md rounded-xl hover:shadow-[var(--shadow-journal)] transition-shadow duration-300 cursor-pointer hover:-translate-y-1 group"
              onClick={() => setSelectedEntry(entry)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {entry.title}
                  </CardTitle>
                  {entry.mood && (
                    <Badge className={`${moodColors[entry.mood]} border text-xs`}>
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
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
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
        <DialogContent className="max-w-2xl max-h-[80vh] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl">
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
              <ScrollArea className="max-h-96 pr-4">
                <div className="space-y-4">
                  <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
                    {selectedEntry.content}
                  </p>
                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div className="pt-4 border-t border-[hsl(var(--border))]">
                      <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
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

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 shadow-[var(--shadow-journal)] bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-glow))] z-40 transition-colors rounded-full"
        onClick={() => navigate("/create")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
    </div>
  );
}
