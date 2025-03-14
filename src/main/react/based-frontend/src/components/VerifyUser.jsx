import { useSearchParams } from "react-router-dom";
import "../styles/VerifyUser.css";

export default function VerifyUser() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status"); // Read status from the URL

    return (
        <div className="verify-container">
            <div className={`verify-box ${status}`}>
                <h2>Email Verification</h2>
                <p>
                    {status === "success"
                        ? "User Verified Successfully!"
                        : "Verification failed. Invalid or expired token."}
                </p>
            </div>
        </div>
    );
}
