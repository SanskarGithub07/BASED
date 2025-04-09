import { RocketIcon, BookIcon, WarehouseIcon, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

export default function MainPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-muted">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        <FloatingIconsBackground />
        {/* Welcome Card */}
        <GlassCard className="w-full md:w-1/2 bg-white/80 dark:bg-black/80 shadow-lg rounded-2xl p-8">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <RocketIcon className="h-10 w-10 text-gray-800 dark:text-gray-200" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to <span className="text-primary">the SE Project!</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              A Bookshop & Inventory Management System.
            </p>
            <div className="flex flex-col gap-3 w-full">
            <Button asChild>
            <Link to="/register">Register</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>

            </div>

          </CardContent>
        </GlassCard>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-1/2">
          <Card className="bg-white/80 dark:bg-black/80 p-6 rounded-2xl shadow-md">
            <CardContent className="flex flex-col items-center text-center gap-2">
              <BookIcon className="h-8 w-8 text-gray-800 dark:text-gray-200" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                BookShop
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore a curated collection of books.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-black/80 p-6 rounded-2xl shadow-md">
            <CardContent className="flex flex-col items-center text-center gap-2">
              <WarehouseIcon className="h-8 w-8 text-gray-800 dark:text-gray-200" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Inventory
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Seamlessly manage your shop inventory.
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-full bg-white/80 dark:bg-black/80 p-5 rounded-2xl shadow-md">
            <CardContent className="flex flex-col items-center text-center gap-2">
              <GithubIcon className="h-8 w-8 text-gray-800 dark:text-gray-200" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                GitHub
              </h2>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline dark:text-primary/80"
              >
                View Repository
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
