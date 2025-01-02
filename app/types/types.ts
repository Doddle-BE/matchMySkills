// Types
type CandidateMatch = {
  matched_skills: string[];
  missing_skills: string[];
  additional_skills: string[];
  suitability_summary: string;
};

type ParsedSkills = {
  candidateMatch: CandidateMatch;
  rawText: string;
};

// Type Guards
function isCandidateMatch(value: unknown): value is CandidateMatch {
  // First check if value is an object
  if (!value || typeof value !== "object") {
    return false;
  }

  // Type assertion to make TypeScript happy for property checks
  const candidate = value as Record<string, unknown>;

  // Check if all required properties exist and are of correct type
  const hasMatchedSkills =
    Array.isArray(candidate.matched_skills) &&
    candidate.matched_skills.every((skill) => typeof skill === "string");

  const hasMissingSkills =
    Array.isArray(candidate.missing_skills) &&
    candidate.missing_skills.every((skill) => typeof skill === "string");

  const hasAdditionalSkills =
    Array.isArray(candidate.additional_skills) &&
    candidate.additional_skills.every((skill) => typeof skill === "string");

  const hasSuitabilitySummary =
    typeof candidate.suitability_summary === "string";

  return (
    hasMatchedSkills &&
    hasMissingSkills &&
    hasAdditionalSkills &&
    hasSuitabilitySummary
  );
}
export { isCandidateMatch };
export type { CandidateMatch, ParsedSkills };
