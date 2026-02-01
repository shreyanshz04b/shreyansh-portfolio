import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

/* ================= MAIN COMPONENT ================= */

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message Sent Successfully ");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (err) {
      setStatus("Server error.");
    }
  };

  return (
    <Container>
      <GridOverlay />
      <ParticleLayer />

      <FloatingBlob />
      <FloatingBlob2 />
      <CodeRain />

      <Card>
        <Title>Let’s Build Something</Title>
        <Subtitle>Have a project in mind? Let’s talk.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <input
              type="text"
              name="name"
              placeholder=" "
              value={form.name}
              onChange={handleChange}
              required
            />
            <label>Name</label>
          </InputGroup>

          <InputGroup>
            <input
              type="email"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </InputGroup>

          <InputGroup>
            <textarea
              name="message"
              placeholder=" "
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            />
            <label>Message</label>
          </InputGroup>

          <SubmitButton type="submit">
            Send Message
          </SubmitButton>
        </Form>

        {status && <Status>{status}</Status>}
      </Card>
    </Container>
  );
}

export default Contact;

/* ================= ANIMATIONS ================= */

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

/* ================= STYLES ================= */

const Container = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #0b1120, #0f172a, #111827, #0b1120);
  background-size: 400% 400%;
  animation: ${gradientMove} 15s ease infinite;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const FloatingBlob = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #0ea5e9, transparent 70%);
  border-radius: 50%;
  top: -100px;
  left: -100px;
  filter: blur(140px);
  animation: ${float} 12s ease-in-out infinite;
  opacity: 0.4;
`;

const FloatingBlob2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, #38bdf8, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  right: -100px;
  filter: blur(140px);
  animation: ${float} 10s ease-in-out infinite reverse;
  opacity: 0.3;
`;


const Card = styled.div`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 520px;
  padding: 50px 40px;
  border-radius: 20px;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  margin-bottom: 30px;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  position: relative;

  input,
  textarea {
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 23, 42, 0.8);
    color: #ffffff;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s ease;
  }

  input:focus,
  textarea:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 10px rgba(14,165,233,0.4);
  }

  label {
    position: absolute;
    left: 14px;
    top: 14px;
    color: #64748b;
    font-size: 0.8rem;
    pointer-events: none;
    transition: all 0.2s ease;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label,
  textarea:focus + label,
  textarea:not(:placeholder-shown) + label {
    top: -8px;
    left: 10px;
    background: #111827;
    padding: 0 6px;
    font-size: 0.7rem;
    color: #0ea5e9;
  }
`;

const SubmitButton = styled.button`
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(14,165,233,0.4);
  }
`;

const Status = styled.p`
  margin-top: 20px;
  font-size: 0.85rem;
  color: #38bdf8;
`;
const codeMove = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const CodeRain = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.05;
  pointer-events: none;

  &::before {
    content: "const build = () => { return success; } function deploy() { console.log('Live'); } npm run build git push origin main";
    position: absolute;
    width: 100%;
    white-space: nowrap;
    font-family: monospace;
    font-size: 1rem;
    color: #0ea5e9;
    animation: ${codeMove} 20s linear infinite;
  }
`;
const ParticleLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06) 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 200px 200px;
  animation: ${gradientMove} 30s linear infinite;
  pointer-events: none;
`;
