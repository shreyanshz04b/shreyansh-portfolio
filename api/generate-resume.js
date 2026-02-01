export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");
      return res.status(500).json({
        error: "Server misconfigured: Missing GROQ_API_KEY"
      });
    }

    const {
      role,
      level,
      relevantSkills = [],
      experience = [],
      certifications = [],
      education = [],
      projects = [],
    } = req.body || {};

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const personal = {
      full_name: "Shreyansh Agarwal",
      email: "shreyansh.agarwal.it@gmail.com",
      phone: "7906978267",
      linkedin: "linkedin.com/in/shreyanshagarwalceo",
      github: "github.com/shreyanshz04b",
    };

    const skillsText = (relevantSkills || [])
      .map(s => s?.skill_name || "")
      .join(", ");

    const expText = (experience || [])
      .map(e => `${e?.role || ""} at ${e?.company || ""}`)
      .join("\n");

    const projectText = (projects || [])
      .map(p => p?.title || "")
      .join("\n");

    const certificationsText = certifications
      .map(c => `${c?.name || ""} | ${c?.issuer || ""} | ${c?.year || ""}`)
      .join("\n");

    const educationText = education
      .map(e => `${e?.degree || ""} | ${e?.institution || ""} | ${e?.year || ""}`)
      .join("\n");

    const prompt = `
Create a PROFESSIONAL, ATS-OPTIMIZED, ONE-PAGE resume.

STRICT RULES:
- Maximum 1 page
- Clear section headings
- Section headings MUST be in ALL CAPS
- Headings must appear bold visually (but no markdown symbols like **)
- Plain text output only
- No decorative formatting
- No explanations or commentary
- No invented companies, roles, tools, technologies, or metrics
- Use ONLY the data provided below
- Expand responsibilities intelligently using best resume practices
- Convert raw data into strong achievement-focused bullet points
- Use action verbs
- Add metrics ONLY if logically inferable from context
- If no metric data exists, improve impact wording without fabricating numbers
- 3–4 bullet points per job
- 2–3 bullet points per project
- 1–2 bullet points per certification (if provided)
- Bullet points must start with "-"
- Avoid generic statements
- Avoid repetition
- Maintain corporate professional tone
- Ensure ATS-friendly structure
- Keep spacing clean and readable
- Keep content concise and impact-driven

Candidate Information:
Name: ${personal.full_name}
Email: ${personal.email}
Phone: ${personal.phone}
LinkedIn: ${personal.linkedin}
GitHub: ${personal.github}

Target Role: ${role}
Experience Level: ${level}

Skills (ONLY use these):
${skillsText}

Experience (DO NOT invent anything new):
${expText}

Projects (DO NOT invent anything new):
${projectText}

Certifications (DO NOT invent anything new):
${certificationsText || ""}

EDUCATION (DO NOT invent anything new):
${educationText || ""}

ROLE-AWARE CONTENT LOGIC:

If level = entry:
- Emphasize technical skills, academic projects, internships, and learning ability.
- Focus on implementation and hands-on development.

If level = mid:
- Emphasize ownership, impact, collaboration, optimization, measurable improvements.

If level = senior:
- Emphasize leadership, system design, scalability, architecture decisions, mentoring, and business impact.

REQUIRED STRUCTURE EXACTLY AS FOLLOWS:

FULL NAME (IN CAPS)
Contact line (single line)

PROFESSIONAL SUMMARY
3–4 lines maximum.
Role-aligned and impact-focused.

TECHNICAL SKILLS
Categorized skill groups in single-line format separated by "|"

PROFESSIONAL EXPERIENCE
Company | Role | Dates
- Strong achievement bullet
- Strong achievement bullet
- Strong achievement bullet

PROJECTS
Project Name
- Impact-driven bullet
- Technical implementation bullet

CERTIFICATIONS (if available)
Certification Name | Issuer | Year
- Short value-focused bullet

EDUCATION
Degree | Institution | Year

Ensure the resume fits on ONE PAGE.
Do NOT exceed one page.
Do NOT add extra sections.
Plain text only.
`;


    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a professional resume writer." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({
        error: data?.error?.message || "Groq API Error"
      });
    }

    return res.status(200).json({
      content: data?.choices?.[0]?.message?.content || "",
      personal,
    });

  } catch (error) {
    console.error("Server crash:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
}
