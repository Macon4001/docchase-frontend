'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Phone shape for Client
function PhoneShape({ hovered }: { hovered: boolean }) {
  return (
    <group>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.6}
          roughness={0.3}
          emissive="#3b82f6"
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[0.7, 1.3, 0.01]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive="#60a5fa"
          emissiveIntensity={hovered ? 0.6 : 0.3}
        />
      </mesh>
      {/* Home button */}
      <mesh position={[0, -0.6, 0.051]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Robot/AI head for Amy AI
function RobotHead({ hovered }: { hovered: boolean }) {
  return (
    <group>
      {/* Head */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#a855f7"
          metalness={0.7}
          roughness={0.2}
          emissive="#a855f7"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.61]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={hovered ? 1.5 : 1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.3, 0.2, 0.61]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={hovered ? 1.5 : 1}
          toneMapped={false}
        />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#d946ef" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
}

// Document/Paper stack for Convert
function DocumentStack({ hovered }: { hovered: boolean }) {
  return (
    <group>
      {/* Paper sheets */}
      {[0, 0.05, 0.1].map((offset, idx) => (
        <mesh key={idx} position={[0, offset, 0]} rotation={[0, idx * 0.02, 0]} castShadow>
          <boxGeometry args={[1, 1.4, 0.02]} />
          <meshStandardMaterial
            color={idx === 2 ? "#f97316" : "#fed7aa"}
            metalness={0.1}
            roughness={0.8}
            emissive="#f97316"
            emissiveIntensity={hovered ? 0.3 : 0.05}
          />
        </mesh>
      ))}
      {/* Text lines */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.051]}>
          <boxGeometry args={[0.7, 0.08, 0.01]} />
          <meshStandardMaterial color="#9a3412" />
        </mesh>
      ))}
    </group>
  );
}

// Cloud shape for Drive
function CloudShape({ hovered }: { hovered: boolean }) {
  return (
    <group>
      {/* Main cloud body - larger center sphere */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Left puff */}
      <mesh position={[-0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Right puff */}
      <mesh position={[0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Top puff */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.3}
          roughness={0.4}
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
    </group>
  );
}

function FlowNode({ position, color, text, type, delay = 0 }: { position: [number, number, number]; color: string; text: string; type: string; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.2;

      // Hover effect
      const targetScale = hovered ? 1.15 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Gentle rotation
      groupRef.current.rotation.y += 0.003;
    }
  });

  const renderShape = () => {
    switch (type) {
      case 'phone':
        return <PhoneShape hovered={hovered} />;
      case 'robot':
        return <RobotHead hovered={hovered} />;
      case 'document':
        return <DocumentStack hovered={hovered} />;
      case 'cloud':
        return <CloudShape hovered={hovered} />;
      default:
        return <PhoneShape hovered={hovered} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {renderShape()}

        {/* Shadow plane */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>

        {/* Text label */}
        <Html position={[0, -1.8, 0]} center>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#212b38',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${color}20`
            }}
          >
            {text}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const lineRef = useRef<THREE.Line | null>(null);

  useFrame((state) => {
    if (lineRef.current) {
      // Animated glow
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#15a349', linewidth: 3, transparent: true, opacity: 0.6 }))} ref={lineRef} />
  );
}

function ParticleFlow({ start, end, delay = 0 }: { start: [number, number, number]; end: [number, number, number]; delay?: number }) {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const t = ((state.clock.elapsedTime + delay) % 3) / 3;

      // Lerp between start and end
      particleRef.current.position.x = start[0] + (end[0] - start[0]) * t;
      particleRef.current.position.y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.3;
      particleRef.current.position.z = start[2] + (end[2] - start[2]) * t;

      // Scale based on progress
      const scale = 0.1 + Math.sin(t * Math.PI) * 0.1;
      particleRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

function Scene() {
  const nodes: Array<{ position: [number, number, number]; color: string; text: string; type: string }> = [
    { position: [-4, 0, 0], color: '#3b82f6', text: 'Client', type: 'phone' },
    { position: [-1.5, 0.5, 0], color: '#a855f7', text: 'Amy AI', type: 'robot' },
    { position: [1.5, 0, 0], color: '#f97316', text: 'Convert', type: 'document' },
    { position: [4, 0.5, 0], color: '#10b981', text: 'Drive', type: 'cloud' }
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#15a349" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />

      {/* Flow Nodes */}
      {nodes.map((node, idx) => (
        <FlowNode
          key={idx}
          position={node.position}
          color={node.color}
          text={node.text}
          type={node.type}
          delay={idx * 0.5}
        />
      ))}

      {/* Connection Lines */}
      {nodes.slice(0, -1).map((node, idx) => (
        <ConnectionLine
          key={`line-${idx}`}
          start={node.position}
          end={nodes[idx + 1].position}
        />
      ))}

      {/* Animated Particles */}
      {nodes.slice(0, -1).map((node, idx) => (
        <ParticleFlow
          key={`particle-${idx}`}
          start={node.position}
          end={nodes[idx + 1].position}
          delay={idx * 1}
        />
      ))}

      {/* Environment */}
      <mesh position={[0, -2, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#d4fae2" transparent opacity={0.3} />
      </mesh>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function FlowScene3D() {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#e8fcf0']} />
        <fog attach="fog" args={['#e8fcf0', 5, 20]} />
        <Scene />
      </Canvas>
    </div>
  );
}
