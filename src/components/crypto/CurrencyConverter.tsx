
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CoinModel from "../3d/CoinModel";

type Currency = {
  code: string;
  name: string;
  symbol?: string;
  isCrypto?: boolean;
};

type CurrencyConverterProps = {
  cryptoCurrencies: Currency[];
  fiatCurrencies: Currency[];
  exchangeRates: Record<string, number>;
};

export function CurrencyConverter({ cryptoCurrencies, fiatCurrencies, exchangeRates }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("BTC");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    const fromRate = exchangeRates[fromCurrency] || 0;
    const toRate = exchangeRates[toCurrency] || 0;
    
    if (fromRate && toRate) {
      const conversion = (parseFloat(amount) * fromRate) / toRate;
      setResult(conversion);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  const getSymbol = (code: string): string => {
    const currency = [...cryptoCurrencies, ...fiatCurrencies].find(c => c.code === code);
    return currency?.symbol || code;
  };

  const formatAmount = (value: number): string => {
    if (value < 0.01) {
      return value.toFixed(8);
    } else {
      return value.toLocaleString(undefined, { maximumFractionDigits: 8 });
    }
  };

  const isCrypto = (code: string): boolean => {
    return cryptoCurrencies.some(c => c.code === code);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="any"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex gap-2 items-center">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="font-medium px-2 py-1 text-xs text-muted-foreground">Cryptocurrencies</div>
                    {cryptoCurrencies.map((currency) => (
                      <SelectItem key={`crypto-${currency.code}`} value={currency.code}>
                        <div className="flex items-center gap-2">
                          {isCrypto(currency.code) && (
                            <div className="w-5 h-5">
                              <CoinModel symbol={currency.code} size={20} />
                            </div>
                          )}
                          {currency.code} - {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                    
                    <div className="font-medium px-2 py-1 text-xs text-muted-foreground mt-2">Fiat Currencies</div>
                    {fiatCurrencies.map((currency) => (
                      <SelectItem key={`fiat-${currency.code}`} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              {isCrypto(fromCurrency) && (
                <div className="w-8 h-8">
                  <CoinModel symbol={fromCurrency} size={32} />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={handleSwap}>
              ⇅
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex gap-2 items-center">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="font-medium px-2 py-1 text-xs text-muted-foreground">Cryptocurrencies</div>
                    {cryptoCurrencies.map((currency) => (
                      <SelectItem key={`crypto-${currency.code}`} value={currency.code}>
                        <div className="flex items-center gap-2">
                          {currency.code} - {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                    
                    <div className="font-medium px-2 py-1 text-xs text-muted-foreground mt-2">Fiat Currencies</div>
                    {fiatCurrencies.map((currency) => (
                      <SelectItem key={`fiat-${currency.code}`} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              {isCrypto(toCurrency) && (
                <div className="w-8 h-8">
                  <CoinModel symbol={toCurrency} size={32} />
                </div>
              )}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleConvert}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Convert
          </Button>
          
          {result !== null && (
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm">Conversion Result:</p>
              <p className="text-xl font-bold">
                {formatAmount(parseFloat(amount))} {getSymbol(fromCurrency)} = {formatAmount(result)} {getSymbol(toCurrency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                1 {fromCurrency} = {formatAmount(exchangeRates[fromCurrency] / exchangeRates[toCurrency])} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
