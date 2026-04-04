import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../store/authContext';

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

  // Password strength checker
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
  const strengthColors = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      const fullName = `${firstName} ${lastName}`;
      const data = await registerUser(fullName, email, password);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Background glows */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.page}>
        {/* Nav */}
        <nav style={styles.nav}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" width="17" height="17" style={{ fill: 'white' }}>
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" />
              </svg>
            </div>
            <span style={styles.logoText}>JobPilot</span>
          </Link>
          <div style={styles.navRight}>
            Already have an account?{' '}
            <Link to="/login" style={styles.navLink}>
              Log in
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Start your journey</div>
            <div style={styles.cardSub}>
              Create your account <span style={styles.freeBadge}>Free forever</span>
            </div>

            {/* Google button */}
            <button style={styles.btnGoogle} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or create with email</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* First + Last name row */}
              <div style={styles.nameRow}>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={styles.input}
                    autoComplete="given-name"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Johnson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={styles.input}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.field}>
                <label style={styles.label} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={styles.field}>
                <label style={styles.label} htmlFor="password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...styles.input, paddingRight: '44px' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.pwToggle}
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

                {/* Password strength bars */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '2px',
                            background:
                              i <= strengthScore
                                ? strengthColors[strengthScore]
                                : 'rgba(255,255,255,0.07)',
                            transition: 'background 0.3s',
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '11px', color: strengthColors[strengthScore] }}>
                      {strengthLabels[strengthScore]}
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && <div style={styles.errorMsg}>{error}</div>}

              <button type="submit" disabled={loading} style={styles.btnSubmit}>
                {loading ? 'Creating account...' : 'Create my JobPilot account →'}
              </button>
            </form>

            <div style={styles.terms}>
              By signing up, you agree to our{' '}
              <a href="#" style={styles.navLink}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" style={styles.navLink}>
                Privacy Policy
              </a>
            </div>

            <div style={styles.cardFooter}>
              Already have an account?{' '}
              <Link to="/login" style={styles.navLink}>
                Sign in
              </Link>
            </div>
          </div>
        </main>

        <footer style={styles.footer}>© 2025 JobPilot — College Project</footer>
      </div>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Inter', sans-serif",
    background: '#080d1a',
    minHeight: '100vh',
    position: 'relative',
  },
  glow1: {
    position: 'fixed',
    width: '700px',
    height: '700px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,130,246,0.11) 0%, transparent 70%)',
    top: '-200px',
    left: '-150px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glow2: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
    bottom: '-100px',
    right: '-100px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '22px 48px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
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
  navRight: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  navLink: { color: '#3882f6', textDecoration: 'none', fontWeight: 500 },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 24px 48px',
  },
  card: {
    background: '#0f1729',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
    marginBottom: '4px',
  },
  cardSub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '26px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  freeBadge: {
    background: 'rgba(16,185,129,0.15)',
    border: '1px solid rgba(16,185,129,0.3)',
    color: '#34d399',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '99px',
    padding: '2px 10px',
  },
  btnGoogle: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '11px 16px',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '22px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '22px',
  },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: '12px', color: 'rgba(255,255,255,0.25)' },
  nameRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  pwToggle: {
    position: 'absolute',
    right: '13px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: 'rgba(255,255,255,0.25)',
  },
  errorMsg: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  btnSubmit: {
    width: '100%',
    background: 'linear-gradient(135deg, #3882f6, #6366f1)',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    color: '#fff',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.1px',
    boxShadow: '0 4px 20px rgba(56,130,246,0.3)',
  },
  terms: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: 1.6,
  },
  cardFooter: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  footer: {
    textAlign: 'center',
    padding: '0 48px 24px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.25)',
  },
};
