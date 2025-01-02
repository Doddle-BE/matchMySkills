import { LoadingSpinner } from "./loading-spinner";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 
        ${
          isSubmitting
            ? "bg-indigo-400/50 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        } text-white`}
    >
      {isSubmitting ? <LoadingSpinner /> : "Analyze Document"}
    </button>
  );
}
