import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <h1 className="text-3xl font-semibold text-blue-500 mb-8">
            Welcome to Customer Dashboard
          </h1>

          <Link to="/logout" className="block">
            <Button className="w-full">
              Logout
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
