
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "@/hooks/use-theme";

function CoinGroup() {
  return (
    <>
      <Coin position={[-2, 0, 0]} rotation={[0, 0, 0]} color="#f7931a" scale={1} /> {/* Bitcoin */}
      <Coin position={[2, 0, 0]} rotation={[0, 0, 0]} color="#627eea" scale={0.8} /> {/* Ethereum */}
      <Coin position={[0, 2, 0]} rotation={[0, 0, 0]} color="#00FFA3" scale={0.7} /> {/* Solana */}
      <Coin position={[0, -2, 0]} rotation={[0, 0, 0]} color="#9b87f5" scale={0.9} /> {/* Generic */}
      <Coin position={[0, 0, 2]} rotation={[0, 0, 0]} color="#e6007a" scale={0.6} /> {/* Polkadot */}
    </>
  );
}

type CoinProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: number;
};

function Coin({ position, rotation, color, scale }: CoinProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function FloatingCoins() {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <CoinGroup />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
