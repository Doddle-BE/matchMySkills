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
            ? "bg-indigo-400/50 dark:bg-indigo-400/50 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-600 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/25 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40"
        } text-white`}
    >
      {isSubmitting ? <LoadingSpinner /> : "Analyze Document"}
    </button>
  );
}
