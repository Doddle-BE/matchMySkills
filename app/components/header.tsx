import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/30 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-10 w-10 text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Analyze{" "}
            <a
              href="https://www.linkedin.com/in/jorisheyens/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] hover:bg-right transition-all duration-500 ease-in-out animate-gradient">
                Joris Heyens&apos;
              </span>
            </a>{" "}
            skills against your job description
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto backdrop-blur-sm py-2">
            Upload a job description and I&apos;ll analyze how it matches my
            skills and experience.
          </p>
        </div>
      </div>

      {/* Add subtle animated particles in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-float"></div>
          <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float-slow"></div>
        </div>
      </div>
    </div>
  );
}
