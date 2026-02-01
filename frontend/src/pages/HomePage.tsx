import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Prepare for Interviews <span>the Smart Way</span>
          </h1>
          <p>
            Practice realistic interviews, receive structured feedback, and
            track your improvement — all in one platform.
          </p>

          <button className="primary-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <h2>Why Interview Preparation Usually Fails</h2>

        <div className="grid-3">
          <div className="glass-card danger">
            <h3>No Real Pressure</h3>
            <p>Practicing alone doesn’t simulate interview stress.</p>
          </div>

          <div className="glass-card danger">
            <h3>Generic Feedback</h3>
            <p>“Improve communication” isn’t actionable.</p>
          </div>

          <div className="glass-card danger">
            <h3>No Progress Tracking</h3>
            <p>You never know if you’re actually improving.</p>
          </div>
        </div>

        <p className="section-note">
          Interviews are high-pressure — your preparation should reflect that.
        </p>
      </section>

      {/* FEATURES */}
      <section className="section subtle">
        <h2>What This Platform Helps You Do</h2>

        <div className="grid-2">
          <div className="glass-card">
            <h3>AI-Driven Questioning</h3>
            <p>Adaptive follow-ups based on your answers.</p>
          </div>

          <div className="glass-card">
            <h3>Detailed Analytics</h3>
            <p>Clarity, confidence, pacing, communication.</p>
          </div>

          <div className="glass-card">
            <h3>Recorded Interview Playback</h3>
            <p>Review answers and identify mistakes.</p>
          </div>

          <div className="glass-card">
            <h3>Structured Interview Report</h3>
            <p>Recruiter-style, shareable feedback.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <h2 className="section-title">
          Your Interview, Analyzed Like a Recruiter Would
        </h2>

        <div className="how-it-works">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-title">Choose Interview Type</div>
            <p className="step-desc">Technical • HR • Behavioral</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-title">Give the Interview</div>
            <p className="step-desc">Camera on. Real pressure.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-title">Get Smart Feedback</div>
            <p className="step-desc">Clarity, confidence, structure</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-title">Track Your Growth</div>
            <p className="step-desc">See improvement over time</p>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="section subtle">
        <h2>Who This Platform Is Built For</h2>

        <div className="grid-3">
          <div className="glass-card">
            <h3>College Students</h3>
            <p>Placements & internships.</p>
          </div>

          <div className="glass-card">
            <h3>Job Switchers</h3>
            <p>Practice without pressure.</p>
          </div>

          <div className="glass-card">
            <h3>First-Time Interviewees</h3>
            <p>Build confidence early.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <h2>Start Preparing Smarter Today</h2>
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        Built for serious interview preparation.
      </footer>
    </div>
  );
}
