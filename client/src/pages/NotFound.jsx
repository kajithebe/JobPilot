import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 number */}
        <h1 className="text-9xl font-bold text-blue-600">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">
          Page not found
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Looks like this page doesn't exist or was moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white
              text-sm font-medium rounded-lg transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700
              border border-gray-300 text-sm font-medium rounded-lg transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;