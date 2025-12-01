// client/src/App.jsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import JobList from "./pages/jobList";
import Login from "./pages/login";
import Register from "./pages/Register";
import JobDetails from "./pages/jobDetails";
import PostJob from "./pages/post-job";
import AdminDashboard from "./pages/adminDashboard";


const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Jobs</Link>{" "}
      {user?.role === "recruiter" && (
        <>
          {" | "}
          <Link to="/post-job">Post Job</Link>
        </>
      )}
      {user?.role === "admin" && (
        <>
          {" | "}
          <Link to="/admin">Admin</Link>
        </>
      )}
      <span style={{ float: "right" }}>
        {user ? (
          <>
            {user.name} ({user.role}){" "}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/" element={<JobList />} />

          <Route
            path="/post-job"
            element={
              <ProtectedRoute roles={["recruiter", "admin"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
