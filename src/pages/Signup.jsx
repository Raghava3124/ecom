import { useState } from "react";
import axios from "axios";
import "./Signup.css"; // Import external CSS
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [disableOtpButton, setDisableOtpButton] = useState(false);

    // Password validation function
    const validatePassword = (password) => {
        let errors = [];
        if (password.length < 8) errors.push("❌ At least 8 characters");
        if (!/[a-z]/.test(password)) errors.push("❌ One lowercase letter");
        if (!/[A-Z]/.test(password)) errors.push("❌ One uppercase letter");
        if (!/\d/.test(password)) errors.push("❌ One number");
        if (!/[!@#$%^&*]/.test(password)) errors.push("❌ One special character (!@#$%^&*)");
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            setPasswordErrors(validatePassword(value));
        }
        if (name === "confirmPassword") {
            setConfirmPasswordError(value !== formData.password ? "❌ Passwords do not match" : "");
        }
    };

    // Send OTP function with debounce to prevent spam clicking
    const sendOTP = async () => {
        if (!formData.email.includes("@")) {
            setOtpMessage("❌ Enter a valid email.");
            return;
        }

        setDisableOtpButton(true); // Disable button to prevent multiple clicks
        setOtpMessage("⏳ Sending OTP...");

        try {
            const response = await axios.post("http://150.230.134.36:5000/send-otp", { email: formData.email });
            //const response = await axios.post("https://ecom-production-ca19.up.railway.app/send-otp", { email: formData.email });

            if (response.data.message) {
                setIsOtpSent(true);
                setOtpMessage("✅ OTP sent successfully! Please check your email. If you don’t see it, make sure to check your spam or junk folder.");
            } else {
                setOtpMessage("❌ Failed to send OTP. Try again.");
            }
        } catch (error) {
            setOtpMessage("❌ Server error. Please try again.");
        } finally {
            setTimeout(() => setDisableOtpButton(false), 3000); // Enable button after 3 seconds
        }
    };

    // Verify OTP function
    const verifyOTP = async () => {
        if (!otp.trim()) {
            setOtpMessage("❌ Enter the OTP.");
            return;
        }

        setOtpMessage("⏳ Verifying OTP...");

        try {
             const response = await axios.post("http://150.230.134.36:5000/verify-otp", { email: formData.email, otp });
            //const response = await axios.post("https://ecom-production-ca19.up.railway.app/verify-otp", { email: formData.email, otp });

            if (response.data.message === "OTP Verified Successfully!") {
                setIsEmailVerified(true);
                setOtpMessage("✅ Email verified successfully!");
            } else {
                setOtpMessage("❌ Invalid OTP. Try again.");
            }
        } catch (error) {
            setOtpMessage("❌ Verification failed. Try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!isEmailVerified) {
            setMessage("❌ Verify your email before signing up.");
            setLoading(false);
            return;
        }

        const passwordValidationErrors = validatePassword(formData.password);
        if (passwordValidationErrors.length > 0) {
            setMessage("❌ Password does not meet security requirements.");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://150.230.134.36:5000/api/auth/signup", {
            //const response = await fetch("https://ecom-production-ca19.up.railway.app/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Signup Successful! You can login now.");
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                setPasswordErrors([]);
                setConfirmPasswordError("");
                setIsEmailVerified(false);
                setIsOtpSent(false);
                setOtp("");

                setTimeout(() => {
                    navigate("/login");
                }, 3000); // Redirect to login after 3 seconds
            } else {
                setMessage(`❌ ${data.message || "Signup failed. Try again."}`);
            }
        } catch (error) {
            setMessage("❌ Server Error: Unable to reach backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Create an Account</h2>
                <p className="subtitle">Join us and explore amazing features</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isEmailVerified}
                        />
                        {!isOtpSent && (
                            <button type="button" onClick={sendOTP} className="otp-btn" disabled={disableOtpButton}>
                                {disableOtpButton ? "Sending..." : "Send OTP"}
                            </button>
                        )}
                    </div>

                    {isOtpSent && !isEmailVerified && (
                        <div className="input-box">
                            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button type="button" onClick={verifyOTP} className="otp-btn">Verify OTP</button>
                        </div>
                    )}
                    {otpMessage && <p className={`message ${otpMessage.includes("✅") ? "success" : "error"}`}>{otpMessage}</p>}

                    <div className="input-box">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        {passwordErrors.length > 0 && (
                            <ul className="password-errors">
                                {passwordErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="input-box">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        {confirmPasswordError && <p className="password-errors">{confirmPasswordError}</p>}
                    </div>
                    <button type="submit" disabled={loading || !isEmailVerified}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default Signup;
