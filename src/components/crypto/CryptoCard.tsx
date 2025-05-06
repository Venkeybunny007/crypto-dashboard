
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
  onClick?: () => void;
};

export function CryptoCard({
  name,
  symbol,
  price,
  change24h,
  marketCap,
  volume,
  onClick,
}: CryptoCardProps) {
  const isPositiveChange = change24h >= 0;
  
  return (
    <Card 
      className="overflow-hidden hover-lift cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CoinModel symbol={symbol} size={40} />
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-xs text-muted-foreground">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">${price.toLocaleString()}</p>
            <div className={`flex items-center justify-end text-xs ${isPositiveChange ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {isPositiveChange ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(change24h).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
          <div>
            <p>Market Cap</p>
            <p className="font-medium text-foreground">${marketCap.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p>24h Volume</p>
            <p className="font-medium text-foreground">${volume.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
