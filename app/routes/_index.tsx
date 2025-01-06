import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "~/components/file-upload";
import { Header } from "~/components/header";
import SkillsAssessment from "~/components/skills-assessment";
import { SubmitButton } from "~/components/submit-button";
import { extractSkillsFromFile } from "~/server/openai/skillsExtractor.server";
import type { ParsedSkills } from "~/types/types";
import { DisclosureDialog } from "~/components/disclosure-dialog";

const mockData = {
  ok: true,
  data: {
    candidateMatch: {
      matched_skills: [
        "React",
        "REST and/or GraphQL APIs",
        "Docker",
        "Kubernetes",
        "Azure",
        "Node.js",
        "Express.js",
        "Mentoring",
        "SCRUM",
        "Collaboration",
      ],
      missing_skills: ["C#", "microservices architecture", "Kafka", ".NET"],
      additional_skills: [
        "JavaScript",
        "TypeScript",
        "Remix",
        "Next.js",
        "HTML5",
        "CSS3",
        "SQL",
        "NoSQL",
        "Redis",
        "Git",
        "API development",
        "AI technologies",
        "Nest.js",
        "Cloud platforms",
      ],
      suitability_summary:
        "The candidate has several matching skills such as strong React expertise, experience with REST and GraphQL APIs, Docker, Kubernetes, and knowledge of Azure, which align with the job requirements. However, they lack experience in core technologies required for the role, such as C#, microservices architecture, and .NET, which are critical for the position. Their strong backend and full stack experience can be beneficial, but the focus on .NET and C# suggests the candidate may not be a perfect fit for this role. A recommendation would be to consider the candidate for roles with a stronger emphasis on Node.js or JavaScript frameworks.",
    },
    rawText: "",
  },
  error: null,
};

export async function action({ request }: ActionFunctionArgs) {
  let parsedSkills: ParsedSkills = {
    candidateMatch: {
      matched_skills: [],
      missing_skills: [],
      additional_skills: [],
      suitability_summary: "",
    },
    rawText: "",
  };

  try {
    const formData = await request.formData();
    const file = formData.get("document");

    // check if file is a valid file
    if (file instanceof File) {
      if (file.size <= 0) {
        return { ok: false, error: "File is empty", data: parsedSkills };
      }

      if (process.env.NODE_ENV === "development") {
        // MOCK DATA ONLY FOR DEVELOPMENT
        return mockData;
      }

      parsedSkills = await extractSkillsFromFile(
        file,
        process.env.OPENAI_API_KEY || ""
      );
    }

    return { ok: true, data: parsedSkills, error: null };
  } catch (error) {
    return { ok: false, error: (error as Error).message, data: parsedSkills };
  }
}

export default function Start() {
  const actionData = useActionData<typeof action>();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [showDisclosure, setShowDisclosure] = useState(true);

  const {
    ok,
    data: { candidateMatch } = {
      candidateMatch: {
        matched_skills: [],
        missing_skills: [],
        additional_skills: [],
        suitability_summary: "",
      },
    },
    error,
  } = actionData || {};

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    if (isSubmitting) {
      setShowResults(false);
    } else if (actionData?.ok) {
      setShowResults(true);
    }
  }, [isSubmitting, actionData]);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("disclosureAccepted") === "true";
    setShowDisclosure(!hasAccepted);
  }, []);

  useEffect(() => {
    // Small delay to allow for smooth fade-in
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <DisclosureDialog
        isOpen={showDisclosure}
        onClose={() => setShowDisclosure(false)}
      />

      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
          <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Form ref={formRef} method="post" encType="multipart/form-data">
            <FileUpload newFileIsSelected={() => setShowResults(false)} />
            <SubmitButton isSubmitting={isSubmitting} />
          </Form>

          {ok === false && error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {ok === true && candidateMatch && showResults && (
            <div className="mt-4">
              <SkillsAssessment data={candidateMatch} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
