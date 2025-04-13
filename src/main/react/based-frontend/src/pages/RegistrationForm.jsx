import { useState } from "react";
import axios from "axios";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function RegistrationForm() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    matchingPassword: "",
    profilePicture: "me.jpg",
    status: "OFFLINE",
    enabled: false,
    roles: ["ROLE_CUSTOMER"],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", user, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage(response.data);
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <FloatingIconsBackground />

      <GlassCard className="w-full max-w-md backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>

        <CardContent>
          {message && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              autoComplete="off"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
            />
            <Input
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
            />
            <Input
              type="password"
              name="matchingPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
            />

            <div className="flex w-full gap-4">
              <Button
                type="submit"
                className="flex-1 bg-black/90 dark:bg-white/90 backdrop-blur-md border border-white/30 text-white dark:text-black uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
              >
                Register
              </Button>

              <Button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 text-black dark:text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-white transition-all duration-200"
              >
                Login instead
              </Button>
            </div>
          </form>
        </CardContent>
      </GlassCard>
    </div>
  );
}
