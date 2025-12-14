import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Zap,
  Clock,
  Unlock,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "../components/Button";
import { saveApiKey, getApiKey, deleteApiKey } from "../services/db";
import FloatingLines from "@/components/FloatingLines";

// FIX: Updated the text colors in this component to be readable on a light background.
const BenefitItem = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <li className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mt-1">
      <Icon size={18} />
    </div>
    <div>
      {/* Changed text-slate-300 to text-slate-800 */}
      <h3 className="font-bold text-slate-800">{title}</h3>
      {/* Changed text-slate-400 to text-slate-500 */}
      <p className="text-slate-500 text-sm mt-1">{children}</p>
    </div>
  </li>
);

export const Upgrade: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isKeySetOnLoad, setIsKeySetOnLoad] = useState(false);

  useEffect(() => {
    // CHANGE: Use an async function to get the key from IndexedDB
    const checkForKey = async () => {
      const existingKey = await getApiKey();
      if (existingKey) {
        setIsKeySetOnLoad(true);
        setApiKey(existingKey);
      }
    };
    checkForKey();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onGoBack]);

const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      alert("API Key cannot be empty.");
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);
    // You can keep this timeout for UX, or remove it
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    
    // CHANGE: Use the saveApiKey function instead of localStorage
    await saveApiKey(apiKey.trim());

    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleRemoveKey = async () => {
    // CHANGE: Use the deleteApiKey function
    await deleteApiKey();
    setApiKey("");
    setIsKeySetOnLoad(false);
    setIsSuccess(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans bg-black">
      <div className="fixed inset-0 z-0">
        <FloatingLines enabledWaves={['top', 'middle', 'bottom']} bendRadius={3.0} bendStrength={-2}/>
      </div>
      <div className="fixed top-6 left-6 z-20">
        {/* FIX: Changed button variant to have better contrast against the dark background */}
        <Button variant="outline" onClick={onGoBack} className="px-4 py-2 backdrop-blur-md bg-white/10 border-white/10 hover:bg-white/20">
          <ArrowLeft size={22} color="#aaa" />
        </Button>
      </div>

      {/* FIX: The entire card is now white. Removed backdrop-blur as it's not needed on a solid color.
          Changed border color for a light theme. */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in fade-in zoom-in-95 z-10 border border-slate-200 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Information & Benefits (Colors updated for light background) */}
          <div className="p-8 lg:p-12 space-y-8 bg-slate-50/50"> {/* Added a subtle bg color for separation */}
            <div>
              <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-full text-sm mb-6">
                <Unlock size={16} />
                <span>Unlock Full Potential</span>
              </div>
              {/* FIX: Changed text-white to a dark color */}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Use Your Own API Key
              </h1>
              {/* FIX: Changed text-slate-400 to a more readable dark color */}
              <p className="mt-4 text-lg text-slate-600">
                Integrate your personal Google AI Studio API key to bypass shared limits and enjoy a seamless, prioritized experience.
              </p>
            </div>

            <ul className="space-y-6">
              {/* BenefitItem component was updated above to handle color changes */}
              <BenefitItem icon={Zap} title="No Rate Limits">
                Run unlimited generations without worrying about shared usage queues or high-demand periods.
              </BenefitItem>
              <BenefitItem icon={Clock} title="Prioritized Access">
                Your requests are sent directly through your own account, often resulting in faster response times.
              </BenefitItem>
              <BenefitItem icon={CheckCircle} title="Seamless Integration">
                Simply paste your key once. The app will securely store it in your browser for all future sessions.
              </BenefitItem>
            </ul>

            <div className="pt-6 border-t border-slate-200">
              {/* FIX: Changed text-slate-300 to a dark color */}
              <h3 className="font-bold text-slate-800">How to get a key:</h3>
              {/* FIX: Changed text-slate-400 to a dark color */}
              <p className="text-sm text-slate-500 mt-2">
                It's free and takes less than a minute.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                /* FIX: Updated link colors for better contrast on a light background */
                className="inline-flex items-center gap-2 mt-3 text-indigo-600 font-semibold hover:text-indigo-700 transition group"
              >
                <span>Get your key from Google AI Studio</span>
                <ExternalLink
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* Right Side: Interactive Form */}
          {/* FIX: Removed the extra white card wrapper and background color.
              The form elements now live directly inside the right grid column. */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-800">
              {isKeySetOnLoad ? "Update Your Key" : "Enter Your API Key"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your key is stored securely in your browser and never sent to our servers.
            </p>

            <div className="relative mt-6">
              <KeyRound
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Paste your Google AI API key here"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-inner bg-slate-50"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSuccess(false);
                }}
                disabled={isLoading}
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleSaveKey}
                disabled={isLoading || !apiKey.trim()}
                className={`w-full flex items-center justify-center text-lg font-semibold px-6 py-4 rounded-xl transition-all duration-300 transform active:scale-95
                  ${
                    isSuccess
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Verifying & Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="mr-3" size={24} />
                    Key Saved Successfully!
                  </>
                ) : (
                  "Save & Activate Key"
                )}
              </button>
            </div>

            {isSuccess && (
              <p className="text-center mt-4 text-green-700 font-medium animate-in fade-in">
                You're all set! Taking you back...
              </p>
            )}

            {isKeySetOnLoad && !isSuccess && (
              <div className="text-center mt-4">
                <button onClick={handleRemoveKey} className="text-sm text-slate-500 hover:text-red-600 hover:underline transition-colors">
                  Remove current key
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};