import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-black shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            MyApp
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Register
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Login
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center border border-gray-300">
          <h1 className="text-4xl font-bold text-black mb-8">
            Welcome to Our Application
          </h1>
          <Link to="/register">
            <button className="w-full py-3 bg-black text-white text-lg rounded-md hover:bg-gray-900 transition duration-300">
              Register
            </button>
          </Link>
          <Link to="/login" className="mt-4 block">
            <button className="w-full py-3 border border-black text-black text-lg rounded-md hover:bg-gray-100 transition duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
