
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletCard } from "@/components/crypto/WalletCard";
import { TransactionList } from "@/components/crypto/TransactionList";
import { walletData, transactionHistory } from "@/services/cryptoService";
import { Button } from "@/components/ui/button";
import CoinModel from "@/components/3d/CoinModel";

const Wallet = () => {
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
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">${walletData.totalValue.toLocaleString()}</div>
                    <p className="text-xs text-green-500">+2.5% (24h)</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{walletData.coins.length}</div>
                    <p className="text-xs text-muted-foreground">Cryptocurrencies</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Best Performer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">
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
                        </tr>
                      </thead>
                      <tbody>
                        {walletData.coins.map((coin) => (
                          <tr key={coin.symbol} className="border-b last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8">
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
                        {transactionHistory.map((tx) => (
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
              <WalletCard coins={walletData.coins.slice(0, 4)} totalValue={walletData.totalValue} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex flex-col h-auto py-4">
                      <span className="text-lg">↓</span>
                      <span>Buy</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4">
                      <span className="text-lg">↑</span>
                      <span>Sell</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4">
                      <span className="text-lg">⟷</span>
                      <span>Swap</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4">
                      <span className="text-lg">↗</span>
                      <span>Send</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary/10 border-primary/20">
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
                  
                  <Button className="w-full mt-4" variant="outline">View Full Analysis</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
