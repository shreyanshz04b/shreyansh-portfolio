import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    cover_image: "",
    backlinks: "[]"
  });

  if (!auth) {
    const password = prompt("Enter admin password:");
    if (password === "SURYADEV@9389735318@") setAuth(true);
    else return <p className="text-center text-red-500">Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backlinksArray = JSON.parse(form.backlinks);
      const { error } = await supabase.from("posts").insert([
        {
          title: form.title,
          content: form.content,
          cover_image: form.cover_image,
          backlinks: backlinksArray,
        },
      ]);
      if (error) console.error(error);
      else alert("✅ Blog post added successfully!");
      setForm({ title: "", content: "", cover_image: "", backlinks: "[]" });
    } catch {
      alert("⚠️ Invalid backlinks format. Use JSON like [{\"label\":\"My Site\",\"url\":\"https://site.com\"}]");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 bg-gray-800 rounded border border-cyan-400"
          placeholder="Post Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full p-2 bg-gray-800 rounded border border-cyan-400"
          rows="6"
          placeholder="Post Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          className="w-full p-2 bg-gray-800 rounded border border-cyan-400"
          placeholder="Cover Image URL"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />
        <textarea
          className="w-full p-2 bg-gray-800 rounded border border-cyan-400"
          rows="2"
          placeholder='Backlinks JSON e.g. [{"label":"GitHub","url":"https://github.com"}]'
          value={form.backlinks}
          onChange={(e) => setForm({ ...form, backlinks: e.target.value })}
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white font-semibold"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
