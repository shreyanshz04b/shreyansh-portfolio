import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent logged-in admin from accessing login page
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user?.user_metadata?.role === "admin") {
        navigate("/admindashboard", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize & sanitize input
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword) {
        throw new Error("Invalid credentials");
      }

      // Artificial delay to reduce brute force speed
      await delay(600);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error || !data?.user) {
        throw new Error("Login failed");
      }

      // Re-validate session from server
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        throw new Error("Session validation failed");
      }

      // Strict role check
      const role = session.user?.user_metadata?.role;

      if (role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Unauthorized Access");
      }

      navigate("/admindashboard", { replace: true });

    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AnimatedGrid />
      <GlowOrb />
      <GlowOrb2 />

      <Card>
        <Logo>ADMIN PANEL</Logo>
        <Title>Secure Access Portal</Title>
        <Subtitle>Authentication required</Subtitle>

        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
            <Label>Email Address</Label>
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Label>Password</Label>
          </InputWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? "Verifying Access..." : "Access Dashboard"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}


/* ================== ANIMATIONS ================== */

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-40px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 20px rgba(0,255,255,0.2); }
  50% { box-shadow: 0 0 50px rgba(0,255,255,0.6); }
  100% { box-shadow: 0 0 20px rgba(0,255,255,0.2); }
`;

/* ================== STYLES ================== */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #020617, #0f172a, #020617, #0b1120);
  background-size: 400% 400%;
  animation: ${gradientMove} 15s ease infinite;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

const AnimatedGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 1;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #00f5ff, transparent 70%);
  filter: blur(120px);
  opacity: 0.4;
  top: 10%;
  left: 10%;
  animation: ${float} 12s ease-in-out infinite;
`;

const GlowOrb2 = styled(GlowOrb)`
  background: radial-gradient(circle, #7c3aed, transparent 70%);
  top: 60%;
  left: 70%;
  animation-delay: 4s;
`;

const Card = styled.div`
  position: relative;
  z-index: 5;
  width: 95%;
  max-width: 420px;
  padding: 50px 40px;
  border-radius: 20px;
  backdrop-filter: blur(30px);
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255,255,255,0.08);
  animation: ${pulse} 6s ease-in-out infinite;
  transition: 0.4s ease;
`;

const Logo = styled.div`
  font-size: 0.8rem;
  letter-spacing: 4px;
  color: #00f5ff;
  text-transform: uppercase;
  margin-bottom: 15px;
  opacity: 0.8;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.6rem;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 35px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 0.95rem;
  transition: 0.3s ease;

  &:focus {
    border-color: #00f5ff;
    box-shadow: 0 0 20px rgba(0,245,255,0.4);
    outline: none;
  }
`;

const Label = styled.label`
  position: absolute;
  left: 14px;
  top: 14px;
  color: #64748b;
  font-size: 0.8rem;
  pointer-events: none;
  transition: 0.2s ease;

  ${Input}:focus + &,
  ${Input}:not(:placeholder-shown) + & {
    top: -8px;
    left: 10px;
    background: #0f172a;
    padding: 0 6px;
    font-size: 0.7rem;
    color: #00f5ff;
  }
`;

const Button = styled.button`
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  background: linear-gradient(135deg, #00f5ff, #7c3aed);
  color: #000;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,245,255,0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
