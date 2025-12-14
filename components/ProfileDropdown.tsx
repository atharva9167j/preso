// File: components/ProfileDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Edit, Zap, Users, LogOut } from 'lucide-react';
import { Button } from './Button';
import { saveUserName, resetDatabase } from '../services/db';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  isUpgraded: boolean;
  onUpgradeClick: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  userName,
  setUserName,
  isUpgraded,
  onUpgradeClick
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(userName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync prop changes to local state
  useEffect(() => {
    setEditableName(userName);
  }, [userName]);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = async () => {
    if (editableName.trim()) {
      const newName = editableName.trim();
      setUserName(newName);
      await saveUserName(newName);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditableName(userName); // Reset to original name
      setIsEditingName(false);
    }
  };

  const handleReset = async () => {
      if (window.confirm("Are you sure you want to reset all your data? This will remove your name, API key, and delete all presentations. This action cannot be undone.")) {
          await resetDatabase();
          window.location.reload();
      }
  }

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-10 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95"
      onClick={(e) => e.stopPropagation()}
    >
      {/* User Info Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}`}
            alt="Avatar"
          />
        </div>
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-100 border border-indigo-300 rounded-md px-2 py-1 text-base font-bold text-slate-800 outline-none ring-2 ring-indigo-200"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h3 className="text-base font-bold text-slate-800 truncate" title={userName}>
                {userName}
              </h3>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
              >
                <Edit size={14} />
              </button>
            </div>
          )}
          <p className="text-xs text-slate-500">Personal Account</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Upgrade Status Section */}
        <div 
          className={`bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between gap-3 ${isUpgraded ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`} 
          onClick={isUpgraded ? onUpgradeClick : undefined}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isUpgraded
                  ? 'bg-green-100 text-green-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {isUpgraded ? <Zap size={16}/> : <Users size={16} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {isUpgraded ? 'Pro Access' : 'Shared Access'}
              </p>
              <p className="text-xs text-slate-500">
                {isUpgraded ? 'Using your API Key' : 'Limited usage'}
              </p>
            </div>
          </div>
          {!isUpgraded && (
              <Button size="sm" onClick={onUpgradeClick}>Upgrade</Button>
          )}
        </div>
        
        {/* Reset Button */}
         <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>Reset User Data</span>
        </button>
      </div>
    </div>
  );
};