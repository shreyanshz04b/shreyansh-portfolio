import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

/* ================= 3D MODEL ================= */

const RotatingModel = () => {
  const [isPending, startTransition] = useTransition();
  const [fbxModel, setFbxModel] = useState(null);
  const modelRef = useRef();

  useEffect(() => {
    startTransition(() => {
      const loader = new FBXLoader();
      loader.load('/assets/model4.fbx', (model) => {
        model.scale.set(0.018, 0.018, 0.018);
        setFbxModel(model);
      });
    });
  }, []);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.004;
      modelRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  if (!fbxModel)
    return (
      <Html center>
        <LoadingText>Initializing 3D Experience...</LoadingText>
      </Html>
    );

  return <primitive object={fbxModel} ref={modelRef} />;
};

const LoadingText = styled.div`
  color: #00f5ff;
  font-size: 1.2rem;
`;

/* ================= HOME ================= */

function Home() {
  const contentRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      if (contentRef.current) {
        contentRef.current.style.transform =
          `translate(${x * 0.2}px, ${y * 0.2}px)`;
      }

      if (imageRef.current) {
        imageRef.current.style.transform =
          `translate(${x * 0.4}px, ${y * 0.4}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <HomeSection>

      <BackgroundGlow />

      <CanvasWrapper>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <Stars radius={100} depth={60} count={4000} factor={4} />
          <RotatingModel />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </CanvasWrapper>

      <Content ref={contentRef}>
        <Badge>Full Stack Developer</Badge>

        <Title>
          Shreyansh <GradientText>Agarwal</GradientText>
        </Title>

        <Subtitle>
          Web Developer · Digital Marketing Analyst · Graphic Designer
        </Subtitle>

        <ButtonGroup>
          <PrimaryButton
            onClick={() =>
              window.open(
                'https://drive.google.com/file/d/1OsprCgqqO_5b2WLldpuP-etNUX_PeDml/view?usp=sharing',
                '_blank'
              )
            }
          >
            View Resume
          </PrimaryButton>

          <GlassButton
            onClick={() =>
              window.open(
                'https://linkedin.com/in/shreyanshagarwalceo',
                '_blank'
              )
            }
          >
            Connect
          </GlassButton>
        </ButtonGroup>
      </Content>

      <ImageSection ref={imageRef}>
        <img src="/assets/shreyansh.png" alt="portfolio" />
      </ImageSection>

    </HomeSection>
  );
}

export default Home;

/* ================= ANIMATIONS ================= */

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

/* ================= STYLES ================= */

const HomeSection = styled.section`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 20% 30%, #0a0f1f, #000);
  display: flex;
  align-items: center;
  padding: 0 8%;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0,255,255,0.18), transparent 70%);
  top: 15%;
  left: 10%;
  filter: blur(120px);
  animation: ${float} 8s ease-in-out infinite;
  z-index: 0;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  max-width: 600px;

  display: flex;
  flex-direction: column;
  align-items: center;   /* Center badge + title properly */
  text-align: center;    /* Perfect horizontal alignment */

  @media (max-width: 900px) {
    margin: 0 auto;
  }
`;


const Badge = styled.div`
  display: inline-block;
  padding: 6px 14px;
  font-size: 0.75rem;
  border-radius: 30px;
  background: rgba(0,255,255,0.1);
  border: 1px solid rgba(0,255,255,0.4);
  color: #00f5ff;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: white;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(90deg,#00f5ff,#0077ff,#00f5ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShift} 3s linear infinite;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  margin: 20px 0 30px 0;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  background: linear-gradient(135deg,#00f5ff,#0077ff);
  color: #000;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,255,255,0.4);
  }
`;

const GlassButton = styled.button`
  padding: 12px 28px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const ImageSection = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  img {
    width: 380px;
    max-height: 480px;
    object-fit: contain;
    animation: ${float} 6s ease-in-out infinite;
  }

  /* Large screens */
  @media (max-width: 1200px) {
    img {
      width: 320px;
      max-height: 420px;
    }
  }

  /* Tablet */
  @media (max-width: 900px) {
    margin-top: 50px;

    img {
      width: 65%;
      max-height: 400px;
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    img {
      width: 75%;
      max-height: 350px;
    }
  }
`;
