import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function LoginPage() {
  const [user, setUser] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        user,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setError("Invalid login response.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <FloatingIconsBackground />
      
      <GlassCard className="w-[400px] z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="usernameOrEmail"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              className="w-full bg-white/90 backdrop-blur-md border border-black/30 text-black uppercase tracking-wide hover:bg-purple-300 hover:text-black transition-all duration-200"
            >
              Login
            </Button>
          </form>

          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              onClick={() => navigate('/register')}
              className="flex-1 bg-black/90 backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
            >
              Register
            </Button>

            <Button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="flex-1 bg-black/90 backdrop-blur-md border border-white/30 text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
            >
              Forgot Password?
            </Button>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
