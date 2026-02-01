import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabaseClient";
import { filterRelevantSkills } from "../utils/resumeFilter";

export default function ResumeForm({ onGenerate }) {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("entry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateResume = async (e) => {
    e.preventDefault();

    if (!role.trim()) {
      setError("Please enter target role");
      return;
    }

    if (typeof onGenerate !== "function") {
      console.error("onGenerate is not a function");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Fetch data in parallel (faster)
      const [
        { data: skills },
        { data: experience },
        { data: education },
        { data: projects },
        { data: personal },
      ] = await Promise.all([
        supabase.from("skills").select("*"),
        supabase.from("experience").select("*"),
        supabase.from("education").select("*"),
        supabase.from("projects").select("*"),
        supabase.from("personal_info").select("*").single(),
      ]);

      if (!skills) throw new Error("Skills not found");

      // Filter relevant skills
      let relevantSkills = filterRelevantSkills(skills, role);

      if (!relevantSkills.length) {
        relevantSkills = skills
          .sort((a, b) => b.proficiency - a.proficiency)
          .slice(0, 8);
      }

      // Send to backend AI
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role.trim(),
          level,
          personal,
          relevantSkills,
          experience,
          education,
          projects,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "AI generation failed");
      }

      onGenerate({
        role,
        personal,
        relevantSkills,
        experience,
        education,
        projects,
        aiContent: result.content,
      });

    } catch (err) {
      console.error(err);
      setError("Failed to generate resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection>
      <FormWrapper onSubmit={generateResume}>
        <FormTitle>Generate ATS Optimized Resume</FormTitle>

        <FieldGroup>
          <Label>Target Role</Label>
          <Input
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Experience Level</Label>
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </Select>
        </FieldGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Resume"}
        </Button>
      </FormWrapper>
    </PageSection>
  );
}

/* ================= STYLES ================= */

const PageSection = styled.section`
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: radial-gradient(circle at top, #0f172a 0%, #020617 100%);
`;

const FormWrapper = styled.form`
  width: 100%;
  max-width: 520px;
  padding: 40px;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 245, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const FormTitle = styled.h2`
  text-align: center;
  font-size: 1.6rem;
  color: #e2e8f0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #94a3b8;
`;

const Input = styled.input`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: #0b1220;
  color: white;
  outline: none;

  &:focus {
    border-color: #00f5ff;
  }
`;

const Select = styled.select`
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: #0b1220;
  color: white;
  outline: none;

  &:focus {
    border-color: #00f5ff;
  }
`;

const Button = styled.button`
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  background: linear-gradient(135deg, #00f5ff, #7c3aed);
  color: #000;
  cursor: pointer;
  transition: 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,245,255,0.3);
  }
`;

const ErrorText = styled.p`
  color: #ff4d4d;
  font-size: 0.85rem;
  text-align: center;
`;
