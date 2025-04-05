import { useState } from "react";
import axios from "axios";

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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="mb-5 text-2xl font-semibold text-gray-800">Register</h2>

            {message && (
                <p className="mb-3 p-3 text-sm rounded bg-green-100 text-green-800 border border-green-300">
                    {message}
                </p>
            )}
            {error && (
                <p className="mb-3 p-3 text-sm rounded bg-red-100 text-red-800 border border-red-300">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    autoComplete="off"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    name="matchingPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
