import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ResumePreview({ data }) {
  const resumeRef = useRef();

  if (!data?.structured || !data?.personal) return null;

  const { personal, structured } = data;

  const downloadPDF = async () => {
    const element = resumeRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("ATS_Resume.pdf");
  };

  return (
    <div style={wrapper}>

      <div
        ref={resumeRef}
        contentEditable
        suppressContentEditableWarning
        style={a4}
      >

        {/* HEADER */}
        <div style={header}>
          <h1 style={name}>{personal.full_name}</h1>
          <div style={contact}>
            {personal.email} | {personal.phone} | {personal.linkedin} | {personal.github}
          </div>
        </div>

        {/* SUMMARY */}
        <Section title="Professional Summary">
          <p>{structured.summary}</p>
        </Section>

        {/* EXPERIENCE */}
        <Section title="Experience">
          {structured.experience?.map((exp, i) => (
            <div key={i} style={block}>
              <div style={rowBetween}>
                <strong>{exp.title}</strong>
                <span>{exp.duration}</span>
              </div>
              <div style={company}>{exp.company}</div>

              <ul style={list}>
                {exp.points?.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        {/* PROJECTS */}
        <Section title="Projects">
          {structured.projects?.map((proj, i) => (
            <div key={i} style={block}>
              <strong>{proj.name}</strong>
              <ul style={list}>
                {proj.points?.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        {/* SKILLS */}
        <Section title="Technical Skills">
          <p>{structured.skills?.technical}</p>
          <p>{structured.skills?.tools}</p>
          <p>{structured.skills?.other}</p>
        </Section>

        {/* EDUCATION */}
        <Section title="Education">
          {structured.education?.map((edu, i) => (
            <div key={i} style={block}>
              <div style={rowBetween}>
                <strong>{edu.degree}</strong>
                <span>{edu.year}</span>
              </div>
              <div>{edu.institution}</div>
            </div>
          ))}
        </Section>

      </div>

      <button onClick={downloadPDF} style={downloadBtn}>
        Download PDF
      </button>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <h3 style={sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "40px",
};

const a4 = {
  width: "210mm",
  minHeight: "297mm",
  padding: "20mm",
  background: "#ffffff",
  fontFamily: "Times New Roman, serif",
  fontSize: "11pt",
  lineHeight: "1.5",
  color: "#000",
  boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  outline: "none",
};

const header = {
  textAlign: "center",
  marginBottom: "10px",
};

const name = {
  fontSize: "18pt",
  fontWeight: "bold",
  marginBottom: "4px",
};

const contact = {
  fontSize: "10pt",
};

const sectionTitle = {
  fontSize: "12pt",
  fontWeight: "bold",
  borderBottom: "1px solid #000",
  paddingBottom: "4px",
  marginBottom: "8px",
};

const block = {
  marginBottom: "10px",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
};

const company = {
  fontStyle: "italic",
  marginBottom: "4px",
};

const list = {
  paddingLeft: "18px",
  marginTop: "4px",
};

const downloadBtn = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
