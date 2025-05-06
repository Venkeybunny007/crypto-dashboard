
import { Card, CardContent } from "@/components/ui/card";
import CoinModel from "../3d/CoinModel";
import { ArrowDown, ArrowUp } from "lucide-react";

type CryptoCardProps = {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  image?: string | null;
  onClick?: () => void;
};

export function CryptoCard({
  name,
  symbol,
  price,
  change24h,
  marketCap,
  volume,
  image,
  onClick,
}: CryptoCardProps) {
  const isPositiveChange = change24h >= 0;
  
  return (
    <Card 
      className="overflow-hidden hover-lift cursor-pointer transition-all hover:shadow-md perspective-container min-w-[240px] max-w-[270px]" 
      onClick={onClick}
    >
      <CardContent className="p-4 coin-3d">
        <div className="flex flex-col items-center">
          <div className="relative mb-3 mt-2">
            {image ? (
              <img 
                src={image} 
                alt={`${name} logo`} 
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const nextSibling = target.nextElementSibling as HTMLElement | null;
                  if (nextSibling) {
                    nextSibling.style.display = 'block';
                  }
                }}
              />
            ) : null}
            <div className={image ? "hidden" : "block"}>
              <CoinModel symbol={symbol} size={64} />
            </div>
          </div>
          
          <div className="text-center mb-2">
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground uppercase">{symbol}</p>
          </div>
          
          <div className="text-center mb-2">
            <p className="font-medium">${price?.toLocaleString() || "0"}</p>
            <div className={`flex items-center justify-center text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(change24h).toFixed(2)}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full text-xs text-muted-foreground">
            <div>
              <p>Market Cap</p>
              <p className="font-medium text-foreground">${marketCap?.toLocaleString() || "0"}</p>
            </div>
            <div className="text-right">
              <p>24h Volume</p>
              <p className="font-medium text-foreground">${volume?.toLocaleString() || "0"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
