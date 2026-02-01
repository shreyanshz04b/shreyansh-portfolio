import React, { useState } from "react";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import { supabase } from "../supabaseClient";
import { filterRelevantSkills } from "../utils/resumeFilter";

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState(null);

  const handleGenerate = async ({ role, level }) => {
    try {
      if (!role) {
        alert("Role is required");
        return;
      }

      const [
        { data: skills, error: skillsError },
        { data: experience, error: expError },
        { data: education, error: eduError },
        { data: projects, error: projError },
        { data: certifications, error: certError },
      ] = await Promise.all([
        supabase.from("skills").select("*"),
        supabase.from("experience").select("*"),
        supabase.from("education").select("*"),
        supabase.from("certifications").select("*"),
        supabase.from("projects").select("*"),
      ]);

      if (skillsError || expError || eduError || projError) {
        console.error(skillsError || expError || eduError || projError);
        alert("Database fetch failed.");
        return;
      }

      let relevantSkills = filterRelevantSkills(skills || [], role);

      if (!relevantSkills.length && skills?.length) {
        relevantSkills = skills
          .sort((a, b) => b.proficiency - a.proficiency)
          .slice(0, 8);
      }

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          relevantSkills,
          experience,
          education,
          projects,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        alert(result.error || "AI Generation Failed");
        return;
      }

      setResumeData({
        aiContent: result.content,
        personal: result.personal,
      });

    } catch (err) {
      console.error(err);
      alert("Resume system error.");
    }
  };

  return (
    <>
      <ResumeForm onGenerate={handleGenerate} />
      {resumeData && <ResumePreview data={resumeData} />}
    </>
  );
}
