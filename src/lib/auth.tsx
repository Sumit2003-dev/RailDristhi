import React, { createContext, useContext, useEffect, useState } from "react";

export type AuthorityRole = "controller" | "station_master" | "dispatcher" | "admin";

export type AuthorityUser = {
  id: string;
  badgeId: string;
  name: string;
  role: AuthorityRole;
  roleTitle: string;
  zone: string;
  division: string;
  designation: string;
  securityClearance:
    "LEVEL_4_CHIEF_CONTROLLER" | "LEVEL_3_SECTION_DISPATCH" | "LEVEL_2_STATION_OPS";
  stationCode?: string;
  lastLogin: string;
};

export const PRESET_AUTHORITIES: AuthorityUser[] = [
  {
    id: "auth-1",
    badgeId: "IR-CTRL-782",
    name: "Rajesh Sharma",
    role: "controller",
    roleTitle: "Chief Section Controller",
    zone: "NR (Northern Railway)",
    division: "Delhi (DLI)",
    designation: "Principal Section Dispatcher — High Density Network",
    securityClearance: "LEVEL_4_CHIEF_CONTROLLER",
    lastLogin: "Active Now",
  },
  {
    id: "auth-2",
    badgeId: "IR-DISP-409",
    name: "Priya Venkataraman",
    role: "dispatcher",
    roleTitle: "Chief Dispatch Officer",
    zone: "WR (Western Railway)",
    division: "Mumbai (MMCT)",
    designation: "Suburban & Trunk Section Traffic Controller",
    securityClearance: "LEVEL_3_SECTION_DISPATCH",
    lastLogin: "Active Now",
  },
  {
    id: "auth-3",
    badgeId: "IR-STM-104",
    name: "Anil Deshmukh",
    role: "station_master",
    roleTitle: "Senior Station Director",
    zone: "NR (Northern Railway)",
    division: "Delhi (NDLS)",
    stationCode: "NDLS",
    designation: "Station Operations & Terminal Dispatch Manager",
    securityClearance: "LEVEL_2_STATION_OPS",
    lastLogin: "Active Now",
  },
];

type AuthContextType = {
  user: AuthorityUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (badgeId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  loginAsPreset: (authority: AuthorityUser) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "railsaarthi_authority_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthorityUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      }
    } catch {
      // Ignore storage read error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    badgeId: string,
    pin: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Validate inputs
    const cleanBadge = badgeId.trim().toUpperCase();
    const cleanPin = pin.trim();

    if (!cleanBadge || !cleanPin) {
      return { success: false, error: "Please enter both Official Badge ID and Security PIN." };
    }

    // Match preset or permit standard demo passwords (rail2026, sih2026, 1234)
    const matchedPreset = PRESET_AUTHORITIES.find(
      (p) => p.badgeId.toUpperCase() === cleanBadge || p.id === cleanBadge,
    );

    const validPins = ["rail2026", "sih2026", "1234", "admin", "controller"];
    const isValidPin = validPins.includes(cleanPin.toLowerCase());

    if (!isValidPin && !matchedPreset) {
      return {
        success: false,
        error: "Invalid Credentials. Use PIN 'rail2026' or select a Demo Profile below.",
      };
    }

    const sessionUser: AuthorityUser = matchedPreset || {
      id: `custom-${cleanBadge}`,
      badgeId: cleanBadge,
      name: "Authorized Section Officer",
      role: "controller",
      roleTitle: "Section Dispatch Controller",
      zone: "NR (Northern Railway)",
      division: "Central Division",
      designation: "Operational Traffic Controller",
      securityClearance: "LEVEL_3_SECTION_DISPATCH",
      lastLogin: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setUser(sessionUser);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      } catch {
        // storage save error
      }
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginAsPreset = (authority: AuthorityUser) => {
    const sessionUser: AuthorityUser = {
      ...authority,
      lastLogin: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setUser(sessionUser);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      } catch {
        // storage save error
      }
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // storage remove error
      }
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsPreset,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
