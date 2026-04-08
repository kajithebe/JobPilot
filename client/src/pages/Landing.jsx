import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📄',
    title: 'Resume Builder',
    description:
      'Build standout resumes with 5 professional templates, 8 colour themes, and live preview.',
  },
  {
    icon: '📋',
    title: 'Application Tracker',
    description:
      'Track every job application through a visual Kanban pipeline from wishlist to offer.',
  },
  {
    icon: '🎯',
    title: 'ATS Score Checker',
    description:
      'Match your resume against job descriptions and get a keyword score instantly.',
  },
  {
    icon: '📅',
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
                <span className="text-3xl">{feature.icon}</span>
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