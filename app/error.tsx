"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    // Function to extract a user-friendly error message
    const getUserFriendlyErrorMessage = (error: Error) => {
        // Example: Remove technical details like error codes or stack traces
        const message = error.message.replace(/Error: |\d+|\[.*\]/g, "").trim();

        // Default message if no meaningful message is found
        return message || "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Quelque chose s&apos;est mal passé !</h2>
                <p className="text-gray-700 mb-6">
                    {getUserFriendlyErrorMessage(error)}
                </p>
                <button
                    onClick={() => reset()} // Attempt to recover by trying to re-render the segment
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}