import { useState, useEffect } from "react";
import { signupWithEmail, loginWithGoogle } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupWithEmail(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
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
    <form onSubmit={handleSignup} className="auth-card">
      <h2 className="auth-title">Create Your Account</h2>
      <p className="auth-subtitle">
        Start preparing smarter for interviews
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

      <button className="auth-primary-btn">Create Account</button>

      <div className="auth-divider">or</div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="auth-secondary-btn"
      >
        Sign up with Google
      </button>

      <div className="auth-footer">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Log in</span>
      </div>
    </form>
  </div>
);

}