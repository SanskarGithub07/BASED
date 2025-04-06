import { Link } from "react-router-dom";

export default function App() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Welcome to Our Application
            </h1>
            <Link to="/register" className="w-72">
                <button className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition duration-300">
                    Register
                </button>
            </Link>
            <Link to="/login" className="w-72 mt-4">
                <button className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition duration-300">
                    Login
                </button>
            </Link>
        </div>
    );
}
