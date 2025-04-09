import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RocketIcon, BookIcon, ShoppingBagIcon, GithubIcon } from "lucide-react"

// experimental ui
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground"
import GlassCard from "../components/xp-ui/GlassCard"

export default function MainPage() {
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 overflow-hidden">
        {/* Decorative Floating Icons */}
        <FloatingIconsBackground />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 z-10">

          {/* Hero Card */}
          <GlassCard>
            <div className="flex flex-col items-center gap-4">
              <RocketIcon className="w-12 h-12 text-black/70" />
              <h1 className="text-3xl text-center font-bold">
                Welcome to <span className="text-black/70">the SE Project!</span>
              </h1>
              <p className="text-center text-muted-foreground">
                A Bookshop & Inventory Management System.
              </p>

              <div className="flex flex-col gap-3 w-full mt-4">
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

          {/* Bento Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <GlassCard className="hover:scale-[1.03] transition-transform duration-300">
              <div className="flex flex-col items-center gap-2 text-center">
                <BookIcon className="w-10 h-10 text-black/70" />
                <h3 className="font-semibold text-lg">BookShop</h3>
                <p className="text-muted-foreground text-sm">
                  Explore a curated collection of books.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="hover:scale-[1.03] transition-transform duration-300">
              <div className="flex flex-col items-center gap-2 text-center">
                <ShoppingBagIcon className="w-10 h-10 text-black/70" />
                <h3 className="font-semibold text-lg">Inventory</h3>
                <p className="text-muted-foreground text-sm">
                  Seamlessly manage your shop inventory.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="hover:scale-[1.03] transition-transform duration-300 col-span-1 sm:col-span-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <GithubIcon className="w-10 h-10 text-black/70" />
                <h3 className="font-semibold text-lg">GitHub</h3>
                <a
                  href="https://github.com/your-username/your-repo-name"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground underline hover:text-black transition"
                >
                  View Repository
                </a>
              </div>
            </GlassCard>

          </div>
        </div>

      </div>

    
      {/* About Section */}
      <section
        id="about"
        className="py-20 px-4 flex justify-center items-center bg-black text-white relative overflow-hidden"
      >
        <FloatingIconsBackground />

        <div className="max-w-3xl w-full text-center space-y-6 z-10">
          <h2 className="text-4xl font-bold">About This Project</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Built with ❤️ using React, shadcn/ui, and TailwindCSS to deliver a modern bookshop experience with inventory management tools.
          </p>
          <a
            href="https://github.com/your-username/your-repo-name"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur text-white font-medium shadow-inner hover:bg-white/10 transition"
          >
            View on GitHub
          </a>
        </div>
      </section>

      
    </>
  )
}
