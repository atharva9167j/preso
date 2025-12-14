// File: components/Layout.tsx
import React, { useState, useEffect, useRef } from "react";
import { getUserName, getApiKey } from "../services/db";
import { ProfileDropdown } from "./ProfileDropdown";
import logo from "@/assets/logo_transparent.png";

interface LayoutProps {
  children: React.ReactNode;
  onGoHome: () => void;
  currentView: string;
  title?: string;
  saveDeckTitle: () => void;
  headerActions?: React.ReactNode;
  onUpgradeClick: () => void;
  isWorking: boolean;
  showToast: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onGoHome,
  currentView,
  title,
  saveDeckTitle,
  headerActions,
  onUpgradeClick,
  isWorking,
  showToast,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [isUpgraded, setIsUpgraded] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await getUserName();
      setUserName(storedName || "Guest");

      const storedApiKey = await getApiKey();
      setIsUpgraded(!!storedApiKey);
    };

    loadUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden h-screen">
      <header
        className={`${
          currentView === "deck" ? "bg-white border-b border-slate-200" : ""
        } flex-none z-30 h-14 fixed w-full`}
      >
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-md transition-colors"
              onClick={onGoHome}
            >
              <img src={logo} className="h-12" />
            </div>
            {title && (
              <>
                <div className="h-5 w-[1px] bg-slate-300"></div>
                <input
                  className="font-medium text-slate-600 text-sm truncate"
                  value={title}
                  onChange={(e) => saveDeckTitle(e.target.value)}
                ></input>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  if (isWorking) {
                    showToast("Please wait while AI is working");
                    return;
                  }
                  setIsProfileOpen(!isProfileOpen);
                }}
                className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white shadow-sm overflow-hidden transition-all duration-300 ${
                  isProfileOpen
                    ? "ring-2 ring-offset-1 ring-indigo-500 scale-110"
                    : "hover:ring-2 hover:ring-offset-1 hover:ring-indigo-500"
                }`}
              >
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}`}
                  alt="Avatar"
                />
              </button>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userName={userName}
                setUserName={setUserName}
                isUpgraded={isUpgraded}
                onUpgradeClick={onUpgradeClick}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};
