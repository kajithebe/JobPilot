/**
 * LANDING PAGE
 * This is a static marketing page — NO API calls are made here.
 *
 * Navigation:
 *   "Log in"  button → /login
 *   "Sign up" button → /register
 *   CTA button       → /register
 *
 * BACKEND: No endpoints needed for this page.
 */

import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans flex flex-col relative overflow-hidden">
      {/* Background glows — radial-gradient not expressible in Tailwind v3 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -top-36 -left-24"
        style={{ background: 'radial-gradient(circle, rgba(56,130,246,0.13) 0%, transparent 70%)' }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -bottom-24 -right-20"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }}
      />

      {/* Nav — no auth state needed, public page */}
      <nav className="flex items-center justify-between px-12 py-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3882f6] to-[#8b5cf6]">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">JobPilot</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Navigates to /login — handled by React Router, no API call */}
          <button
            onClick={() => navigate('/login')}
            className="bg-transparent border border-white/15 text-white/75 px-5 py-2 rounded-lg text-sm font-medium cursor-pointer hover:border-white/35 hover:text-white transition-colors"
          >
            Log in
          </button>
          {/* Navigates to /register — handled by React Router, no API call */}
          <button
            onClick={() => navigate('/register')}
            className="border-none text-white px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity bg-gradient-to-br from-[#3882f6] to-[#6366f1]"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="flex-1 flex items-center justify-between px-12 pb-12 gap-12 relative z-10">
        {/* Left — copy and CTA */}
        <div className="flex-1 max-w-[520px]">
          <div className="inline-flex items-center gap-1.5 bg-[#3882f6]/[0.12] border border-[#3882f6]/30 rounded-full px-3.5 py-1.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3882f6] animate-pulse" />
            <span className="text-xs font-medium text-[#7eb3fa] tracking-wide">
              Resume Builder + Job Tracker
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-5">
            Navigate your
            <br />
            career with
            <br />
            {/* Gradient text — -webkit-background-clip not expressible in Tailwind v3 */}
            <span
              style={{
                background: 'linear-gradient(90deg, #3882f6, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              precision.
            </span>
          </h1>

          <p className="text-base text-white/50 leading-relaxed mb-10 max-w-[400px]">
            Build standout resumes, track every application, and land your next job — all in one
            cockpit.
          </p>

          {/* CTA — takes user to /register, same as Sign up button */}
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2.5 border-none text-white px-7 py-3.5 rounded-xl text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity bg-gradient-to-br from-[#3882f6] to-[#6366f1] shadow-[0_4px_24px_rgba(56,130,246,0.3)]"
          >
            Start flying toward your next job
            <span className="text-base">→</span>
          </button>
        </div>

        {/* Right — decorative floating resume cards (static, no data from API) */}
        <div className="flex-1 max-w-[480px] relative h-[420px]">
          {/* Left card */}
          <div
            className="absolute w-[200px] bg-[#0f1729] border border-white/[0.08] rounded-2xl p-5 shadow-2xl opacity-55"
            style={{
              left: 0,
              top: '60px',
              transform: 'rotate(-6deg)',
              animation: 'floatLeft 4s ease-in-out infinite 0.8s',
              zIndex: 2,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-[#10b981] to-[#3882f6]" />
              <div>
                <div className="text-[11px] font-semibold text-white/90">Sarah K.</div>
                <div className="text-[11px] text-white/40 mt-0.5">Product Designer</div>
              </div>
            </div>
            <div className="text-[9px] font-semibold tracking-widest text-[#3882f6] uppercase mb-1.5">
              Experience
            </div>
            <div className="mb-2">
              <div className="text-[11px] font-medium text-white/80">Senior Designer</div>
              <div className="text-[10px] text-white/35 mt-0.5">Figma · 2022–Present</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-white/80">UX Lead</div>
              <div className="text-[10px] text-white/35 mt-0.5">Notion · 2019–2022</div>
            </div>
          </div>

          {/* Main card */}
          <div
            className="absolute w-[260px] bg-[#0f1729] border border-white/[0.08] rounded-2xl p-5 shadow-2xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'floatMain 4s ease-in-out infinite',
              zIndex: 3,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-[#3882f6] to-[#8b5cf6]" />
              <div>
                <div className="text-[13px] font-semibold text-white/90">Alex Johnson</div>
                <div className="text-[11px] text-white/40 mt-0.5">Full Stack Engineer</div>
              </div>
            </div>
            <div className="h-px bg-white/[0.07] my-3" />
            <div className="text-[9px] font-semibold tracking-widest text-[#3882f6] uppercase mb-1.5">
              Skills
            </div>
            {[
              ['React', '92%'],
              ['Node.js', '85%'],
              ['PostgreSQL', '78%'],
            ].map(([label, width]) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <div className="text-[10px] text-white/50 w-12 flex-shrink-0">{label}</div>
                <div className="flex-1 h-1 bg-white/[0.07] rounded-full overflow-hidden">
                  {/* Static skill bars — hardcoded for demo, not from API */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3882f6] to-[#8b5cf6]"
                    style={{ width }}
                  />
                </div>
              </div>
            ))}
            <div className="h-px bg-white/[0.07] my-3" />
            <div className="text-[9px] font-semibold tracking-widest text-[#3882f6] uppercase mb-1.5">
              Tags
            </div>
            <div className="flex flex-wrap gap-1">
              {['TypeScript', 'REST API', 'Docker', 'AWS'].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-medium text-[#7eb3fa] bg-[#3882f6]/15 border border-[#3882f6]/25 rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* ATS score badge — hardcoded for demo display only */}
            <div className="absolute -bottom-4 right-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 z-10 bg-gradient-to-br from-[#10b981] to-[#059669] shadow-[0_4px_16px_rgba(16,185,129,0.4)]">
              <div className="text-sm font-bold text-white">92%</div>
              <div className="text-[10px] text-white/80 leading-tight">
                ATS
                <br />
                Score
              </div>
            </div>
          </div>

          {/* Right card */}
          <div
            className="absolute w-[190px] bg-[#0f1729] border border-white/[0.08] rounded-2xl p-5 shadow-2xl opacity-45"
            style={{
              right: 0,
              top: '80px',
              transform: 'rotate(6deg)',
              animation: 'floatRight 4s ease-in-out infinite 1.6s',
              zIndex: 1,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-[#f59e0b] to-[#ef4444]" />
              <div>
                <div className="text-[11px] font-semibold text-white/90">Mia Chen</div>
                <div className="text-[11px] text-white/40 mt-0.5">Data Analyst</div>
              </div>
            </div>
            <div className="text-[9px] font-semibold tracking-widest text-[#3882f6] uppercase mb-1.5">
              Education
            </div>
            <div className="mb-2">
              <div className="text-[10px] font-medium text-white/80">MSc Data Science</div>
              <div className="text-[10px] text-white/35 mt-0.5">MIT · 2021</div>
            </div>
            <div className="text-[9px] font-semibold tracking-widest text-[#3882f6] uppercase mb-1.5 mt-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {['Python', 'SQL', 'Tableau'].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-medium text-[#7eb3fa] bg-[#3882f6]/15 border border-[#3882f6]/25 rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ATS floating badge — hardcoded for demo display only, not from API */}
          <div
            className="absolute bg-[#13203a] border border-[#3882f6]/30 rounded-xl p-2.5 z-10"
            style={{
              top: '20px',
              left: '-20px',
              animation: 'floatRight 5s ease-in-out infinite 0.5s',
            }}
          >
            <div className="text-[10px] text-white/45 mb-1">ATS Match Score</div>
            <div className="flex items-center gap-1.5">
              <div className="text-lg font-bold text-[#3882f6]">92%</div>
              <div className="text-[10px] text-white/50">Strong match</div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pb-7 text-xs text-white/20 relative z-10">
        © 2025 JobPilot — College Project
      </div>

      {/* Card float animations — CSS only, no JS */}
      <style>{`
        @keyframes floatMain {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-14px); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50% { transform: rotate(-6deg) translateY(-10px); }
        }
        @keyframes floatRight {
          0%, 100% { transform: rotate(6deg) translateY(0px); }
          50% { transform: rotate(6deg) translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
