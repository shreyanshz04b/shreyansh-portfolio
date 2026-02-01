import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) console.error(error);
    else setPost(data);
    setLoading(false);
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!post) return <p style={styles.loading}>Post not found.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/blog" style={styles.backBtn}>← Back to Blog</Link>
      </div>

      {post.cover_image && (
        <div style={styles.hero}>
          <img
            src={post.cover_image}
            alt={post.title}
            style={styles.heroImage}
          />
        </div>
      )}

      <div style={styles.contentBox}>
        <h1 style={styles.title}>{post.title}</h1>
        <p style={styles.date}>
          Published on {new Date(post.created_at).toLocaleDateString()}
        </p>

        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.backlinks && post.backlinks.length > 0 && (
          <div style={styles.citations}>
            <h3>🔗 Citations</h3>
            <ul>
              {post.backlinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(145deg,#0a0f1a,#111b2a)",
    color: "#fff",
    paddingBottom: "50px",
  },
  header: {
    padding: "20px 40px",
  },
  backBtn: {
    color: "#00fff2",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
  },
  hero: {
    width: "100%",
    overflow: "hidden",
    maxHeight: "400px",
  },
  heroImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    filter: "brightness(0.9)",
  },
  contentBox: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#00fff2",
    textShadow: "0 0 8px #00fff2",
    marginBottom: "10px",
  },
  date: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "30px",
  },
  content: {
    lineHeight: 1.8,
    fontSize: "1.05rem",
    color: "#e2e8f0",
  },
  citations: {
    marginTop: "40px",
    borderTop: "1px solid #1e293b",
    paddingTop: "20px",
  },
  link: {
    color: "#00fff2",
    textDecoration: "underline",
  },
  loading: {
    color: "#00fff2",
    textAlign: "center",
    marginTop: "100px",
    fontSize: "1.2rem",
  },
};
