import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    ),
    title: 'Resume Builder',
    description:
      'Build standout resumes with 5 professional templates, 8 colour themes, and live preview.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ),
    title: 'Application Tracker',
    description:
      'Track every job application through a visual Kanban pipeline from wishlist to offer.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    ),
    title: 'ATS Score Checker',
    description:
      'Match your resume against job descriptions and get a keyword score instantly.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
    title: 'Interview Manager',
    description:
      'Schedule interviews, manage prep checklists, and get 24h email reminders automatically.',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-bold text-blue-600">JobPilot</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-blue-600 hover:bg-blue-700
              text-white px-4 py-2 rounded-lg transition"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-600
          bg-blue-50 px-3 py-1 rounded-full mb-6">
          Your job search, organised
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
          Build resumes. Track applications.{' '}
          <span className="text-blue-600">Land your next job.</span>
        </h1>
        <p className="text-gray-500 mt-6 text-base sm:text-lg max-w-xl">
          JobPilot combines a powerful resume builder with a job application tracker
          so you never lose track of where you stand.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white
              font-medium rounded-lg text-sm transition"
          >
            Get started for free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700
              border border-gray-300 font-medium rounded-lg text-sm transition"
          >
            Sign in to your account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Everything you need to manage your job search
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <span className="text-blue-500">{feature.icon}</span>
                <h3 className="text-base font-semibold text-gray-900 mt-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} JobPilot. 
        </p>
      </footer>

    </div>
  );
};

export default Landing;