import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RocketIcon } from "lucide-react"

// from experimental ui
import FloatingIconsBackground from "./xp-ui/FloatingiconsBackground"
import GlassCard from "./xp-ui/GlassCard"

export default function MainPage() {
  return (
    <>
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 overflow-hidden">
      
      {/* Decorative background */}
      <FloatingIconsBackground />

      {/* Glass effect card */}
      <GlassCard>
        <div className="flex flex-col items-center gap-4">
          <RocketIcon className="w-12 h-12 text-black/70" />
          <h1 className="text-3xl text-center">
            Welcome to <span className="text-black/70">the SE Project!</span>
          </h1>
          <p className="text-center text-muted-foreground">
            A Bookshop and Inventory Management System.
          </p>

          <div className="flex flex-col gap-4 w-full mt-4">
            <Link to="/register">
              <Button className="w-full hover:scale-105 transition-transform duration-200">
                Register
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-200">
                Login
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full text-sm">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>

    </div>

    <section id="about" className="py-20 px-4 flex justify-center items-center bg-black text-white">
  <FloatingIconsBackground />

  <div className="max-w-2xl w-full">
    <Card className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-10 space-y-4">
      <h2 className="text-3xl font-bold text-white text-center">About This Project</h2>

      <p className="text-muted-foreground text-lg leading-relaxed text-center">
        Built using React, shadcn/ui, and TailwindCSS. 
      </p>

      <div className="flex justify-center">
        <a 
          href="https://github.com/your-username/your-repo-name"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur text-white font-medium shadow-inner hover:bg-white/10 transition"
        >
          View on GitHub
        </a>
      </div>
    </Card>
  </div>
</section>



  </>


  )
}
