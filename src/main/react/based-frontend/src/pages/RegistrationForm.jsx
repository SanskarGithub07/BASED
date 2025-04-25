import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Import icons

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter // Might add footer for actions later if needed
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle // Use AlertTitle for clearer messages
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Import Label component
import FloatingIconsBackground from "../components/xp-ui/FloatingiconsBackground";
import GlassCard from "../components/xp-ui/GlassCard";

// Define default state outside the component for clarity
const defaultUserState = {
  username: "",
  email: "",
  password: "",
  matchingPassword: "",
  profilePicture: "me.jpg", // Consider making this optional or handled differently
  status: "OFFLINE", // Seems like backend state, maybe not needed in frontend form?
  enabled: false, // Seems like backend state
  roles: ["ROLE_CUSTOMER"],
};

const defaultAvailableRoles = [{ value: "ROLE_CUSTOMER", label: "Customer" }];

export default function RegistrationForm() {
  const [user, setUser] = useState(defaultUserState);

  const [invitationCode, setInvitationCode] = useState("");
  const [message, setMessage] = useState(""); // General success message
  const [error, setError] = useState(""); // General error message (e.g., backend error)

  const [passwordError, setPasswordError] = useState("");
  const [invitationCodeError, setInvitationCodeError] = useState("");

  const [availableRoles, setAvailableRoles] = useState(defaultAvailableRoles);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showMatchingPassword, setShowMatchingPassword] = useState(false);

  // Debounce invitation code validation
  useEffect(() => {
    const validateCode = async () => {
      // Clear previous code-specific feedback
      setInvitationCodeError("");
      // Don't clear general error/message here, as they relate to submission

      const trimmedCode = invitationCode.trim();

      if (!trimmedCode) {
        // If code is empty, reset to default customer-only state
        setUser(prev => ({ ...prev, roles: ["ROLE_CUSTOMER"] }));
        setAvailableRoles(defaultAvailableRoles);
        return; // Stop here if no code
      }

      setIsValidatingCode(true); // Indicate validation is starting

      try {
        console.log("Sending validation request for code:", trimmedCode);

        const response = await axios.get(
          `http://localhost:8080/api/invitation-codes/validate/${encodeURIComponent(trimmedCode)}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log("Validation response:", response.data);

        if (response.data.valid) {
          const role = response.data.role;
          // If valid, set the role from the response and make it available
          setUser(prev => ({ ...prev, roles: [role] }));
          // Add the specific role to available roles if it's not customer
          if (role !== "ROLE_CUSTOMER") {
             setAvailableRoles([
               { value: "ROLE_CUSTOMER", label: "Customer" },
               { value: role, label: role.replace("ROLE_", "").replace(/_/g, ' ') } // Format label nicely
             ]);
             // Optionally, you could automatically select the special role if the code is valid
             setUser(prev => ({ ...prev, roles: [role] }));
          } else {
             // If code is valid but grants only ROLE_CUSTOMER (unlikely use case but good to handle)
             setAvailableRoles(defaultAvailableRoles);
             setUser(prev => ({ ...prev, roles: ["ROLE_CUSTOMER"] }));
          }
          // Clear any previous invitation code error
          setInvitationCodeError("");

        } else {
          // If invalid, set specific error and reset to default customer-only state
          setInvitationCodeError(response.data.message || "Invalid invitation code"); // Use backend message if available
          setUser(prev => ({ ...prev, roles: ["ROLE_CUSTOMER"] }));
          setAvailableRoles(defaultAvailableRoles);
        }
      } catch (error) {
        console.error("Validation error:", error);
        // On API error, set specific error and reset state
        setInvitationCodeError("Error validating code. Please try again.");
        setUser(prev => ({ ...prev, roles: ["ROLE_CUSTOMER"] }));
        setAvailableRoles(defaultAvailableRoles);
      } finally {
        setIsValidatingCode(false); // Indicate validation is finished
      }
    };

    // Apply debounce
    const timer = setTimeout(() => {
      validateCode();
    }, 400); // Slightly reduced debounce for faster feedback

    // Cleanup function to clear timeout
    return () => clearTimeout(timer);

  }, [invitationCode]); // Dependency array: re-run effect only when invitationCode changes

  const handleChange = (e) => {
    // Clear general messages/errors when user starts typing again
    setMessage("");
    setError("");
    // Clear password error if typing in password fields
    if (e.target.name === 'password' || e.target.name === 'matchingPassword') {
        setPasswordError("");
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // const handleRoleChange = (value) => {
  //    // Ensure the selected role is one of the available roles
  //    if (availableRoles.some(role => role.value === value)) {
  //        setUser({ ...user, roles: [value] });
  //    } else {
  //        // Fallback to customer if somehow an invalid role is selected
  //        setUser({ ...user, roles: ["ROLE_CUSTOMER"] });
  //    }
  // };

  const handleRoleChange = (value) => {
    // Ensure the selected role is one of the available roles before setting
    // This check is mostly for robustness, the UI prevents selecting unavailable roles
    const isValidSelection = availableRoles.some(role => role.value === value);

    if (!isValidSelection) {
        console.warn("Attempted to select an invalid role:", value);
        // Fallback to customer if selection is somehow invalid
        setUser(prev => ({ ...prev, roles: ["ROLE_CUSTOMER"] }));
        return;
    }

    let newRoles;
    if (value === "ROLE_CUSTOMER") {
      // If 'Customer' is selected, the roles array is just ["ROLE_CUSTOMER"]
      newRoles = ["ROLE_CUSTOMER"];
    } else {
      // If a different role (like "ROLE_EMPLOYEE", "ROLE_ADMIN") is selected,
      // the roles array should include both "ROLE_CUSTOMER" and the selected role
      newRoles = ["ROLE_CUSTOMER", value];
    }

    // Update the user state with the new roles array
    setUser(prev => ({ ...prev, roles: newRoles }));

    console.log("Role changed to:", value, " - User roles state set to:", newRoles); // Optional debug log
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setPasswordError(""); // Clear previous password error on submit attempt
    setInvitationCodeError(""); // Clear previous code error on submit attempt

    if (user.password !== user.matchingPassword) {
      setPasswordError("Passwords do not match.");
      return; // Stop submission
    }

    // Basic validation before sending
    if (!user.username || !user.email || !user.password || !user.matchingPassword) {
        setError("Please fill in all required fields.");
        return; // Stop submission
    }

    // Ensure code validation is not in progress
    if (isValidatingCode) {
        setError("Please wait while the invitation code is being validated.");
        return; // Stop submission
    }

    setIsSubmitting(true); // Indicate submission is starting

    try {
      // Construct the payload - only include necessary fields for registration
      const registrationPayload = {
        username: user.username,
        email: user.email,
        password: user.password,
        matchingPassword: user.matchingPassword,
        // profilePicture, status, enabled are likely backend concerns or defaults
        // roles should be sent based on the current user.roles state (determined by code validation or default)
        roles: user.roles,
        // Only include invitationCode if it's not empty/null - backend might need it for final validation
        invitationCode: invitationCode.trim() !== "" ? invitationCode.trim() : null
      };

      console.log("Submitting registration payload:", registrationPayload);

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        registrationPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Assuming backend returns a success message string or object with message
      setMessage(response.data.message || "Registration successful! Please log in.");
      // Optionally clear form or redirect on success
      // setUser(defaultUserState); // Reset form fields
      // setInvitationCode("");
      // setAvailableRoles(defaultAvailableRoles);

    } catch (err) {
      console.error("Registration error:", err);
      // Display error message from backend if available, otherwise a default
      // Prioritize specific errors if they match backend structure, otherwise use general
      const backendError = err.response?.data;

      if (backendError?.message) {
           // Check if backend returns specific field errors
           if (backendError.message.includes("Username already exists")) {
               // Or handle other known specific errors from backend
               setError(backendError.message);
           } else if (backendError.message.includes("Email already exists")) {
               setError(backendError.message);
           }
           // ... handle other specific backend validation errors
           else {
             setError(backendError.message); // Use general backend error message
           }
      } else {
           setError("Registration failed. Please try again."); // Generic fallback
      }

    } finally {
      setIsSubmitting(false); // Indicate submission is finished
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-white/90 dark:bg-black/90 text-black dark:text-white transition-colors duration-300">
      <FloatingIconsBackground />

      <GlassCard className="w-full max-w-md backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        <CardHeader className="pb-4"> {/* Adjust padding */}
          <CardTitle className="text-center text-2xl">Create Account</CardTitle> {/* Friendlier title */}
        </CardHeader>

        <CardContent>
          {/* General Alerts (for non-field-specific errors like backend issues) */}
          {message && (
            <Alert variant="success" className="mb-4 bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username" // Link label and input
                autoComplete="off"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
                className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus-visible:ring-purple-500 focus-visible:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" // Link label and input
                autoComplete="off"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus-visible:ring-purple-500 focus-visible:border-purple-500"
              />
            </div>

            {/* Password Fields with Toggle */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative"> {/* Wrapper for relative positioning */}
                <Input
                  id="password" // Link label and input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  
                  value={user.password}
                  onChange={handleChange}
                  required
                  className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 pr-10 focus-visible:ring-purple-500 focus-visible:border-purple-500" // Add right padding for icon
                />
                <Button
                  type="button" // Important: type="button" to prevent form submission
                  variant="ghost" // Use ghost variant for minimal styling
                  size="sm"
                  className="absolute inset-y-0 right-0 flex items-center px-3 dark:text-white/70 text-black/70 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility label
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="matchingPassword">Confirm Password</Label>
               <div className="relative">
                 <Input
                   id="matchingPassword" // Link label and input
                   type={showMatchingPassword ? "text" : "password"}
                   name="matchingPassword"
                   value={user.matchingPassword}
                   onChange={handleChange}
                   required
                   className={`bg-white/10 dark:bg-black/20 border text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 pr-10 focus-visible:ring-purple-500 focus-visible:border-purple-500 ${passwordError ? 'border-red-500' : 'border-white/20 dark:border-black/20'}`} // Add error border
                 />
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   className="absolute inset-y-0 right-0 flex items-center px-3 dark:text-white/70 text-black/70 hover:bg-transparent dark:hover:bg-transparent"
                   onClick={() => setShowMatchingPassword(!showMatchingPassword)}
                   aria-label={showMatchingPassword ? "Hide password" : "Show password"}
                 >
                   {showMatchingPassword ? (
                     <EyeOff className="h-4 w-4" />
                   ) : (
                     <Eye className="h-4 w-4" />
                   )}
                 </Button>
               </div>
               {passwordError && (
                 <p className="text-sm text-red-500 mt-1">{passwordError}</p>
               )}
            </div>


            {/* Invitation Code Section */}
            <div className="space-y-2">
               <Label htmlFor="invitationCode">Invitation Code (Optional)</Label>
               <div className="relative"> {/* Wrapper for loading indicator */}
                 <Input
                   id="invitationCode" // Link label and input
                   type="text"
                   name="invitationCode"
                   placeholder="Enter code if you have one"
                   value={invitationCode}
                   onChange={(e) => setInvitationCode(e.target.value)}
                   className={`bg-white/10 dark:bg-black/20 border text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus-visible:ring-purple-500 focus-visible:border-purple-500 ${invitationCodeError ? 'border-red-500' : 'border-white/20 dark:border-black/20'} ${isValidatingCode ? 'pr-10' : ''}`} // Add right padding if loading
                 />
                 {isValidatingCode && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" />
                 )}
               </div>
               {invitationCodeError && (
                  <p className="text-sm text-red-500 mt-1">{invitationCodeError}</p>
               )}
               {/* Optional: Success message for valid code? Or just showing the dropdown is enough. Let's rely on the dropdown appearing. */}
            </div>


            {/* Role Selection - Only show if more than just "Customer" is an option */}
            {availableRoles.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="role-select">Account Type</Label>
                <Select
                  value={user.roles[0]} // Select expects a single value string
                  onValueChange={handleRoleChange}
                  name="role"
                >
                  <SelectTrigger id="role-select" className="bg-white/10 dark:bg-black/20 border border-white/20 text-black dark:text-white focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 dark:bg-black/90 border border-white/20 backdrop-blur-md">
                    {availableRoles.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="hover:bg-purple-400/20 dark:hover:bg-purple-500/20 cursor-pointer"
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
             {/* Display the selected role if only one option is available (implicitly Customer) */}
             {availableRoles.length === 1 && (
                 <div className="space-y-2">
                     <p className="text-sm font-medium text-black dark:text-white">Account Type</p>
                     <p className="text-base text-black/70 dark:text-white/70">{availableRoles[0].label}</p>
                 </div>
             )}


            <div className="flex w-full gap-4 mt-6"> {/* Add some top margin */}
              <Button
                type="submit"
                className="flex-1 bg-black/90 dark:bg-white/90 backdrop-blur-md border border-white/30 text-white dark:text-black uppercase tracking-wide hover:bg-purple-400/70 hover:text-black dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isValidatingCode} // Disable if submitting or code is validating
              >
                {isSubmitting ? (
                    <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Registering...
                    </>
                ) : (
                    'Register'
                )}
              </Button>

              <Button
                type="button"
                onClick={() => window.location.href = '/login'} // Or use react-router-dom useNavigate
                className="flex-1 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 text-black dark:text-white uppercase tracking-wide hover:bg-purple-400/70 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-200"
                variant="outline" // Use outline variant if available/desired
              >
                Login instead
              </Button>
            </div>
          </form>
        </CardContent>
      </GlassCard>
    </div>
  );
}