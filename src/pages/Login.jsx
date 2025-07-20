import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 import useNavigate
import "./Login.css";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate(); // 👈 initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                //const response = await fetch("https://ecom-production-ca19.up.railway.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("🔹 Server Response:", data);

            if (response.ok) {
                localStorage.setItem("token", data.token);

                let userId = null;

                // ✅ Try to get userId from response, or decode from token
                if (data.user && data.user.id) {
                    userId = data.user.id;
                } else {
                    try {
                        const base64Url = data.token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        );
                        const payload = JSON.parse(jsonPayload);
                        userId = payload.id;
                    } catch (err) {
                        console.error("❌ Failed to decode JWT:", err);
                    }
                }

                if (userId) {
                    localStorage.setItem("userId", userId);
                    onLogin(userId);
                }

                setMessage("✅ Login successful");


                // 👇 instantly redirect to dashboard
                //navigate("/dashboard");
                // window.location.href = "/dashboard"; // 🔄 force reload to ensure new token is used
                navigate("/dashboard");
                // window.location.reload(); // Ensures fresh load with token


            } else {
                setMessage(`❌ ${data.message || "Login failed (Unknown reason)"}`);
            }
        } catch (error) {
            console.error("🔥 Error connecting to server:", error);
            setMessage("❌ Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome Back 👋</h2>
                <p className="subtitle">Log in to continue exploring</p>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {message && (
                    <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
                <div className="redirect-link">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
