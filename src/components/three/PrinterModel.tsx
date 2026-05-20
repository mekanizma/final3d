"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Group } from "three";

function PrinterPlaceholder() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[2.2, 0.15, 2.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Frame */}
      <mesh position={[-0.9, 0.2, -0.9]}>
        <boxGeometry args={[0.08, 2, 0.08]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.9, 0.2, -0.9]}>
        <boxGeometry args={[0.08, 2, 0.08]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.9, 0.2, 0.9]}>
        <boxGeometry args={[0.08, 2, 0.08]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.9, 0.2, 0.9]}>
        <boxGeometry args={[0.08, 2, 0.08]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>
      {/* Print bed */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[1.6, 0.05, 1.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Gantry */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Nozzle head */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0.3, 0.1, 0.3]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            distort={0.2}
            speed={2}
          />
        </mesh>
      </Float>
      {/* Printing object */}
      <Float speed={1.5} floatIntensity={0.3}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.4, 6]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function PrinterModel() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#a855f7" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color="#06b6d4"
        />
        <PrinterPlaceholder />
      </Canvas>
    </div>
  );
}
