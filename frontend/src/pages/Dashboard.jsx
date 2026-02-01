import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !user) return;

    const loadAnalytics = async () => {
      try {
        const res = await api.get("/analytics/dashboard");
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard analytics");
      }
    };

    loadAnalytics();
  }, [authLoading, user]);

  if (authLoading) return <Loader text="Authenticating..." />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!analytics) return <Loader text="Loading dashboard..." />;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your interview preparation progress
          </p>
        </div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Hero CTA */}
      <div className="dashboard-hero">
        <h2>Mock Interview</h2>
        <p>
          Simulate a real interview, answer on camera or text, and receive
          structured feedback.
        </p>
        <button
          onClick={() => navigate("/interview")}
          className="start-btn"
        >
          Start Interview
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Interviews</div>
          <div className="stat-value">{analytics.totalInterviews}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{analytics.averageScore}</div>
        </div>
      </div>

      {/* Past Interviews */}
      <div className="past-section">
        <h2 className="past-title">Past Interviews</h2>

        {analytics.pastInterviews.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <div className="empty-state">
            <h3>No interviews yet</h3>
            <p>
              You haven’t completed any mock interviews yet.
              Start one to see detailed reviews here.
            </p>
            <button
              className="start-btn"
              onClick={() => navigate("/interview")}
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          /* ===== INTERVIEW CARDS ===== */
          <div className="past-grid">
            {analytics.pastInterviews.map((interview) => (
              <div key={interview.id} className="past-card">
                <div className="past-card-header">
                  <h3 className="past-role">{interview.targetRole}</h3>
                  <span className="past-date">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="past-desc">
                  {interview.description || "No description provided"}
                </p>

                <div className="past-meta">
                  <span className="meta-chip">
                    {interview.experienceLevel}
                  </span>
                  <span className="meta-chip">
                    {interview.questionCount} Qs
                  </span>
                </div>

                <button
                  className="review-btn"
                  onClick={() =>
                    navigate(`/interview/${interview.id}/review`)
                  }
                >
                  View Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
