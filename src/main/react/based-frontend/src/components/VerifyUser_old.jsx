import { useSearchParams } from "react-router-dom";

export default function VerifyUser() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    const isSuccess = status === "success";

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100">
            <div
                className={`p-6 rounded-lg shadow-lg text-center w-80 bg-white border-2 ${
                    isSuccess ? "border-green-600 text-green-600" : "border-red-600 text-red-600"
                }`}
            >
                <h2 className="text-xl font-semibold mb-2">Email Verification</h2>
                <p>
                    {isSuccess
                        ? "User Verified Successfully!"
                        : "Verification failed. Invalid or expired token."}
                </p>
            </div>
        </div>
    );
}
