import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

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
        console.log("Logging in with:", user);

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", user, {
                headers: { "Content-Type": "application/json" },
            });

            console.log(response.data.accessToken);
            if (response.data.token !== "") {
                console.log(response.data
                .accessToken);
                localStorage.setItem("authToken", response.data.accessToken);
                console.log("Login successful, token stored.");
                navigate("/dashboard");
            } else {
                setError("Invalid login response.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username or Email</label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                </p>
            </div>
        </div>
    );
}
