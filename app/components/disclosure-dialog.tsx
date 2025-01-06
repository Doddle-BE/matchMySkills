import { useState } from "react";
import { X } from "lucide-react";

export function DisclosureDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("disclosureAccepted", "true");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome to my AI-Powered Match Checker
          </h2>

          <div className="prose dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300">Hey there! 👋</p>
            <p className="text-gray-600 dark:text-gray-300">
              I've built this tool to showcase how AI can simplify the
              recruitment process. Drop your vacancy details, and the AI will
              analyze how well it matches with my skills and experience.
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              Please note that while the AI is pretty smart, it's still a tech
              demo - think of it as a quick first pass to see if we might be a
              good match.
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">
                Did the AI suggest we're a great fit?
              </span>{" "}
              Fantastic! Let's connect:
            </p>

            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2 mt-4">
              <li>
                💼 Find me on LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/jorisheyens/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  https://www.linkedin.com/in/jorisheyens/
                </a>
              </li>
              <li>🗣️ Message me on LinkedIn to schedule a call!</li>
            </ul>

            <div className="mt-4">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>I understand. Don't show again</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-6 py-3 px-4 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/25 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40 transition-all duration-200"
            >
              Continue to the app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
