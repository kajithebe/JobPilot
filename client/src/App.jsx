import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import NotFound from './pages/NotFound.jsx';

// Placeholder — will be replaced in later sprints
const Dashboard = () => (
  <div className="p-8 text-gray-700">Dashboard — coming soon</div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;