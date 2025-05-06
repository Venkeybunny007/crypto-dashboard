
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Mesh } from "three";

function CoinMesh() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <MeshDistortMaterial
        color="#9b87f5"
        speed={2}
        distort={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function CryptoLogo() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CoinMesh />
    </Canvas>
  );
}
