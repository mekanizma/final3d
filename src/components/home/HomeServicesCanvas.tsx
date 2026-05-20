"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group } from "three";

/** Arka plan sahnesi — tarama (torus knot) + dijital mesh + baskı katmanı */
function ServicesScene() {
  const root = useRef<Group>(null);
  const meshRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.08;
    if (meshRef.current) meshRef.current.rotation.y -= delta * 0.15;
  });

  return (
    <group ref={root}>
      <Sparkles
        count={120}
        scale={[14, 8, 6]}
        position={[0, 0.5, 0]}
        size={2.2}
        speed={0.35}
        color="#e879f9"
        opacity={0.55}
      />
      <Sparkles
        count={80}
        scale={[10, 5, 8]}
        position={[0, -0.3, 0]}
        size={1.6}
        speed={0.5}
        color="#22d3ee"
        opacity={0.45}
      />

      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh position={[-1.35, 0.15, 0.2]}>
          <torusKnotGeometry args={[0.42, 0.14, 96, 12]} />
          <meshStandardMaterial
            color="#0e7490"
            emissive="#22d3ee"
            emissiveIntensity={0.85}
            metalness={0.92}
            roughness={0.12}
          />
        </mesh>
      </Float>

      <group ref={meshRef} position={[1.25, 0.1, -0.15]}>
        <mesh>
          <icosahedronGeometry args={[0.52, 1]} />
          <meshStandardMaterial
            color="#581c87"
            emissive="#a855f7"
            emissiveIntensity={0.55}
            metalness={0.75}
            roughness={0.22}
            wireframe
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.38, 0]} />
          <MeshDistortMaterial
            color="#c026d3"
            emissive="#e879f9"
            emissiveIntensity={0.45}
            metalness={0.6}
            roughness={0.25}
            distort={0.28}
            speed={1.6}
          />
        </mesh>
      </group>

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh position={[0.1, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.02, 32, 100]} />
          <meshStandardMaterial
            color="#334155"
            emissive="#22d3ee"
            emissiveIntensity={0.35}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </Float>

      <pointLight position={[4, 3, 4]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-4, 1, -3]} intensity={0.85} color="#e879f9" />
      <spotLight
        position={[0, 6, 2]}
        angle={0.45}
        penumbra={0.85}
        intensity={1.1}
        color="#f0abfc"
        castShadow={false}
      />
      <ambientLight intensity={0.18} />
    </group>
  );
}

export function HomeServicesCanvas() {
  return (
    <div className="absolute inset-0 h-[min(420px,55vh)] sm:h-[min(480px,50vh)] w-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ServicesScene />
      </Canvas>
    </div>
  );
}
