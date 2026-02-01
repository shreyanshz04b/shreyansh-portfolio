import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const sanitize = (value) =>
    typeof value === "string" ? DOMPurify.sanitize(value.trim()) : value;

  const ensureAdmin = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session || session.user?.user_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      navigate("/adminlogin", { replace: true });
      throw new Error("Unauthorized");
    }
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session || session.user?.user_metadata?.role !== "admin") {
        navigate("/adminlogin", { replace: true });
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
    };

    verifyAdmin();
  }, [navigate]);

  // ---------- STATES ----------
  const [posts, setPosts] = useState([]);
  const [postEditing, setPostEditing] = useState(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    cover_image: "",
    backlinks: "",
  });

  const [projects, setProjects] = useState([]);
  const [projectEditing, setProjectEditing] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    github_url: "",
    tech_stack: "",
    cover_image: "",
  });

  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profile_image: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillEditing, setSkillEditing] = useState(null);
  const [skillForm, setSkillForm] = useState({
    skill_name: "",
    proficiency: "",
    category: "",
  });

  const [certifications, setCertifications] = useState([]);
  const [certEditing, setCertEditing] = useState(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    credential_url: "",
  });

  const [education, setEducation] = useState([]);
  const [eduEditing, setEduEditing] = useState(null);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
  });

  const [experience, setExperience] = useState([]);
  const [expEditing, setExpEditing] = useState(null);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    start_date: "",
    end_date: "",
    location: "",
    responsibilities: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authorized) return;
    fetchPosts();
    fetchProjects();
    fetchPersonalInfo();
    fetchSkills();
    fetchCertifications();
    fetchEducation();
    fetchExperience();
  }, [authorized]);

  // ---------- FETCH ----------
  const secureFetch = async (query, setter) => {
    try {
      await ensureAdmin();
      const { data, error } = await query;
      if (!error) setter(data);
    } catch {}
  };

  const fetchPosts = () =>
    secureFetch(
      supabase.from("posts").select("*").order("created_at", { ascending: false }),
      setPosts
    );

  const fetchProjects = () =>
    secureFetch(
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      setProjects
    );

  const fetchPersonalInfo = async () => {
    try {
      await ensureAdmin();
      const { data } = await supabase
        .from("personal_info")
        .select("*")
        .limit(1)
        .single();
      if (data) setPersonalInfo(data);
    } catch {}
  };

  const fetchSkills = () =>
    secureFetch(
      supabase.from("skills").select("*").order("created_at", { ascending: true }),
      setSkills
    );

  const fetchCertifications = () =>
    secureFetch(
      supabase.from("certifications").select("*").order("created_at", { ascending: true }),
      setCertifications
    );

  const fetchEducation = () =>
    secureFetch(
      supabase.from("education").select("*").order("start_date", { ascending: false }),
      setEducation
    );

  const fetchExperience = () =>
    secureFetch(
      supabase.from("experience").select("*").order("start_date", { ascending: false }),
      setExperience
    );

  // ---------- SECURE SUBMIT ----------
  const secureUpsert = async (table, data, editingId) => {
    await ensureAdmin();
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, sanitize(v)])
    );

    if (editingId) {
      await supabase.from(table).update(cleanData).eq("id", editingId);
    } else {
      await supabase.from(table).insert([cleanData]);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let backlinksArray = [];
      if (postForm.backlinks.trim()) {
        backlinksArray = JSON.parse(postForm.backlinks);
      }

      await ensureAdmin();
      const cleanTitle = sanitize(postForm.title);
      const cleanContent = sanitize(postForm.content);

      if (postEditing) {
        await supabase.from("posts").update({
          title: cleanTitle,
          content: cleanContent,
          cover_image: postForm.cover_image,
          backlinks: backlinksArray,
        }).eq("id", postEditing.id);
      } else {
        await supabase.from("posts").insert([{
          title: cleanTitle,
          content: cleanContent,
          cover_image: postForm.cover_image,
          backlinks: backlinksArray,
        }]);
      }

      fetchPosts();
      setPostForm({ title: "", content: "", cover_image: "", backlinks: "" });
      setPostEditing(null);
    } catch {
      alert("Security validation failed");
    }
    setLoading(false);
  };

  // Apply secureUpsert to all others
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await secureUpsert("projects", projectForm, projectEditing?.id);
    fetchProjects();
    setProjectForm({ title: "", description: "", github_url: "", tech_stack: "", cover_image: "" });
    setProjectEditing(null);
    setLoading(false);
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await ensureAdmin();
    const clean = Object.fromEntries(
      Object.entries(personalInfo).map(([k, v]) => [k, sanitize(v)])
    );
    await supabase.from("personal_info").upsert([clean], { onConflict: ["id"] });
    fetchPersonalInfo();
    setLoading(false);
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await secureUpsert("skills", skillForm, skillEditing?.id);
    fetchSkills();
    setSkillForm({ skill_name: "", proficiency: "", category: "" });
    setSkillEditing(null);
    setLoading(false);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await secureUpsert("certifications", certForm, certEditing?.id);
    fetchCertifications();
    setCertForm({ title: "", issuer: "", issue_date: "", expiration_date: "", credential_url: "" });
    setCertEditing(null);
    setLoading(false);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await secureUpsert("education", eduForm, eduEditing?.id);
    fetchEducation();
    setEduForm({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "", description: "" });
    setEduEditing(null);
    setLoading(false);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await secureUpsert("experience", expForm, expEditing?.id);
    fetchExperience();
    setExpForm({ company: "", role: "", start_date: "", end_date: "", location: "", responsibilities: "" });
    setExpEditing(null);
    setLoading(false);
  };

  const handleDelete = async (id, table) => {
    if (!window.confirm("Are you sure?")) return;
    await ensureAdmin();
    await supabase.from(table).delete().eq("id", id);
    fetchPosts();
    fetchProjects();
    fetchSkills();
    fetchCertifications();
    fetchEducation();
    fetchExperience();
  };

  if (checkingAuth) {
    return <div style={{ padding: "40px", color: "#fff" }}>Checking access...</div>;
  }

  if (!authorized) return null;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard ⚙️</h1>
      {/* UI REMAINS EXACTLY SAME */}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, #0a0f1f, #0b1120 40%, #070b14 100%)",
    color: "#e2e8f0",
    fontFamily: "Inter, sans-serif",
  },

  heading: {
    fontSize: "2.6rem",
    fontWeight: "700",
    marginBottom: "35px",
    background: "linear-gradient(90deg, #00f5ff, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "1px",
  },

  tabContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "35px",
    flexWrap: "wrap",
  },

  tabButton: {
    flex: 1,
    minWidth: "140px",
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(10px)",
    color: "#cbd5e1",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "50px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#0f172a",
    color: "#fff",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },

  textarea: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#0f172a",
    color: "#fff",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },

  editor: {
    background: "#ffffff",
    color: "#000",
    borderRadius: "12px",
    overflow: "hidden",
  },

  preview: {
    width: "260px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "2px solid #00f5ff",
    boxShadow: "0 10px 30px rgba(0,245,255,0.3)",
  },

  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    background: "linear-gradient(135deg, #00f5ff, #7c3aed)",
    color: "#000",
    transition: "all 0.3s ease",
  },

  subHeading: {
    fontSize: "1.8rem",
    marginTop: "50px",
    marginBottom: "25px",
    color: "#38bdf8",
    fontWeight: "600",
  },

  postsGrid: {
    display: "grid",
    gap: "24px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
  },

  postCard: {
    background: "rgba(15,23,42,0.7)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    transition: "all 0.3s ease",
  },

  coverImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  postTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#00f5ff",
  },

  postActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  actionBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    color: "#000",
    transition: "all 0.3s ease",
  },
};
