import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyUser() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const isSuccess = status === "success";

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 px-4">
      <Card className={`w-full max-w-sm border-2 ${isSuccess ? "border-green-600" : "border-red-600"}`}>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Email Verification
          </h2>

          <p className={`mb-6 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {isSuccess
              ? "User Verified Successfully!"
              : "Verification failed. Invalid or expired token."}
          </p>

          <Link to="/login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
