import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "~/components/file-upload";
import { Header } from "~/components/header";
import SkillsAssessment from "~/components/skills-assessment";
import { SubmitButton } from "~/components/submit-button";
import { extractSkillsFromFile } from "~/server/openai/skillsExtractor.server";
import type { ParsedSkills } from "~/types/types";

const mockData = {
  ok: true,
  data: {
    candidateMatch: {
      matched_skills: ["React"],
      missing_skills: [
        ".NET",
        "C#",
        "Microservices architecture",
        "REST or GraphQL APIs",
        "Kafka",
        "Docker",
        "Kubernetes",
        "Continuous Integration systems",
        "Analytical and problem-solving skills",
      ],
      additional_skills: ["JavaScript", "TypeScript", "Remix", "Node.js"],
      suitability_summary:
        "The candidate has experience with React, which matches one of the key requirements of the job. However, they lack experience in other critical technologies and skills required for the role, making them less suitable for the position.",
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

      // MOCK DATA
      // return mockData;

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
  const formRef = useRef<HTMLFormElement>(null);
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

  return (
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
  );
}
