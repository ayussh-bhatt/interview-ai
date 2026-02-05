import { useState } from "react";
import api from "../services/api";
import VideoRecorder from "../components/VideoRecorder";
import { uploadVideoToCloudinary } from "../services/cloudinary";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const navigate = useNavigate();

  /* ===== Setup ===== */
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [topics, setTopics] = useState("");
  const [description, setDescription] = useState("");

  /* ===== Interview ===== */
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ===== Answers ===== */
  const [answerMode, setAnswerMode] = useState("video");
  const [videoBlob, setVideoBlob] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");

  /* ===== UI ===== */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔥 Recorder lifecycle */
  const [showRecorder, setShowRecorder] = useState(true);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  /* =========================
     START INTERVIEW
  ========================= */
  const startInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/interview/start", {
        targetRole,
        experienceLevel,
        topics: topics
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        description,
      });

      setSessionId(res.data.sessionId);
      setQuestions(
        Array.from({ length: res.data.totalQuestions }, (_, i) =>
          i === 0 ? res.data.currentQuestion : null,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT & NEXT
  ========================= */
  const submitAndNext = async () => {
    try {
      setLoading(true);
      setError("");

      let res;

      if (answerMode === "video") {
        const uploadRes = await uploadVideoToCloudinary(videoBlob);
        res = await api.post("/response/video", {
          sessionId,
          questionId: currentQuestion.id,
          videoUrl: uploadRes.secure_url,
        });
      } else {
        res = await api.post("/response/text", {
          sessionId,
          questionId: currentQuestion.id,
          textAnswer,
        });
      }

      if (res.data.isInterviewComplete) {
        finishInterview();
        return;
      }

      setQuestions((prev) => {
        const copy = [...prev];
        copy[currentIndex + 1] = res.data.nextQuestion;
        return copy;
      });

      setCurrentIndex((i) => i + 1);
      setVideoBlob(null);
      setTextAnswer("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      FINISH INTERVIEW
    ========================= */
  const finishInterview = async () => {
    try {
      setLoading(true);

      // 🔥 Unmount recorder → camera & mic OFF
      setShowRecorder(false);

      await api.post("/interview/finish", { sessionId });

      navigate(`/interview/${sessionId}/review`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Processing..." />;

  return (
    <div className="interview-container">
      {!sessionId ? (
        <div className="interview-card">
          {/* =========================
                SETUP SCREEN
              ========================= */}
          <div className="interview-card">
            <h1 className="interview-title">Start a New Interview Journey</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <label className="interview-label">Target Role</label>
            <input
              className="interview-input"
              placeholder="(e.g. Frontend Developer, Backend Developer)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />

            <label className="interview-label">Experience Level</label>
            <select
              className="interview-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="" disabled>
                Choose an experience level
              </option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>

            <label className="interview-label">Topics</label>
            <input
              className="interview-input"
              placeholder="(Comma separated eg. React, Node.js, System Design)"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
            />

            <label className="interview-label">Description</label>
            <textarea
              className="interview-textarea"
              placeholder="(Any specific goals or notes for the session)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              className="interview-start-btn"
              onClick={startInterview}
              disabled={!targetRole || !experienceLevel || loading}
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </div>
      ) : (
        <div className="interview-card live-interview">
          <div className="live-header">
            <span className="live-progress">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="question-box">
            <h2>{currentQuestion?.content}</h2>
          </div>

          <div className="live-body">
            <div className="answer-panel">
              <div className="answer-toggle">
                <button
                  className={
                    answerMode === "video" ? "toggle active" : "toggle"
                  }
                  onClick={() => {
                    setAnswerMode("video");
                    setShowRecorder(true);
                  }}
                >
                  Video
                </button>
                <button
                  className={answerMode === "text" ? "toggle active" : "toggle"}
                  onClick={() => {
                    setAnswerMode("text");
                    setShowRecorder(false); // 🔥 stop camera
                  }}
                >
                  Text
                </button>
              </div>

              {answerMode === "video" && showRecorder ? (
                <VideoRecorder
                  key={currentIndex} // 🔥 force fresh recorder per question
                  onStop={setVideoBlob}
                />
              ) : (
                <textarea
                  className="interview-code-editor"
                  placeholder="// Write your answer here..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              )}
            </div>

            <div className="side-panel">
              <p className="side-title">Tips</p>
              <p className="side-text">
                Structure your answer clearly. Focus on concepts, trade-offs,
                and examples.
              </p>
            </div>
          </div>

          <div className="live-actions">
            {!isLastQuestion && (
              <button
                className="interview-start-btn"
                onClick={submitAndNext}
                disabled={answerMode === "video" ? !videoBlob : !textAnswer}
              >
                Submit & Next
              </button>
            )}

            <button
              className={`finish-btn ${isLastQuestion ? "primary-finish" : ""}`}
              onClick={finishInterview}
            >
              Finish Interview
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}
