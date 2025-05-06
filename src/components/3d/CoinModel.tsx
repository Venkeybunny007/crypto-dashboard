
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Mesh } from "three";

type CoinProps = {
  color: string;
  hover?: boolean;
};

function Coin({ color, hover = false }: CoinProps) {
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
        color={color}
        speed={2}
        distort={hover ? 0.5 : 0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

type CoinModelProps = {
  symbol: string;
  size?: number;
};

export default function CoinModel({ symbol, size = 60 }: CoinModelProps) {
  // Map crypto symbols to colors
  const getColor = (symbol: string) => {
    const colors: Record<string, string> = {
      BTC: "#f7931a",
      ETH: "#627eea",
      XRP: "#0f0e0e",
      SOL: "#00FFA3",
      ADA: "#0033ad",
      DOT: "#e6007a",
      DOGE: "#c3a634",
      default: "#9b87f5"
    };
    
    return colors[symbol] || colors.default;
  };
  
  return (
    <div style={{ width: size, height: size }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Coin color={getColor(symbol)} />
      </Canvas>
    </div>
  );
}
