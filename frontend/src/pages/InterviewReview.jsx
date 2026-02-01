import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

export default function InterviewReview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReview = async () => {
      try {
        const res = await api.get(`/interview/${sessionId}/review`);
        setEvaluation(res.data.evaluation);
        setMeta(res.data.metadata);
      } catch (err) {
        console.error(err);
        setError("Failed to load interview review");
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [sessionId]);

  if (loading) return <Loader text="Generating interview review..." />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="review-container">
      <div className="review-card">
        {/* ================= HEADER ================= */}
        <header className="review-header">
          <h1>Interview Performance Report</h1>
          <p>
            {meta.targetRole} • {meta.experienceLevel} •{" "}
            {meta.questionCount} Questions
          </p>
        </header>

        {/* ================= OVERALL SCORE ================= */}
        <section className="review-score">
          <div className="score-circle">
            <span>{evaluation.overallScore}</span>
            <small>/100</small>
          </div>
          <p className="score-label">Overall Interview Score</p>
        </section>

        {/* ================= SKILL BREAKDOWN ================= */}
        <section className="review-section">
          <h2>Skill Breakdown</h2>
          <div className="review-metrics">
            <Metric label="Communication Skills" value={evaluation.skillBreakdown.communicationSkills} />
            <Metric label="Technical Knowledge" value={evaluation.skillBreakdown.technicalKnowledge} />
            <Metric label="Problem Solving" value={evaluation.skillBreakdown.problemSolving} />
            <Metric label="Confidence & Clarity" value={evaluation.skillBreakdown.confidenceAndClarity} />
            <Metric label="Cultural Fit" value={evaluation.skillBreakdown.culturalFit} />
          </div>
        </section>

        {/* ================= SUMMARY ================= */}
        <section className="review-section">
          <h2>Overall Summary</h2>
          <p>{evaluation.summary}</p>
        </section>

        {/* ================= QUESTION-WISE REVIEW ================= */}
        <section className="review-section">
          <h2>Question-wise Feedback</h2>

          <div className="question-review-list">
            {evaluation.questionWiseReview.map((q, idx) => (
              <div key={idx} className="question-review-card">
                <h3>Question {idx + 1}</h3>
                <p className="question-text">{q.question}</p>

                <div className="qa-block success">
                  <strong>What went well</strong>
                  <p>{q.whatWentWell}</p>
                </div>

                <div className="qa-block warning">
                  <strong>How to improve</strong>
                  <p>{q.howToImprove}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STRENGTHS ================= */}
        <section className="review-section">
          <h2>Strengths</h2>
          <ul className="bullet-list success">
            {evaluation.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        {/* ================= IMPROVEMENTS ================= */}
        <section className="review-section">
          <h2>Areas for Improvement</h2>
          <ul className="bullet-list warning">
            {evaluation.areasForImprovement.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>

        {/* ================= CTA ================= */}
        <footer className="review-actions">
          <button
            className="review-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
}

/* =========================
   METRIC CARD
========================= */
function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span className="metric-value">{value} / 10</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}
