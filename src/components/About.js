import React from "react";
import styled, { keyframes } from "styled-components";

/* ================= COMPONENT ================= */

function About() {
  return (
    <Section id="abouts">
      <BackgroundGlow />
      <GridOverlay />

      <Container>
        <Left>
          <Title>About Me</Title>
          <Subtitle>
            Building scalable digital systems with precision, creativity, and performance in mind.
          </Subtitle>

          <Description>
            I am a passionate Web Developer focused on crafting high-performance,
            visually immersive, and technically optimized web experiences.
            My expertise spans frontend architecture, backend integration,
            cloud connectivity, and interactive 3D environments.
          </Description>

          <Stats>
            <StatCard>
              <h3>5+</h3>
              <p>Idea Executed</p>
            </StatCard>

            <StatCard>
              <h3>10+</h3>
              <p>Major Projects</p>
            </StatCard>

            <StatCard>
              <h3>Full Stack</h3>
              <p>Development</p>
            </StatCard>
          </Stats>
        </Left>

        <Right>
          <SkillGrid>
            <Skill>React / Next.js</Skill>
            <Skill>Supabase</Skill>
            <Skill>Three.js</Skill>
            <Skill>Node.js</Skill>
            <Skill>Cyber Security</Skill>
            <Skill>WordPress Deployment</Skill>
            <Skill>UI/UX Systems</Skill>
            <Skill>Digital Marketing</Skill>
          </SkillGrid>
        </Right>
      </Container>
    </Section>
  );
}

export default About;

/* ================= ANIMATIONS ================= */

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ================= STYLES ================= */

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 100px 8%;
  background: linear-gradient(-45deg, #0b1120, #0f172a, #111827, #0b1120);
  background-size: 400% 400%;
  animation: ${gradientMove} 18s ease infinite;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #0ea5e9, transparent 70%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  filter: blur(140px);
  opacity: 0.3;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  width: 100%;
  max-width: 1300px;
  margin: auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  animation: ${fadeUp} 0.8s ease forwards;
`;

const Right = styled.div`
  animation: ${fadeUp} 1s ease forwards;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #00f5ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 25px;
  max-width: 550px;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 600px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: rgba(15,23,42,0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 20px 25px;
  min-width: 120px;
  text-align: center;
  transition: all 0.3s ease;

  h3 {
    font-size: 1.4rem;
    color: #00f5ff;
  }

  p {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0,245,255,0.3);
  }
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
`;

const Skill = styled.div`
  padding: 18px;
  border-radius: 14px;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(15px);
  text-align: center;
  font-weight: 600;
  color: #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(124,58,237,0.3);
  }
`;
