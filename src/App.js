import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Services from "./components/Services";
import About from "./components/About";
import ChatBot from "./components/ChatBot";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Contact from "./components/Contact";
import ResumeGenerator from "./pages/ResumeGenerator";
import AdminRoute from "./components/AdminRoute";

function AppWrapper() {
  const location = useLocation();

  const isAdminPage =
    location.pathname === "/adminlogin" ||
    location.pathname === "/admindashboard";

  // 🔒 Remove query parameters
  useEffect(() => {
    if (location.search) {
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location]);

  // 🔒 DevTools + Right Click Blocker (Friction Layer Only)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "r") ||
        e.key === "F5"
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(10,10,20,1) 70%)",
      }}
    >
      {!isAdminPage && <Header />}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<ResumeGenerator />} />

          {/* 🔐 Admin Login */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* 🔐 Strict Admin Dashboard */}
          <Route
            path="/admindashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 🚫 Block everything else */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
