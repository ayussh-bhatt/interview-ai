import { useState, useEffect } from "react";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // 🔒 Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
  <div className="auth-container">
    <form onSubmit={handleLogin} className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">
        Log in to continue your interview preparation
      </p>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="email"
        placeholder="Email address"
        className="auth-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="auth-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="auth-primary-btn">Log In</button>

      <div className="auth-divider">or</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="auth-secondary-btn"
      >
        Continue with Google
      </button>

      <div className="auth-footer">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")}>Create one</span>
      </div>
    </form>
  </div>
);
}
