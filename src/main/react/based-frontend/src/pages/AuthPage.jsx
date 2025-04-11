import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [user, setUser] = useState({
    usernameOrEmail: "",
    password: "",
    email: "", // Only for register
    username: "", // Only for register
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user.usernameOrEmail || !user.password || (activeTab === "register" && (!user.email || !user.username))) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const url =
        activeTab === "login"
          ? "http://localhost:8080/api/auth/login"
          : "http://localhost:8080/api/auth/register";

      const payload =
        activeTab === "login"
          ? { usernameOrEmail: user.usernameOrEmail, password: user.password }
          : {
              username: user.username,
              email: user.email,
              password: user.password,
            };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (activeTab === "login") {
        if (response.data.accessToken) {
          localStorage.setItem("authToken", response.data.accessToken);
          navigate("/dashboard");
        } else {
          setError("Invalid login response.");
        }
      } else {
        alert("Registration Successful! Please Login.");
        setActiveTab("login");
        setUser({ usernameOrEmail: "", password: "", email: "", username: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <FloatingIconsBackground />

      <GlassCard className="w-full max-w-md p-8 shadow-lg backdrop-blur-xl border border-white/10 rounded-2xl z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-4">
            Welcome to SE Project
          </CardTitle>

          <div className="flex gap-2 justify-center">
            <Button
              variant={activeTab === "login" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`flex-1 ${activeTab === "login" ? "" : "border border-white/20 bg-white/10 dark:bg-black/20"}`}
            >
              Login
            </Button>

            <Button
              variant={activeTab === "register" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`flex-1 ${activeTab === "register" ? "" : "border border-white/20 bg-white/10 dark:bg-black/20"}`}
            >
              Register
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {activeTab === "register" && (
              <>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
                />
              </>
            )}

            <Input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
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

            <Button
              type="submit"
              className="w-full bg-black/90 dark:bg-white/90 backdrop-blur-md border border-white/30 text-white dark:text-black uppercase tracking-wide hover:bg-purple-400/70 hover:text-black transition-all duration-200"
            >
              {activeTab === "login" ? "Login" : "Register"}
            </Button>
          </form>

          {activeTab === "login" && (
            <Button
              variant="ghost"
              className="mt-4 w-full text-center text-sm text-black/60 dark:text-white/60 hover:text-purple-400"
              onClick={() => alert("Forgot Password Clicked")}
            >
              Forgot Password?
            </Button>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
