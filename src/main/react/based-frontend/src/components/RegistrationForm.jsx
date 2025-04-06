import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
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
                        />
                        <Input
                            autoComplete="off"
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="matchingPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
