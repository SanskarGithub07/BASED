import BookRequestForm from "@/components/BookRequestForm_Comp"; 
import RecentBookRequests from "@/components/RecentBookRequests_Comp"; 
import FloatingIconsBackground from "@/components/xp-ui/FloatingiconsBackground"; 
import { Toaster } from "@/components/ui/sonner"; 
import { useState } from "react";

export default function BookRequestPage() {
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleFormSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <FloatingIconsBackground />
      {/* <Toaster position="bottom-center" richColors /> */}
      <div className="container mx-auto px-4 py-8">
        <BookRequestForm onFormSubmitSuccess={handleFormSubmitSuccess} />
        <RecentBookRequests refreshKey={refreshKey} />
      </div>
    </>
  );
}