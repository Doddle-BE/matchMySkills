import type React from "react";
import { CheckCircle2, XCircle, Plus } from "lucide-react";
import type { CandidateMatch } from "~/types/types";
import { useEffect, useRef } from "react";

interface SkillsAssessmentProps {
  data: CandidateMatch;
}

const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({ data }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    componentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      ref={componentRef}
      className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-slide-up">
        Skills Assessment
      </h2>

      <div className="grid gap-8 mb-8">
        <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">
            Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {data.suitability_summary}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              Matched Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.matched_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              Missing Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              Additional Skills Joris
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.additional_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
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
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessment;
