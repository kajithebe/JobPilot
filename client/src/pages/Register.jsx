import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthScore = getStrength(formData.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthTextColors = [
    '',
    'text-red-400',
    'text-yellow-400',
    'text-yellow-400',
    'text-emerald-400',
  ];
  const strengthBarColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-emerald-400'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // confirmPassword is NOT sent to API — only name, email, password
    await register(formData.name, formData.email, formData.password);
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
              {/* Full name — sent as single 'name' field to API */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors
                    ${errors.name ? 'border-red-400' : 'border-white/[0.08] focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06]'}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email — must be unique, BACKEND returns 409 if duplicate */}
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
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors
                    ${errors.email ? 'border-red-400' : 'border-white/[0.08] focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06]'}`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Password — plain text, BACKEND must hash with bcrypt */}
              <div className="mb-4">
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
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-3 pr-11 text-sm text-white placeholder-white/25 outline-none transition-colors
                      ${errors.password ? 'border-red-400' : 'border-white/[0.08] focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06]'}`}
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
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}

                {/* Strength bars — frontend only, not sent to API */}
                {formData.password && (
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

              {/* Confirm password — frontend only, NOT sent to API */}
              <div className="mb-5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors
                    ${errors.confirmPassword ? 'border-red-400' : 'border-white/[0.08] focus:border-[#3882f6] focus:bg-[#3882f6]/[0.06]'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#3882f6] to-[#6366f1] text-white font-semibold py-3.5 rounded-xl text-sm shadow-[0_4px_20px_rgba(56,130,246,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-none"
              >
                {loading ? 'Creating account...' : 'Create my JobPilot account →'}
              </button>
            </form>

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
    </div>
  );
}
