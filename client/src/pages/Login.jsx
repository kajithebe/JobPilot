import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../store/authContext';
import Toast from '../components/ui/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email, password);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glows — radial-gradient not expressible in Tailwind */}
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
            No account?
            <Link
              to="/register"
              className="text-[#3882f6] font-medium ml-1 no-underline hover:underline"
            >
              Sign up free →
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[420px] bg-[#0f1729] border border-white/[0.08] rounded-2xl p-10 shadow-2xl">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-white/50 mb-8">Sign in to your JobPilot cockpit</p>

            <form onSubmit={handleSubmit}>
              {/* Email field */}
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

              {/* Password field */}
              <div className="mb-2">
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
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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
              </div>

              {/* Forgot password */}
              <div className="text-right mb-5">
                <a href="#" className="text-xs text-[#3882f6] no-underline hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-3.5 py-2.5 text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#3882f6] to-[#6366f1] text-white font-semibold py-3.5 rounded-xl text-sm shadow-[0_4px_20px_rgba(56,130,246,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-none"
              >
                {loading ? 'Signing in...' : 'Sign in to JobPilot'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-white/50">
              New to JobPilot?{' '}
              <Link
                to="/register"
                className="text-[#3882f6] font-medium no-underline hover:underline"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </main>

        <footer className="text-center pb-6 text-xs text-white/25">
          © 2025 JobPilot — College Project
        </footer>
      </div>

      <Toast message={error} />
    </div>
  );
}
