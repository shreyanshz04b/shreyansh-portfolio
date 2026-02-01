import React, { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import styled, { keyframes } from "styled-components";
import * as THREE from "three";

/* ================= Subtle Developer Background ================= */

function SpaceParticles() {
  const particlesRef = useRef();

  const particlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 8000; i++) {
      positions.push(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        Math.random() * 200 - 100
      );
    }
    return new Float32Array(positions);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particlesRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particlePositions}
          count={particlePositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#0ea5e9" />
    </points>
  );
}

/* ================= Main Services ================= */

function Services() {
  const services = [
    "Web Design",
    "Web Development",
    "WordPress Development",
    "UI/UX Interface Systems",
    "Graphic Design",
    "Technical Documentation",
    "PowerPoint Presentations",
    "Professional Email Writing",
    "Copywriting",
    "Data Processing & Excel Automation",
    "Certificate Design",
    "Content Editing",
  ];

  return (
    <Section>
      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.15 }}
        camera={{ position: [0, 0, 50], fov: 75 }}
      >
        <ambientLight intensity={0.4} />
        <Stars radius={80} depth={40} count={1000} factor={3} />
        <Suspense fallback={null}>
          <SpaceParticles />
        </Suspense>
      </Canvas>

      <Container>
        <Header>
          <h2>Services</h2>
          <p>Professional digital solutions and development services.</p>
        </Header>

        <CardGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <CardTitle>{service}</CardTitle>
            </ServiceCard>
          ))}
        </CardGrid>
      </Container>
    </Section>
  );
}

export default Services;

/* ================= STYLES ================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 120px 0 80px 0;
  background: #0b1120;
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  width: 92%;
  max-width: 1200px;
  margin: auto;
  z-index: 2;
`;

const Header = styled.div`
  margin-bottom: 50px;

  h2 {
    font-size: 2rem;
    color: #ffffff;
    font-weight: 600;
  }

  p {
    color: #94a3b8;
    margin-top: 8px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
`;

const ServiceCard = styled.div`
  position: relative;
  background: linear-gradient(145deg, #111827, #0f172a);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 26px 20px;
  animation: ${fadeUp} 0.6s ease forwards;
  transition: all 0.4s cubic-bezier(.2,.8,.2,1);
  cursor: pointer;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow:
      0 20px 40px rgba(0,0,0,0.4),
      0 0 0 1px rgba(14,165,233,0.3);
    border-color: rgba(14,165,233,0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -120%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255,255,255,0.06),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 130%;
  }
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #cbd5e1;
`;
