
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoinModel from "@/components/3d/CoinModel";
import { useToast } from "@/hooks/use-toast";

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  coin?: {
    name: string;
    symbol: string;
    price: number;
  };
  onTransactionComplete: (amount: number, total: number) => void;
  maxAmount?: number;
};

export function TransactionModal({
  isOpen,
  onClose,
  type,
  coin,
  onTransactionComplete,
  maxAmount = Infinity
}: TransactionModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Early return with null if coin is undefined
  if (!coin) {
    return null;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only accept numbers with up to 8 decimal places
    if (/^\d*\.?\d{0,8}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const calculateTotal = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount * coin.price;
  };

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'sell' && numAmount > maxAmount) {
      toast({
        title: "Insufficient balance",
        description: `You can only sell up to ${maxAmount} ${coin.symbol}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      onTransactionComplete(numAmount, calculateTotal());
      toast({
        title: `${type === 'buy' ? 'Purchase' : 'Sale'} Complete`,
        description: `You've ${type === 'buy' ? 'bought' : 'sold'} ${numAmount} ${coin.symbol} for $${calculateTotal().toLocaleString()}`,
        variant: "default"
      });
      setAmount('');
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6">
              <CoinModel symbol={coin.symbol} size={24} />
            </div>
            {type === 'buy' ? 'Buy' : 'Sell'} {coin.name}
          </DialogTitle>
          <DialogDescription>
            Current price: ${coin.price.toLocaleString()} per {coin.symbol}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="flex-grow"
              />
              <span className="text-sm font-medium">{coin.symbol}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="total"
                value={calculateTotal().toFixed(2)}
                disabled
                className="flex-grow bg-muted"
              />
              <span className="text-sm font-medium">USD</span>
            </div>
          </div>

          {type === 'sell' && maxAmount !== Infinity && (
            <p className="text-sm text-muted-foreground">
              Available: {maxAmount} {coin.symbol}
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransaction} 
            disabled={isProcessing}
            className={type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
          >
            {isProcessing ? 'Processing...' : `${type === 'buy' ? 'Buy' : 'Sell'} ${coin.symbol}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
