import { useState } from "react";
import BookRequestForm from "@/components/BookRequestForm_Comp";
import RecentBookRequests from "@/components/RecentBookRequests_Comp";
import FloatingIconsBackground from "@/components/xp-ui/FloatingiconsBackground";
import { Toaster } from "@/components/ui/sonner"; // Ensure this is correctly imported

export default function BookRequestPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Callback function to trigger refresh in RecentBookRequests
  const handleFormSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {/* Background and Toaster */}
      <FloatingIconsBackground />
      <Toaster position="bottom-center" richColors /> {/* Uncommented Toaster */}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 relative z-10"> {/* Added relative z-10 to ensure content is above background */}
        {/* Book Request Form */}
        <BookRequestForm onFormSubmitSuccess={handleFormSubmitSuccess} />

        {/* Recent Book Requests List */}
        {/* Pass the refreshKey prop to trigger re-fetch */}
        <RecentBookRequests refreshKey={refreshKey} />
      </div>
    </>
  );
}