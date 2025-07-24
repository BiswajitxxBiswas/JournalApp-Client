import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, User, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JournalNavbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    Promise.resolve(onLogout()).finally(() => setIsLoggingOut(false));
  };

  // Nav item component
  const NavItem = ({ path, children, icon: Icon }) => {
    const active = isActive(path);
    return (
      <button
        type="button"
        onClick={() => navigate(path)}
        className={`
          group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer
          ${active 
            ? "bg-[hsl(var(--primary-glow))] text-[hsl(var(--primary))] shadow-[0_1.5px_12px_-4px_hsl(var(--primary)_/_14%)]"
            : "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] text-[hsl(var(--foreground))] bg-transparent"
          }
        `}
        style={{ minHeight: "40px" }}
      >
        <Icon
          className={`
            h-5 w-5
            ${active 
              ? "text-[hsl(var(--primary))]"
              : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))]"
            }
            transition-colors duration-200
          `}
        />
        <span>{children}</span>
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(var(--card))/94%] backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-[0_4px_24px_-6px_hsl(var(--primary)_/_10%)]">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap">
        {/* Brand and nav items will flow naturally without forced alignment */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
          aria-label="Go to home"
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') navigate(isAuthenticated ? "/dashboard" : "/"); }}
        >
          <BookOpen className="h-7 w-7 text-[hsl(var(--primary))] drop-shadow-[0_1.5px_10px_hsl(var(--primary)_/_18%)]" />
          <span className="text-2xl text-black tracking-tight cursor-pointer">JournalApp</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAuthenticated ? (
            <>
              <NavItem path="/dashboard" icon={BookOpen}>
                Dashboard
              </NavItem>
              <NavItem path="/profile" icon={User}>
                Profile
              </NavItem>
              <button
                type="button"
                onClick={() => navigate("/create")}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]
                  text-[hsl(var(--foreground))] bg-transparent cursor-pointer
                `}
                style={{ minHeight: "40px" }}
              >
                <Plus className="h-5 w-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors duration-200" />
                New Entry
              </button>
              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 border
                  border-[hsl(var(--primary))] text-[hsl(var(--primary))]
                  hover:bg-[hsl(var(--primary-glow))] hover:text-[hsl(var(--primary))]
                  bg-transparent cursor-pointer
                `}
                style={{ minHeight: "40px" }}
              >
                <LogOut className="h-5 w-5 text-[hsl(var(--primary))]" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]
                  text-[hsl(var(--foreground))] bg-transparent cursor-pointer
                `}
                style={{ minHeight: "40px" }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-semibold
                  bg-[hsl(var(--primary))] text-white shadow-sm hover:bg-[hsl(var(--primary-glow))]
                  transition-all duration-200 cursor-pointer
                `}
                style={{ minHeight: "40px" }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
