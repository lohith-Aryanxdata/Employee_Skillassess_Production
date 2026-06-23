import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/utils/helpers";
import { LogOut, Zap } from "lucide-react";
import PillNav from "@/component/PillNav/PillNav";

const EMPLOYEE_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/self-assessment", label: "Self Assessment" },
  { to: "/test", label: "MCQ Test" },
  { to: "/results", label: "My Results" },
  { to: "/leaderboard", label: "Leaderboard" },
];

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/employees", label: "Employees" },
  { to: "/admin/questions", label: "Questions" },
  { to: "/admin/analytics", label: "Analytics" },
];

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel =
    user?.role === "ADMIN" ? "Platform Admin" : user?.role?.toLowerCase() || "user";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar + info */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-white text-[11px] font-bold tracking-wide flex-shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[11px] font-semibold text-white/90">{roleLabel}</span>
          <span className="text-[10px] text-white/40">{user?.name}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/15 hidden sm:block" />

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/50 hover:text-red-400 hover:bg-white/5 transition-all duration-150"
        title="Sign out"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}

function TopBar({ links }) {
  const location = useLocation();
  const pillItems = links.map((link) => ({
    href: link.to,
    label: link.label,
  }));
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
      <div
        className="h-16 px-6"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Logo - Left */}
        <div className="flex items-center gap-2 justify-self-start">
          <div className="p-1.5 rounded-lg gradient-brand">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">SkillAssess</span>
        </div>

        {/* Center-aligned Navbar */}
        <div className="flex justify-center">
          <PillNav
            items={pillItems}
            activeHref={location.pathname}
            baseColor="#000000"
            pillColor="#1a1a2e"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#ffffff"
            initialLoadAnimation={false}
          />
        </div>

        {/* User Menu - Right */}
        <div className="flex justify-end justify-self-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function EmployeeLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <TopBar links={EMPLOYEE_LINKS} />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <TopBar links={ADMIN_LINKS} />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}