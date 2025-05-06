
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoinModel from "../3d/CoinModel";
import { Progress } from "@/components/ui/progress";

type WalletCoin = {
  name: string;
  symbol: string;
  amount: number;
  value: number;
  percentage: number;
};

type WalletCardProps = {
  coins: WalletCoin[];
  totalValue: number;
};

export function WalletCard({ coins, totalValue }: WalletCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Wallet Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          ${totalValue.toLocaleString()}
        </div>
        
        <div className="space-y-4">
          {coins.map((coin) => (
            <div key={coin.symbol} className="flex items-center gap-3">
              <CoinModel symbol={coin.symbol} size={32} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {coin.amount.toLocaleString()} {coin.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${coin.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{coin.percentage.toFixed(2)}%</p>
                  </div>
                </div>
                <Progress value={coin.percentage} className="h-1 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
