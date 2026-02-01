import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
  startTransition,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Html } from "@react-three/drei";
import styled from "styled-components";
import * as THREE from "three";
import { supabase } from "../supabaseClient";

/* ================= STATIC BASE SKILLS ================= */

const staticSkills = [
  { skill_name: "Java", proficiency: 85, category: "backend" },
  { skill_name: "Python", proficiency: 90, category: "ai" },
  { skill_name: "C", proficiency: 40, category: "backend" },
  { skill_name: "JavaScript", proficiency: 70, category: "frontend" },
  { skill_name: "Node.js", proficiency: 65, category: "backend" },
  { skill_name: "React.js", proficiency: 81, category: "frontend" },
  { skill_name: "Nmap", proficiency: 40, category: "security" },
  { skill_name: "MySql", proficiency: 75, category: "database" },
  { skill_name: "MongoDb", proficiency: 35, category: "database" },
  { skill_name: "MS Office", proficiency: 80, category: "misc" },
  { skill_name: "n8n", proficiency: 60, category: "automation" },
  { skill_name: "github", proficiency: 60, category: "misc" },
  { skill_name: "wordpress", proficiency: 70, category: "misc" },
  { skill_name: "Canva", proficiency: 80, category: "misc" },
];

/* ================= FETCH + MERGE ================= */

function useSkills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();

    const channel = supabase
      .channel("skills-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        () => fetchSkills()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*");
    const dbSkills = data || [];

    const merged = [
      ...staticSkills.filter(
        (s) =>
          !dbSkills.some(
            (d) =>
              d.skill_name.toLowerCase() ===
              s.skill_name.toLowerCase()
          )
      ),
      ...dbSkills,
    ];

    setSkills(merged);
  };

  return skills;
}

/* ================= BACKGROUND ================= */

const HologramGrid = () => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0007;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[90, 64, 64]} />
      <meshBasicMaterial
        wireframe
        color="#00f5ff"
        opacity={0.05}
        transparent
      />
    </mesh>
  );
};

/* ================= SKILL NODE ================= */

const SkillNode = ({ skill, position, onClick }) => {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  const proficiency = (skill.proficiency || 60) / 100;

  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  const colorMap = {
    frontend: "#00f5ff",
    backend: "#7c3aed",
    security: "#ff004c",
    ai: "#00ff88",
    default: "#38bdf8",
  };

  const color =
    colorMap[skill.category?.toLowerCase()] ||
    colorMap.default;

  return (
    <group
      position={position}
      onClick={() =>
        startTransition(() => {
          onClick(skill);
        })
      }
    >
      <mesh>
        <ringGeometry
          args={[2.5, 2.8, 32, 1, 0, Math.PI * 2 * proficiency]}
        />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Text
        ref={textRef}
        fontSize={1.8}
        color={hovered ? "#ffffff" : color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {skill.skill_name}
      </Text>
    </group>
  );
};

/* ================= FIBONACCI DISTRIBUTION ================= */

function generateSpherePositions(count, radius = 45) {
  const positions = [];
  if (!count) return positions;

  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    positions.push([x * radius, y * radius, z * radius]);
  }

  return positions;
}

/* ================= MAIN ================= */

export default function SkillUniverse() {
  const skills = useSkills();
  const [activeSkill, setActiveSkill] = useState(null);

  const positions = useMemo(
    () => generateSpherePositions(skills.length),
    [skills.length]
  );

  return (
    <Container>
      <Canvas camera={{ position: [0, 0, 120], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[50, 50, 50]} intensity={1} />

        <Suspense
          fallback={
            <Html center>
              <Loading>Loading Skills...</Loading>
            </Html>
          }
        >
          <Stars
            radius={300}
            depth={80}
            count={3000}
            factor={4}
            fade
          />

          <HologramGrid />

          {skills.map((skill, i) => (
            <SkillNode
              key={i}
              skill={skill}
              position={positions[i]}
              onClick={setActiveSkill}
            />
          ))}
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          enableZoom
        />
      </Canvas>

      {activeSkill && (
        <SkillHUD>
          <h2>{activeSkill.skill_name}</h2>
          <p>Category: {activeSkill.category}</p>
          <p>Proficiency: {activeSkill.proficiency}%</p>
          <button
            onClick={() =>
              startTransition(() => {
                setActiveSkill(null);
              })
            }
          >
            Close
          </button>
        </SkillHUD>
      )}
    </Container>
  );
}

/* ================= STYLES ================= */

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: radial-gradient(
    circle at center,
    #0a0f1f 0%,
    #000 90%
  );
  position: relative;
`;

const SkillHUD = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 30px;
  background: rgba(10, 15, 31, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  color: white;
  text-align: center;
  min-width: 300px;
`;

const Loading = styled.div`
  color: #00f5ff;
  font-size: 1.2rem;
`;
