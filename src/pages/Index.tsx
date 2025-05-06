
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CryptoCard } from "@/components/crypto/CryptoCard";
import { PriceChart } from "@/components/crypto/PriceChart";
import { WalletCard } from "@/components/crypto/WalletCard";
import { NewsCard } from "@/components/crypto/NewsCard";
import { TransactionList } from "@/components/crypto/TransactionList";
import FloatingCoins from "@/components/3d/FloatingCoins";
import { getCryptoData, generateHistoricalData, walletData, newsData, transactionHistory } from "@/services/cryptoService";
import { ThemeProvider } from "@/hooks/use-theme";

const Index = () => {
  const [cryptoData, setCryptoData] = useState<ReturnType<typeof getCryptoData>>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<(typeof cryptoData)[0] | null>(null);
  const [chartData, setChartData] = useState<{ timestamp: number; price: number }[]>([]);

  useEffect(() => {
    // Fetch crypto data
    const data = getCryptoData();
    setCryptoData(data);
    
    // Set default selected crypto to Bitcoin
    const bitcoin = data.find(crypto => crypto.id === 'bitcoin') || null;
    setSelectedCrypto(bitcoin);
    
    if (bitcoin) {
      const historicalData = generateHistoricalData(bitcoin.id);
      setChartData(historicalData);
    }
  }, []);

  const handleSelectCrypto = (crypto: typeof selectedCrypto) => {
    if (!crypto) return;
    
    setSelectedCrypto(crypto);
    const historicalData = generateHistoricalData(crypto.id);
    setChartData(historicalData);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-crypto-purple to-crypto-blue p-8 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="z-10 mb-6 md:mb-0">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Crypto Dashboard
                      </h1>
                      <p className="text-lg opacity-90 max-w-md">
                        Track, predict, and analyze cryptocurrencies with AI-powered insights and 3D visualizations.
                      </p>
                      <div className="flex flex-wrap gap-4 mt-6">
                        <Link 
                          to="/prediction"
                          className="bg-white text-crypto-purple rounded-lg px-5 py-2.5 font-medium transition-colors hover:bg-opacity-90"
                        >
                          AI Predictions
                        </Link>
                        <Link 
                          to="/wallet"
                          className="bg-white/20 text-white rounded-lg px-5 py-2.5 font-medium transition-colors hover:bg-white/30"
                        >
                          View Wallet
                        </Link>
                      </div>
                    </div>
                    <div className="w-52 h-52 md:w-64 md:h-64 relative">
                      <FloatingCoins />
                    </div>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-white opacity-10 rounded-full"></div>
                </div>
                
                {/* Price Chart */}
                {selectedCrypto && chartData.length > 0 && (
                  <PriceChart
                    symbol={selectedCrypto.symbol}
                    name={selectedCrypto.name}
                    data={chartData}
                  />
                )}
                
                {/* News Section */}
                <NewsCard news={newsData.slice(0, 3)} />
              </div>
              
              <div className="space-y-8">
                {/* Top Cryptocurrencies */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">All Cryptocurrencies</h2>
                  <div className="grid gap-4">
                    {cryptoData.map((crypto) => (
                      <CryptoCard
                        key={crypto.id}
                        name={crypto.name}
                        symbol={crypto.symbol}
                        price={crypto.price}
                        change24h={crypto.change24h}
                        marketCap={crypto.marketCap}
                        volume={crypto.volume}
                        onClick={() => handleSelectCrypto(crypto)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Wallet Overview */}
                <WalletCard coins={walletData.coins} totalValue={walletData.totalValue} />
                
                {/* Recent Transactions */}
                <TransactionList transactions={transactionHistory} />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
