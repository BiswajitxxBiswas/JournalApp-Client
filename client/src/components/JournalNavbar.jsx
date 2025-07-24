import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, User, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JournalNavbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">JournalApp</span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant={isActive("/dashboard") ? "journal" : "ghost"}
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <BookOpen className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={isActive("/profile") ? "journal" : "ghost"}
                size="sm"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/create")}
              >
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="journal"
                size="sm"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
