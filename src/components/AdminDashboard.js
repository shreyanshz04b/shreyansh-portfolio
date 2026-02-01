import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts");

  // ---------- BLOG STATES ----------
  const [posts, setPosts] = useState([]);
  const [postEditing, setPostEditing] = useState(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    cover_image: "",
    backlinks: "",
  });

  // ---------- PROJECT STATES ----------
  const [projects, setProjects] = useState([]);
  const [projectEditing, setProjectEditing] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    github_url: "",
    tech_stack: "",
    cover_image: "",
  });

  // ---------- PERSONAL INFO STATES ----------
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

  // ---------- SKILLS STATES ----------
  const [skills, setSkills] = useState([]);
  const [skillEditing, setSkillEditing] = useState(null);
  const [skillForm, setSkillForm] = useState({
    skill_name: "",
    proficiency: "",
    category: "",
  });

  // ---------- CERTIFICATIONS STATES ----------
  const [certifications, setCertifications] = useState([]);
  const [certEditing, setCertEditing] = useState(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    credential_url: "",
  });

  // ---------- EDUCATION STATES ----------
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

  // ---------- EXPERIENCE STATES ----------
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
    fetchPosts();
    fetchProjects();
    fetchPersonalInfo();
    fetchSkills();
    fetchCertifications();
    fetchEducation();
    fetchExperience();
  }, []);

  // ---------- FETCH FUNCTIONS ----------
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPosts(data);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setProjects(data);
  };

  const fetchPersonalInfo = async () => {
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .limit(1)
      .single();
    if (error) console.error(error);
    else if (data) setPersonalInfo(data);
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else setSkills(data);
  };

  const fetchCertifications = async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else setCertifications(data);
  };

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) console.error(error);
    else setEducation(data);
  };

  const fetchExperience = async () => {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) console.error(error);
    else setExperience(data);
  };

  // ---------- IMAGE UPLOAD ----------
  const handleImageUpload = async (e, target = "post") => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      if (target === "post") {
        setPostForm({ ...postForm, cover_image: publicUrlData.publicUrl });
      } else if (target === "project") {
        setProjectForm({ ...projectForm, cover_image: publicUrlData.publicUrl });
      } else if (target === "profile") {
        setPersonalInfo({ ...personalInfo, profile_image: publicUrlData.publicUrl });
      }
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ---------- SUBMIT FUNCTIONS ----------
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backlinksArray =
        postForm.backlinks.trim() === "" ? [] : JSON.parse(postForm.backlinks);

      if (postEditing) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: postForm.title,
            content: postForm.content,
            cover_image: postForm.cover_image,
            backlinks: backlinksArray,
          })
          .eq("id", postEditing.id);
        if (error) console.error(error);
      } else {
        const { error } = await supabase.from("posts").insert([
          {
            title: postForm.title,
            content: postForm.content,
            cover_image: postForm.cover_image,
            backlinks: backlinksArray,
          },
        ]);
        if (error) console.error(error);
      }

      setPostForm({ title: "", content: "", cover_image: "", backlinks: "" });
      setPostEditing(null);
      fetchPosts();
    } catch (err) {
      alert("Invalid backlinks JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (projectEditing) {
        const { error } = await supabase
          .from("projects")
          .update({
            title: projectForm.title,
            description: projectForm.description,
            github_url: projectForm.github_url,
            tech_stack: projectForm.tech_stack,
            cover_image: projectForm.cover_image,
          })
          .eq("id", projectEditing.id);
        if (error) console.error(error);
      } else {
        const { error } = await supabase.from("projects").insert([
          {
            title: projectForm.title,
            description: projectForm.description,
            github_url: projectForm.github_url,
            tech_stack: projectForm.tech_stack,
            cover_image: projectForm.cover_image,
          },
        ]);
        if (error) console.error(error);
      }

      setProjectForm({
        title: "",
        description: "",
        github_url: "",
        tech_stack: "",
        cover_image: "",
      });
      setProjectEditing(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("personal_info")
        .upsert([personalInfo], { onConflict: ["id"] });
      if (error) console.error(error);
      fetchPersonalInfo();
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skillEditing) {
        await supabase.from("skills").update(skillForm).eq("id", skillEditing.id);
      } else {
        await supabase.from("skills").insert([skillForm]);
      }
      setSkillForm({ skill_name: "", proficiency: "", category: "" });
      setSkillEditing(null);
      fetchSkills();
    } finally {
      setLoading(false);
    }
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (certEditing) {
        await supabase.from("certifications").update(certForm).eq("id", certEditing.id);
      } else {
        await supabase.from("certifications").insert([certForm]);
      }
      setCertForm({ title: "", issuer: "", issue_date: "", expiration_date: "", credential_url: "" });
      setCertEditing(null);
      fetchCertifications();
    } finally {
      setLoading(false);
    }
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (eduEditing) {
        await supabase.from("education").update(eduForm).eq("id", eduEditing.id);
      } else {
        await supabase.from("education").insert([eduForm]);
      }
      setEduForm({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "", description: "" });
      setEduEditing(null);
      fetchEducation();
    } finally {
      setLoading(false);
    }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (expEditing) {
        await supabase.from("experience").update(expForm).eq("id", expEditing.id);
      } else {
        await supabase.from("experience").insert([expForm]);
      }
      setExpForm({ company: "", role: "", start_date: "", end_date: "", location: "", responsibilities: "" });
      setExpEditing(null);
      fetchExperience();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExtended = async (id, table) => {
    if (!window.confirm("Are you sure?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) console.error(error);
    else {
      switch (table) {
        case "skills": fetchSkills(); break;
        case "certifications": fetchCertifications(); break;
        case "education": fetchEducation(); break;
        case "experience": fetchExperience(); break;
        default: break;
      }
    }
  };

  // ---------- DELETE POSTS & PROJECTS ----------
  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure?")) return;
    const { error } = await supabase
      .from(type === "post" ? "posts" : "projects")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
    else {
      type === "post" ? fetchPosts() : fetchProjects();
    }
  };

  // ---------- UI ----------
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard ⚙️</h1>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "posts" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("posts")}
        >
          📰 Manage Posts
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "projects" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("projects")}
        >
          💻 Manage Projects
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "personal" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("personal")}
        >
          👤 Personal Info
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "skills" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("skills")}
        >
          🛠 Skills
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "certifications" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("certifications")}
        >
          📜 Certifications
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "education" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("education")}
        >
          🎓 Education
        </button>
        <button
          style={{
            ...styles.tabButton,
            background: activeTab === "experience" ? "linear-gradient(135deg, #00fff2, #0077ff)" : "#1b2432",
          }}
          onClick={() => setActiveTab("experience")}
        >
          💼 Experience
        </button>
      </div>

      {/* ---------- TAB CONTENT ---------- */}
      {activeTab === "posts" && (
        <>
          {/* ---------- BLOG SECTION ---------- */}
          <form onSubmit={handlePostSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Enter post title"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              required
            />
            <ReactQuill
              theme="snow"
              value={postForm.content}
              onChange={(value) => setPostForm({ ...postForm, content: value })}
              style={styles.editor}
              placeholder="Write your article..."
            />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "post")} />
            {postForm.cover_image && <img src={postForm.cover_image} alt="cover" style={styles.preview} />}
            <textarea
              style={styles.textarea}
              placeholder="Optional backlinks JSON"
              value={postForm.backlinks}
              onChange={(e) => setPostForm({ ...postForm, backlinks: e.target.value })}
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? "Saving..." : postEditing ? "Update Post" : "Publish Post"}
            </button>
          </form>

          <h2 style={styles.subHeading}>📚 All Blog Posts</h2>
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                {post.cover_image && <img src={post.cover_image} alt={post.title} style={styles.coverImage} />}
                <h3 style={styles.postTitle}>{post.title}</h3>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setPostEditing(post)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDelete(post.id, "post")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "projects" && (
        <>
          {/* ---------- PROJECT SECTION ---------- */}
          <form onSubmit={handleProjectSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Project Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
            <textarea style={styles.textarea} placeholder="Project Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
            <input style={styles.input} placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} />
            <input style={styles.input} placeholder="Tech Stack (comma separated)" value={projectForm.tech_stack} onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "project")} />
            {projectForm.cover_image && <img src={projectForm.cover_image} alt="cover" style={styles.preview} />}
            <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : projectEditing ? "Update Project" : "Add Project"}</button>
          </form>

          <h2 style={styles.subHeading}>💻 All Projects</h2>
          <div style={styles.postsGrid}>
            {projects.map((p) => (
              <div key={p.id} style={styles.postCard}>
                {p.cover_image && <img src={p.cover_image} alt={p.title} style={styles.coverImage} />}
                <h3 style={styles.postTitle}>{p.title}</h3>
                <p>{p.description}</p>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setProjectEditing(p)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDelete(p.id, "project")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- PERSONAL INFO ---------- */}
      {activeTab === "personal" && (
        <form onSubmit={handlePersonalInfoSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Full Name" value={personalInfo.full_name} onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })} />
          <input style={styles.input} placeholder="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
          <input style={styles.input} placeholder="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
          <input style={styles.input} placeholder="Address" value={personalInfo.address} onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })} />
          <input style={styles.input} placeholder="LinkedIn URL" value={personalInfo.linkedin_url} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin_url: e.target.value })} />
          <input style={styles.input} placeholder="GitHub URL" value={personalInfo.github_url} onChange={(e) => setPersonalInfo({ ...personalInfo, github_url: e.target.value })} />
          <input style={styles.input} placeholder="Portfolio URL" value={personalInfo.portfolio_url} onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio_url: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Bio" value={personalInfo.bio} onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "profile")} />
          {personalInfo.profile_image && <img src={personalInfo.profile_image} alt="profile" style={styles.preview} />}
          <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : "Save Info"}</button>
        </form>
      )}

      {/* ---------- SKILLS ---------- */}
      {activeTab === "skills" && (
        <div>
          <form onSubmit={handleSkillSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Skill Name" value={skillForm.skill_name} onChange={(e) => setSkillForm({ ...skillForm, skill_name: e.target.value })} required />
            <input style={styles.input} placeholder="Proficiency" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} />
            <input style={styles.input} placeholder="Category" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
            <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : skillEditing ? "Update Skill" : "Add Skill"}</button>
          </form>
          <h2 style={styles.subHeading}>🛠 All Skills</h2>
          <div style={styles.postsGrid}>
            {skills.map((s) => (
              <div key={s.id} style={styles.postCard}>
                <h3 style={styles.postTitle}>{s.skill_name}</h3>
                <p>{s.proficiency} - {s.category}</p>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setSkillEditing(s) || setSkillForm(s)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDeleteExtended(s.id, "skills")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- CERTIFICATIONS ---------- */}
      {activeTab === "certifications" && (
        <div>
          <form onSubmit={handleCertSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Title" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} required />
            <input style={styles.input} placeholder="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
            <input style={styles.input} type="date" placeholder="Issue Date" value={certForm.issue_date} onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })} />
            <input style={styles.input} type="date" placeholder="Expiration Date" value={certForm.expiration_date} onChange={(e) => setCertForm({ ...certForm, expiration_date: e.target.value })} />
            <input style={styles.input} placeholder="Credential URL" value={certForm.credential_url} onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })} />
            <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : certEditing ? "Update Certificate" : "Add Certificate"}</button>
          </form>
          <h2 style={styles.subHeading}>📜 All Certifications</h2>
          <div style={styles.postsGrid}>
            {certifications.map((c) => (
              <div key={c.id} style={styles.postCard}>
                <h3 style={styles.postTitle}>{c.title}</h3>
                <p>{c.issuer} ({c.issue_date} - {c.expiration_date || "Present"})</p>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setCertEditing(c) || setCertForm(c)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDeleteExtended(c.id, "certifications")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- EDUCATION ---------- */}
      {activeTab === "education" && (
        <div>
          <form onSubmit={handleEduSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} required />
            <input style={styles.input} placeholder="Degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
            <input style={styles.input} placeholder="Field of Study" value={eduForm.field_of_study} onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })} />
            <input style={styles.input} type="date" placeholder="Start Date" value={eduForm.start_date} onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })} />
            <input style={styles.input} type="date" placeholder="End Date" value={eduForm.end_date} onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })} />
            <input style={styles.input} placeholder="Grade" value={eduForm.grade} onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })} />
            <textarea style={styles.textarea} placeholder="Description" value={eduForm.description} onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })} />
            <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : eduEditing ? "Update Education" : "Add Education"}</button>
          </form>
          <h2 style={styles.subHeading}>🎓 All Education</h2>
          <div style={styles.postsGrid}>
            {education.map((e) => (
              <div key={e.id} style={styles.postCard}>
                <h3 style={styles.postTitle}>{e.degree} - {e.institution}</h3>
                <p>{e.start_date} - {e.end_date || "Present"}</p>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setEduEditing(e) || setEduForm(e)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDeleteExtended(e.id, "education")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- EXPERIENCE ---------- */}
      {activeTab === "experience" && (
        <div>
          <form onSubmit={handleExpSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Company" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
            <input style={styles.input} placeholder="Role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} />
            <input style={styles.input} placeholder="Location" value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} />
            <input style={styles.input} type="date" placeholder="Start Date" value={expForm.start_date} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} />
            <input style={styles.input} type="date" placeholder="End Date" value={expForm.end_date} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} />
            <textarea style={styles.textarea} placeholder="Responsibilities" value={expForm.responsibilities} onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })} />
            <button style={styles.button} type="submit" disabled={loading}>{loading ? "Saving..." : expEditing ? "Update Experience" : "Add Experience"}</button>
          </form>
          <h2 style={styles.subHeading}>💼 All Experience</h2>
          <div style={styles.postsGrid}>
            {experience.map((exp) => (
              <div key={exp.id} style={styles.postCard}>
                <h3 style={styles.postTitle}>{exp.role} - {exp.company}</h3>
                <p>{exp.start_date} - {exp.end_date || "Present"} | {exp.location}</p>
                <div style={styles.postActions}>
                  <button style={styles.actionBtn} onClick={() => setExpEditing(exp) || setExpForm(exp)}>Edit</button>
                  <button style={{ ...styles.actionBtn, backgroundColor: "#e53935", color: "#fff" }} onClick={() => handleDeleteExtended(exp.id, "experience")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
