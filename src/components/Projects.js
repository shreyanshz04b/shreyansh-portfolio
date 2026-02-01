import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import styled from "styled-components";
import * as THREE from "three";
import { supabase } from "../supabaseClient";

/* ================= 3D Developer Background ================= */

const DevEnvironment = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      <Stars radius={80} depth={50} count={1500} factor={3} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh>
          <torusGeometry args={[8, 0.2, 16, 100]} />
          <meshStandardMaterial
            color="#1f2937"
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    </>
  );
};

/* ================= MAIN COMPONENT ================= */

function Projects() {
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setFetchedProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return fetchedProjects.filter((proj) =>
      proj.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [fetchedProjects, search]);

  const featuredProject = filteredProjects[0];

  return (
    <Container>

      {/* Professional 3D Background */}
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.12,
        }}
      >
        <Suspense fallback={null}>
          <DevEnvironment />
        </Suspense>
      </Canvas>

      <Content>

        <HeaderSection>
          <h2>Projects</h2>
          <p>Selected work and technical implementations.</p>

          <SearchInput
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </HeaderSection>

        {/* Featured Project */}
        {!loading && featuredProject && (
          <FeaturedCard>
            <FeaturedLabel>Featured Project</FeaturedLabel>
            <h3>{featuredProject.title}</h3>
            <p>{featuredProject.description}</p>
            {featuredProject.github_url && (
              <a
                href={featuredProject.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Source →
              </a>
            )}
          </FeaturedCard>
        )}

        <ProjectList>

          {/* ================= YOUR HARDCODED PROJECTS (NOT DELETED) ================= */}

          <ProjectCard>
            <ProjectText>Hireflix</ProjectText>
            <GitHubLink href="https://github.com/shreyanshz04b/hireflix" target="_blank">
              View Source Code
            </GitHubLink>
            <ProjectDescription>
              Ease the process of interviews for freshers using HTML, CSS, JS, API integration, MySQL, and PHP.
            </ProjectDescription>
            <TechStack>HTML, CSS, JS, MySQL, PHP</TechStack>
          </ProjectCard>
          <ProjectCard>
  <ProjectText>Stock Prediction</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/cothon-solutions/blob/main/stock%20prediction.ipynb"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Stock price prediction using Python and machine learning algorithms.
  </ProjectDescription>
  <TechStack>Python, Machine Learning</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Animal Species Detection</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/cothon-solutions/blob/main/animalprediction.ipynb"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Deep learning model to classify and detect animal species from images.
  </ProjectDescription>
  <TechStack>Python, TensorFlow</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Lane Line Detection</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/cothon-solutions/blob/main/lanedetect.ipynb"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Computer vision system to detect lane boundaries in road images.
  </ProjectDescription>
  <TechStack>Python, OpenCV, Machine Learning</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Face Recognition</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/cothon-solutions/blob/main/facerecognisation.ipynb"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Face recognition system using deep learning and image processing techniques.
  </ProjectDescription>
  <TechStack>Python, OpenCV, Deep Learning</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>URL Screenshot</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/company-projects/tree/main/url-to-screenshot"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Web utility to capture automated screenshots of URLs.
  </ProjectDescription>
  <TechStack>HTML, CSS, JavaScript</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Diabetes Prediction</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/healtcare/tree/main/umesh"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Predictive healthcare model to detect diabetes risk using machine learning.
  </ProjectDescription>
  <TechStack>Python, Flask, Machine Learning</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Organization Location Tracker</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/PROJECTS/blob/main/OrgTrack.py"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    System to track and visualize organization locations using mapping APIs.
  </ProjectDescription>
  <TechStack>Python, Google Maps API</TechStack>
</ProjectCard>

<ProjectCard>
  <ProjectText>Cyber Branch Tracker</ProjectText>
  <GitHubLink
    href="https://github.com/shreyanshz04b/PROJECTS/blob/main/OrgTrack.py"
    target="_blank"
    rel="noopener noreferrer"
  >
    View Source Code
  </GitHubLink>
  <ProjectDescription>
    Analytical tool to track cyber branches using ML and geolocation services.
  </ProjectDescription>
  <TechStack>Python, Machine Learning, Google Maps API</TechStack>
</ProjectCard>


          {/* Keep all your other hardcoded project cards exactly here same as before */}

          {/* ================= SUPABASE PROJECTS ================= */}

          {!loading &&
            filteredProjects.map((proj) => (
              <ProjectCard key={proj.id}>
                <ProjectText>{proj.title}</ProjectText>

                {proj.github_url && (
                  <GitHubLink
                    href={proj.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source Code
                  </GitHubLink>
                )}

                <ProjectDescription>{proj.description}</ProjectDescription>
                <TechStack>{proj.tech_stack}</TechStack>
              </ProjectCard>
            ))}
        </ProjectList>

      </Content>
    </Container>
  );
}

export default Projects;


/* ================= STYLES ================= */

const Container = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 120px 0 80px 0;
  background: #0b1120;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  width: 92%;
  max-width: 1200px;
  margin: auto;
  z-index: 2;
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;

  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #ffffff;
  }

  p {
    color: #94a3b8;
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 350px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: #111827;
  color: #cbd5e1;

  &:focus {
    border-color: #0ea5e9;
    outline: none;
  }
`;

const FeaturedCard = styled.div`
  background: linear-gradient(135deg, #111827, #0f172a);
  border: 1px solid rgba(14,165,233,0.4);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #ffffff;
    margin-bottom: 8px;
  }

  p {
    color: #cbd5e1;
  }

  a {
    color: #38bdf8;
    text-decoration: none;
  }
`;

const FeaturedLabel = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #38bdf8;
  margin-bottom: 8px;
`;

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  position: relative;
  background: linear-gradient(145deg, #111827, #0f172a);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 20px;
  overflow: hidden;
  cursor: pointer;

  transition: 
    transform 0.4s cubic-bezier(.2,.8,.2,1),
    box-shadow 0.4s ease,
    border 0.4s ease;

  /* Subtle 3D lift */
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 40px rgba(0,0,0,0.4),
      0 0 0 1px rgba(56,189,248,0.3);
    border-color: rgba(56,189,248,0.4);
  }

  /* Swipe Light Effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255,255,255,0.08),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 130%;
  }

  /* Glow edge animation */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 14px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(14,165,233,0.4),
      rgba(56,189,248,0.2),
      transparent
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ProjectText = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`;

const GitHubLink = styled.a`
  font-size: 0.8rem;
  color: #38bdf8;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectDescription = styled.p`
  font-size: 0.85rem;
  color: #cbd5e1;
  margin-bottom: 8px;
`;

const TechStack = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
`;
