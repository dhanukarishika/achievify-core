import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating sphere component
const FloatingSphere = ({ position, color, speed, scale }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(time * speed * 0.5) * 0.3;
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.6}
        distort={0.3}
        speed={2}
        roughness={0.4}
      />
    </Sphere>
  );
};

// Particle field
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Mouse interaction
const InteractiveLights = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(time * 0.5) * 5;
      lightRef.current.position.z = Math.cos(time * 0.5) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={lightRef} position={[0, 0, 5]} intensity={1} color="#88bbff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#cc88ff" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#88ffcc" />
    </>
  );
};

// Main scene
const Scene = () => {
  return (
    <>
      <InteractiveLights />
      <ParticleField />
      
      {/* Floating spheres with different colors */}
      <FloatingSphere position={[-3, 0, -2]} color="#88ccff" speed={0.5} scale={1} />
      <FloatingSphere position={[3, 1, -3]} color="#cc88ff" speed={0.7} scale={0.8} />
      <FloatingSphere position={[0, -2, -4]} color="#88ffcc" speed={0.6} scale={1.2} />
      <FloatingSphere position={[-2, 2, -1]} color="#ffcc88" speed={0.8} scale={0.7} />
      <FloatingSphere position={[2, -1, -5]} color="#ff88cc" speed={0.4} scale={0.9} />
    </>
  );
};

const AnimatedBackground3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ 
          background: 'linear-gradient(to bottom, hsl(210, 70%, 8%), hsl(180, 60%, 12%))',
        }}
      >
        <fog attach="fog" args={['#0a1628', 5, 20]} />
        <Scene />
      </Canvas>
      {/* Subtle overlay for comfort */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30 pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground3D;
