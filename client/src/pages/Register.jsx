/**
 * REGISTER PAGE
 * ─────────────────────────────────────────────────────────────
 * BACKEND: POST /api/auth/register
 *
 * Expected request body:
 * {
 *   name: string,    ← first + last name joined: "Alex Johnson"
 *   email: string,
 *   password: string ← plain text, BACKEND must hash with bcrypt
 * }
 *
 * Expected success response (201):
 * {
 *   success: true,
 *   data: {
 *     token: string  ← JWT token, stored in localStorage as 'token'
 *   }
 * }
 *
 * Expected error response (400 or 409):
 * {
 *   success: false,
 *   error: string    ← shown to user in the red error box
 * }
 *
 * Common error cases to handle on backend:
 *   409 → email already registered (duplicate)
 *   400 → missing or invalid fields
 *
 * On success → user is redirected to /dashboard (auto logged in)
 * On failure → error message is displayed in the red box and as a toast
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../store/authContext';
import Toast from '../components/ui/Toast';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Password strength checker — frontend only, not sent to backend
  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthScore = getStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthTextColors = [
    '',
    'text-red-400',
    'text-yellow-400',
    'text-yellow-400',
    'text-emerald-400',
  ];
  const strengthBarColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-emerald-400'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation — runs before any API call
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      // First + last name are joined into a single 'name' field before sending
      // BACKEND: store this in users.name column (see schema.md)
      const fullName = `${firstName} ${lastName}`;

      // Calls POST /api/auth/register — see src/services/authService.js
      const data = await registerUser(fullName, email, password);

      // Saves JWT token to localStorage and updates global auth state
      // BACKEND: return token immediately after register (auto login)
      login(data.token);

      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (err) {
      // BACKEND: return { success: false, error: "message" } for all failures
      // 409 → "Email already in use" or similar
      // 400 → validation error
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glows — radial-gradient not expressible in Tailwind v3 */}
      <div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-0 -top-52 -left-36"
        style={{ background: 'radial-gradient(circle, rgba(56,130,246,0.11) 0%, transparent 70%)' }}
      />
      <div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -bottom-24 -right-24"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-12 py-6">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3882f6] to-[#8b5cf6]">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="white">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">JobPilot</span>
          </Link>
          <div className="flex items-center gap-1 text-sm text-white/50">
            Already have an account?
            <Link
              to="/login"
              className="text-[#3882f6] font-medium ml-1 no-underline hover:underline"
            >
              Log in
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[440px] bg-[#0f1729] border border-white/[0.08] rounded-2xl p-10 shadow-2xl">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Start your journey
            </h1>
            <div className="flex items-center gap-2 mb-8">
              <p className="text-sm text-white/50">Create your account</p>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-0.5">
                Free forever
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* First + last name — joined as 'name' before sending to API */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Johnson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06] transition-colors"
                  />
                </div>
              </div>

              {/* Email — must be unique in DB, BACKEND returns 409 if duplicate */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06] transition-colors"
                />
              </div>

              {/* Password — sent as plain text, BACKEND must hash with bcrypt before storing */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3 pr-11 text-sm text-white placeholder-white/25 outline-none focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/25 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="17"
                      height="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>

                {/* Strength bars — visual only, no effect on what gets sent to API */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-0.5 rounded-full transition-colors ${i <= strengthScore ? strengthBarColors[strengthScore] : 'bg-white/[0.07]'}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] ${strengthTextColors[strengthScore]}`}>
                      {strengthLabels[strengthScore]}
                    </span>
                  </div>
                )}
              </div>

              {/* Error box — displays error string from API response */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-3.5 py-2.5 text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#3882f6] to-[#6366f1] text-white font-semibold py-3.5 rounded-xl text-sm shadow-[0_4px_20px_rgba(56,130,246,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-none"
              >
                {loading ? 'Creating account...' : 'Create my JobPilot account →'}
              </button>
            </form>

            <p className="text-xs text-white/25 text-center mt-4 leading-relaxed">
              By signing up, you agree to our{' '}
              <a href="#" className="text-[#3882f6]/80 no-underline hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#3882f6]/80 no-underline hover:underline">
                Privacy Policy
              </a>
            </p>

            <p className="text-center mt-5 text-sm text-white/50">
              Already have an account?{' '}
              <Link to="/login" className="text-[#3882f6] font-medium no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>

        <footer className="text-center pb-6 text-xs text-white/25">
          © 2025 JobPilot — College Project
        </footer>
      </div>

      {/* Toast — appears bottom-right on failed auth */}
      <Toast message={error} />
    </div>
  );
}
