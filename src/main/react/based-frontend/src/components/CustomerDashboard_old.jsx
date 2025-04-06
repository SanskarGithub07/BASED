import { Link } from "react-router-dom";

export default function CustomerDashboard(){
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-blue-400 text-3xl">Welcome to customer dashboard page.</h1>
            <Link to="/logout" className="w-72">
                <button className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition duration-300">
                    Logout
                </button>
            </Link>
        </div>
    );
}