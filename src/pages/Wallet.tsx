
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletCard } from "@/components/crypto/WalletCard";
import { TransactionList } from "@/components/crypto/TransactionList";
import { Button } from "@/components/ui/button";
import CoinModel from "@/components/3d/CoinModel";
import { walletData, transactionHistory, cryptocurrencies } from "@/services/cryptoService";
import { TransactionModal } from "@/components/crypto/TransactionModal";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const [userWallet, setUserWallet] = useState(walletData);
  const [transactions, setTransactions] = useState(transactionHistory);
  const [cashBalance, setCashBalance] = useState(10000); // Initial $10,000 in cash
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenBuyModal = (symbol: string) => {
    const coin = cryptocurrencies.find(c => c.symbol === symbol);
    if (coin) {
      setSelectedCoin(coin);
      setTransactionType('buy');
      setIsTransactionModalOpen(true);
    }
  };

  const handleOpenSellModal = (symbol: string) => {
    const coin = userWallet.coins.find(c => c.symbol === symbol);
    if (coin) {
      const marketCoin = cryptocurrencies.find(c => c.symbol === symbol);
      if (marketCoin) {
        setSelectedCoin({
          ...marketCoin,
          availableAmount: coin.amount
        });
        setTransactionType('sell');
        setIsTransactionModalOpen(true);
      }
    } else {
      toast({
        title: "Cannot sell",
        description: `You don't own any ${symbol}`,
        variant: "destructive"
      });
    }
  };

  const handleTransactionComplete = (amount: number, total: number) => {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();

    // Create new transaction record
    const newTransaction = {
      id: `tx-${Date.now()}`,
      type: transactionType,
      symbol: selectedCoin.symbol,
      amount,
      price: selectedCoin.price,
      total,
      date: `${dateString} ${timeString}`,
    };

    // Add to transaction history
    setTransactions([newTransaction, ...transactions]);

    if (transactionType === 'buy') {
      // Reduce cash balance
      setCashBalance(prev => prev - total);

      // Update wallet
      const existingCoin = userWallet.coins.find(c => c.symbol === selectedCoin.symbol);
      if (existingCoin) {
        // Update existing coin amount
        setUserWallet({
          ...userWallet,
          totalValue: userWallet.totalValue + total,
          coins: userWallet.coins.map(coin => 
            coin.symbol === selectedCoin.symbol 
              ? { 
                  ...coin, 
                  amount: coin.amount + amount,
                  value: coin.value + total,
                  percentage: ((coin.value + total) / (userWallet.totalValue + total)) * 100
                }
              : { 
                  ...coin,
                  percentage: (coin.value / (userWallet.totalValue + total)) * 100
                }
          )
        });
      } else {
        // Add new coin to wallet
        const newCoin = {
          name: selectedCoin.name,
          symbol: selectedCoin.symbol,
          amount,
          value: total,
          percentage: (total / (userWallet.totalValue + total)) * 100
        };
        
        setUserWallet({
          ...userWallet,
          totalValue: userWallet.totalValue + total,
          coins: [
            ...userWallet.coins.map(coin => ({
              ...coin,
              percentage: (coin.value / (userWallet.totalValue + total)) * 100
            })),
            newCoin
          ]
        });
      }
    } else {
      // Increase cash balance for sell
      setCashBalance(prev => prev + total);

      // Update wallet for sell
      const existingCoin = userWallet.coins.find(c => c.symbol === selectedCoin.symbol);
      if (existingCoin) {
        const updatedValue = existingCoin.value - total;
        const updatedAmount = existingCoin.amount - amount;
        
        if (updatedAmount <= 0) {
          // Remove coin completely if amount is zero
          const updatedCoins = userWallet.coins.filter(c => c.symbol !== selectedCoin.symbol);
          const updatedTotalValue = userWallet.totalValue - existingCoin.value;

          setUserWallet({
            ...userWallet,
            totalValue: updatedTotalValue,
            coins: updatedCoins.map(coin => ({
              ...coin,
              percentage: (coin.value / updatedTotalValue) * 100
            }))
          });
        } else {
          // Update coin amount and value
          const updatedTotalValue = userWallet.totalValue - total;
          
          setUserWallet({
            ...userWallet,
            totalValue: updatedTotalValue,
            coins: userWallet.coins.map(coin => 
              coin.symbol === selectedCoin.symbol 
                ? { 
                    ...coin, 
                    amount: updatedAmount,
                    value: updatedValue,
                    percentage: (updatedValue / updatedTotalValue) * 100
                  }
                : { 
                    ...coin,
                    percentage: (coin.value / updatedTotalValue) * 100
                  }
            )
          });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Wallet</h1>
          <p className="text-muted-foreground mb-8">Manage your cryptocurrency portfolio</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="transform hover:scale-105 transition-all perspective-container">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">${userWallet.totalValue.toLocaleString()}</div>
                    <p className="text-xs text-green-500">+2.5% (24h)</p>
                  </CardContent>
                </Card>
                
                <Card className="transform hover:scale-105 transition-all perspective-container">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Cash Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">${cashBalance.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Available for trading</p>
                  </CardContent>
                </Card>
                
                <Card className="transform hover:scale-105 transition-all perspective-container">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Best Performer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 float-animation">
                        <CoinModel symbol="SOL" size={24} />
                      </div>
                      <span className="text-2xl font-bold">SOL</span>
                    </div>
                    <p className="text-xs text-green-500">+5.2% (24h)</p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="portfolio">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="portfolio" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Portfolio</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Export</Button>
                      <Button size="sm">Add Assets</Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left pb-2">Asset</th>
                          <th className="text-right pb-2">Balance</th>
                          <th className="text-right pb-2">Price</th>
                          <th className="text-right pb-2">Value</th>
                          <th className="text-right pb-2">Allocation</th>
                          <th className="text-right pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userWallet.coins.map((coin) => (
                          <tr key={coin.symbol} className="border-b last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 float-animation">
                                  <CoinModel symbol={coin.symbol} size={32} />
                                </div>
                                <div>
                                  <p className="font-medium">{coin.name}</p>
                                  <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <p>{coin.amount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                            </td>
                            <td className="py-3 text-right">
                              ${(coin.value / coin.amount).toFixed(2)}
                            </td>
                            <td className="py-3 text-right">
                              ${coin.value.toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              {coin.percentage.toFixed(2)}%
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenBuyModal(coin.symbol)}
                                  className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/30"
                                >
                                  Buy
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenSellModal(coin.symbol)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"
                                >
                                  Sell
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="transactions" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <Button variant="outline" size="sm">Export CSV</Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left pb-2">Date</th>
                          <th className="text-left pb-2">Type</th>
                          <th className="text-left pb-2">Asset</th>
                          <th className="text-right pb-2">Amount</th>
                          <th className="text-right pb-2">Price</th>
                          <th className="text-right pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b last:border-0">
                            <td className="py-3">{tx.date}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6">
                                  <CoinModel symbol={tx.symbol} size={24} />
                                </div>
                                {tx.symbol}
                              </div>
                            </td>
                            <td className="py-3 text-right">{tx.amount.toLocaleString()} {tx.symbol}</td>
                            <td className="py-3 text-right">${tx.price.toLocaleString()}</td>
                            <td className="py-3 text-right">${tx.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-8">
              <WalletCard coins={userWallet.coins.slice(0, 4)} totalValue={userWallet.totalValue} />
              
              <Card className="perspective-container">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-auto py-4 coin-3d"
                      onClick={() => {
                        if (cryptocurrencies.length > 0) {
                          setSelectedCoin(cryptocurrencies[0]);
                          setTransactionType('buy');
                          setIsTransactionModalOpen(true);
                        }
                      }}
                    >
                      <span className="text-lg">↓</span>
                      <span>Buy</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-auto py-4 coin-3d"
                      onClick={() => {
                        if (userWallet.coins.length > 0) {
                          const coin = userWallet.coins[0];
                          const marketCoin = cryptocurrencies.find(c => c.symbol === coin.symbol);
                          if (marketCoin) {
                            setSelectedCoin({
                              ...marketCoin,
                              availableAmount: coin.amount
                            });
                            setTransactionType('sell');
                            setIsTransactionModalOpen(true);
                          }
                        } else {
                          toast({
                            title: "No coins to sell",
                            description: "Your wallet is empty",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <span className="text-lg">↑</span>
                      <span>Sell</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4 coin-3d">
                      <span className="text-lg">⟷</span>
                      <span>Swap</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4 coin-3d">
                      <span className="text-lg">↗</span>
                      <span>Send</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary/10 border-primary/20 perspective-container">
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Risk Level</p>
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary h-2 flex-1 rounded-full">
                          <div className="bg-yellow-500 h-2 w-3/5 rounded-full"></div>
                        </div>
                        <span className="text-sm">Medium</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Diversity</p>
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary h-2 flex-1 rounded-full">
                          <div className="bg-red-500 h-2 w-2/5 rounded-full"></div>
                        </div>
                        <span className="text-sm">Low</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Performance (30d)</p>
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary h-2 flex-1 rounded-full">
                          <div className="bg-green-500 h-2 w-4/5 rounded-full"></div>
                        </div>
                        <span className="text-sm">+12.4%</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 coin-3d" variant="outline">View Full Analysis</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {selectedCoin && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          type={transactionType}
          coin={selectedCoin}
          onTransactionComplete={handleTransactionComplete}
          maxAmount={selectedCoin.availableAmount}
        />
      )}
    </div>
  );
};

export default Wallet;
