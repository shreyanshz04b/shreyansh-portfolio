import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Services from "./components/Services";
import About from "./components/About";
import ChatBot from "./components/ChatBot";
import Blog from "./components/Blog";
import Admin from "./components/Admin";
import BlogPost from "./components/BlogPost";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard"; // ✅ Import AdminLogin
import Contact from "./components/Contact";
import ResumeGenerator from "./pages/ResumeGenerator";


function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setTrail((prevTrail) => [
        ...prevTrail,
        { x: e.clientX, y: e.clientY, size: 12 + Math.random() * 8 },
      ]);
      if (trail.length > 15) setTrail(trail.slice(1));
    };

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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [trail]);

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(10,10,20,1) 70%)",
  };

  const contentStyle = { flex: 1 };

  return (
    <Router>
      <div style={appStyle}>
        <Header />
        <div style={contentStyle}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/services" element={<Services />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/adminlogin" element={<AdminLogin />} /> {/* ✅ Admin Login Route */}
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/resume" element={<ResumeGenerator />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
