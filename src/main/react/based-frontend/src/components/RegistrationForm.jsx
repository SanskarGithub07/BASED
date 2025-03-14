import { useState } from "react";
import axios from "axios";
import "../styles/RegistrationForm.css"

export default function RegistrationForm() {
    const [user, setUser] = useState({
        userName: "",
        email: "",
        password: "",
        matchingPassword: "",
        profilePicture: "me.jpg",
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
            const response = await axios.post("http://localhost:8080/register/user", user, {
                headers: { "Content-Type": "application/json" },
            });

            setMessage(response.data);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input autocomplete="off" type="text" name="userName" placeholder="Username" onChange={handleChange} required />
                <input autocomplete="off" type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="password" name="matchingPassword" placeholder="Confirm Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
