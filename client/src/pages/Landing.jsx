import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.root}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ fill: 'white' }}>
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" />
            </svg>
          </div>
          <span style={styles.logoText}>JobPilot</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.btnGhost} onClick={() => navigate('/login')}>
            Log in
          </button>
          <button style={styles.btnPrimary} onClick={() => navigate('/register')}>
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        {/* Left */}
        <div style={styles.heroLeft}>
          <div style={styles.badge}>
            <div style={styles.badgeDot} />
            <span style={styles.badgeText}>Resume Builder + Job Tracker</span>
          </div>

          <h1 style={styles.heroTitle}>
            Navigate your
            <br />
            career with
            <br />
            <span style={styles.heroAccent}>precision.</span>
          </h1>

          <p style={styles.heroSub}>
            Build standout resumes, track every application, and land your next job — all in one
            cockpit.
          </p>

          <button style={styles.btnCta} onClick={() => navigate('/register')}>
            Start flying toward your next job
            <span style={styles.arrow}>→</span>
          </button>
        </div>

        {/* Right — floating cards */}
        <div style={styles.heroRight}>
          <div style={styles.cardScene}>
            {/* Left card */}
            <div style={{ ...styles.resumeCard, ...styles.cardLeft }}>
              <div style={styles.cardHeader}>
                <div
                  style={{
                    ...styles.avatar,
                    background: 'linear-gradient(135deg, #10b981, #3882f6)',
                    width: '28px',
                    height: '28px',
                  }}
                />
                <div>
                  <div style={{ ...styles.cardName, fontSize: '11px' }}>Sarah K.</div>
                  <div style={styles.cardRole}>Product Designer</div>
                </div>
              </div>
              <div style={styles.sectionLabel}>Experience</div>
              <div style={styles.expRow}>
                <div style={styles.expTitle}>Senior Designer</div>
                <div style={styles.expCompany}>Figma · 2022–Present</div>
              </div>
              <div style={styles.expRow}>
                <div style={styles.expTitle}>UX Lead</div>
                <div style={styles.expCompany}>Notion · 2019–2022</div>
              </div>
            </div>

            {/* Main card */}
            <div style={{ ...styles.resumeCard, ...styles.cardMain }}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar} />
                <div>
                  <div style={styles.cardName}>Alex Johnson</div>
                  <div style={styles.cardRole}>Full Stack Engineer</div>
                </div>
              </div>
              <div style={styles.divider} />
              <div style={styles.sectionLabel}>Skills</div>
              {[
                ['React', '92%'],
                ['Node.js', '85%'],
                ['PostgreSQL', '78%'],
              ].map(([label, width]) => (
                <div key={label} style={styles.barRow}>
                  <div style={styles.barLabel}>{label}</div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width }} />
                  </div>
                </div>
              ))}
              <div style={styles.divider} />
              <div style={styles.sectionLabel}>Tags</div>
              <div>
                {['TypeScript', 'REST API', 'Docker', 'AWS'].map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {/* ATS score badge */}
              <div style={styles.scoreBadge}>
                <div style={styles.scoreNum}>92%</div>
                <div style={styles.scoreLbl}>
                  ATS
                  <br />
                  Score
                </div>
              </div>
            </div>

            {/* Right card */}
            <div style={{ ...styles.resumeCard, ...styles.cardRight }}>
              <div style={styles.cardHeader}>
                <div
                  style={{
                    ...styles.avatar,
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    width: '28px',
                    height: '28px',
                  }}
                />
                <div>
                  <div style={{ ...styles.cardName, fontSize: '11px' }}>Mia Chen</div>
                  <div style={styles.cardRole}>Data Analyst</div>
                </div>
              </div>
              <div style={styles.sectionLabel}>Education</div>
              <div style={styles.expRow}>
                <div style={{ ...styles.expTitle, fontSize: '10px' }}>MSc Data Science</div>
                <div style={styles.expCompany}>MIT · 2021</div>
              </div>
              <div style={{ ...styles.sectionLabel, marginTop: '8px' }}>Skills</div>
              <div>
                {['Python', 'SQL', 'Tableau'].map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ATS badge */}
            <div style={styles.atsBadge}>
              <div style={styles.atsLabel}>ATS Match Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={styles.atsPct}>92%</div>
                <div style={styles.atsTag}>Strong match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={styles.footerNote}>© 2025 JobPilot — College Project</div>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes float-main {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-14px); }
        }
        @keyframes float-left {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50% { transform: rotate(-6deg) translateY(-10px); }
        }
        @keyframes float-right {
          0%, 100% { transform: rotate(6deg) translateY(0px); }
          50% { transform: rotate(6deg) translateY(-8px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .card-main-anim {
          animation: float-main 4s ease-in-out infinite;
        }
        .card-left-anim {
          animation: float-left 4s ease-in-out infinite 0.8s;
        }
        .card-right-anim {
          animation: float-right 4s ease-in-out infinite 1.6s;
        }
        .badge-dot-anim {
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Inter', sans-serif",
    background: '#080d1a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,130,246,0.13) 0%, transparent 70%)',
    top: '-150px',
    left: '-100px',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
    bottom: '-100px',
    right: '-80px',
    pointerEvents: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 48px',
    position: 'relative',
    zIndex: 10,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #3882f6, #8b5cf6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.3px',
  },
  navActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  btnGhost: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.75)',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3882f6, #6366f1)',
    border: 'none',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px 48px',
    gap: '48px',
    position: 'relative',
    zIndex: 5,
  },
  heroLeft: { flex: 1, maxWidth: '520px' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(56,130,246,0.12)',
    border: '1px solid rgba(56,130,246,0.3)',
    borderRadius: '99px',
    padding: '5px 14px',
    marginBottom: '28px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3882f6',
    // animation applied via className
  },
  badgeText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#7eb3fa',
    letterSpacing: '0.3px',
  },
  heroTitle: {
    fontSize: 'clamp(38px, 5vw, 58px)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: '20px',
  },
  heroAccent: {
    background: 'linear-gradient(90deg, #3882f6, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSub: {
    fontSize: '16px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
    marginBottom: '40px',
    maxWidth: '400px',
  },
  btnCta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, #3882f6, #6366f1)',
    border: 'none',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 24px rgba(56,130,246,0.3)',
  },
  arrow: { fontSize: '16px' },
  heroRight: {
    flex: 1,
    maxWidth: '480px',
    position: 'relative',
    height: '420px',
  },
  cardScene: { position: 'relative', width: '100%', height: '100%' },
  resumeCard: {
    position: 'absolute',
    background: '#0f1729',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  cardMain: {
    width: '260px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
    animation: 'float-main 4s ease-in-out infinite',
  },
  cardLeft: {
    width: '200px',
    left: 0,
    top: '60px',
    opacity: 0.55,
    transform: 'rotate(-6deg)',
    zIndex: 2,
    animation: 'float-left 4s ease-in-out infinite 0.8s',
  },
  cardRight: {
    width: '190px',
    right: 0,
    top: '80px',
    opacity: 0.45,
    transform: 'rotate(6deg)',
    zIndex: 1,
    animation: 'float-right 4s ease-in-out infinite 1.6s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3882f6, #8b5cf6)',
    flexShrink: 0,
  },
  cardName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
  },
  cardRole: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '1px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '12px 0',
  },
  sectionLabel: {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '1px',
    color: '#3882f6',
    textTransform: 'uppercase',
    marginBottom: '7px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  barLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    width: '48px',
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: '4px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #3882f6, #8b5cf6)',
  },
  expRow: { marginBottom: '8px' },
  expTitle: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  expCompany: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '1px',
  },
  tag: {
    display: 'inline-block',
    background: 'rgba(56,130,246,0.15)',
    border: '1px solid rgba(56,130,246,0.25)',
    color: '#7eb3fa',
    fontSize: '9px',
    fontWeight: 500,
    borderRadius: '4px',
    padding: '2px 7px',
    margin: '2px 2px 0 0',
  },
  scoreBadge: {
    position: 'absolute',
    bottom: '-16px',
    right: '8px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    borderRadius: '8px',
    padding: '7px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
    zIndex: 10,
  },
  scoreNum: { fontSize: '14px', fontWeight: 700, color: '#fff' },
  scoreLbl: { fontSize: '10px', color: 'rgba(255,255,255,0.8)' },
  atsBadge: {
    position: 'absolute',
    top: '20px',
    left: '-20px',
    background: '#13203a',
    border: '1px solid rgba(56,130,246,0.3)',
    borderRadius: '10px',
    padding: '10px 14px',
    zIndex: 10,
    animation: 'float-right 5s ease-in-out infinite 0.5s',
  },
  atsLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '5px',
  },
  atsPct: { fontSize: '18px', fontWeight: 700, color: '#3882f6' },
  atsTag: { fontSize: '10px', color: 'rgba(255,255,255,0.5)' },
  footerNote: {
    textAlign: 'center',
    padding: '0 48px 28px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.2)',
    position: 'relative',
    zIndex: 5,
  },
};
