import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import FloatingIconsBackground from "./xp-ui/FloatingiconsBackground";
import GlassCard from "./xp-ui/GlassCard";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyUser() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const isSuccess = status === "success";

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden px-4">
      <FloatingIconsBackground />

      <GlassCard className="w-[400px] z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
        </CardHeader>

        <CardContent className="p-6 flex flex-col items-center text-center gap-6">
          {isSuccess ? (
            <CheckCircle className="text-green-500 animate-pulse w-16 h-16" />
          ) : (
            <XCircle className="text-red-500 animate-pulse w-16 h-16" />
          )}

          <p className={`text-lg font-medium ${isSuccess ? "text-green-500" : "text-red-500"}`}>
            {isSuccess
              ? "User Verified Successfully!"
              : "Verification failed. Invalid or expired token."}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button
              asChild
              className="w-full bg-white/90 backdrop-blur-md border border-black/20 text-black uppercase tracking-wide hover:bg-purple-300 hover:text-black transition-all duration-200"
            >
              <Link to="/login">Go to Login</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full uppercase tracking-wide border-black/20"
            >
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
