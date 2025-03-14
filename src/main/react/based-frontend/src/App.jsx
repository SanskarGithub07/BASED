import { Link } from "react-router-dom";
import './App.css'
export default function App() {
    return (
        <div className="main-container">
            <h1>Welcome to Our Application</h1>
            <Link to="/register">
                <button className="register-btn">Register</button>
            </Link>
        </div>
    );
}
