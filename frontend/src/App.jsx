import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router';
import { Meet } from './pages/Meet.jsx';
import Load from './pages/Load.jsx';
import Home from './pages/Home.jsx';
import AuthPage from './pages/Auth';
import ProtectedRoute from './routes/protectedRoutes.jsx';
import { AuthProvider, useAuth } from './providers/authProvider.jsx';
import './App.css'; // Import the CSS file

function About() {
  return <h1>About Page</h1>;
}

export default function App() {
  const { user, setUser, loading } = useAuth();

  return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/auth">Auth</Link>
          <Link to="/load">Load</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        <Route path="/auth" element= {user ? <Navigate to = "/" replace /> : <AuthPage/>} />
        <Route path="/load"
          element={
            <ProtectedRoute>
              <Load />
            </ProtectedRoute>} />
        <Route path = "/meet/:id" element = {
          <ProtectedRoute>
            <Meet />
          </ProtectedRoute>
        } />
        </Routes>
      </div> );
}
