
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionChart } from "@/components/crypto/PredictionChart";
import { cryptocurrencies } from "@/services/cryptoService";
import { getHistoricalChartData, generatePredictionData } from "@/services/cryptoService";

type CryptoDataItem = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume?: number;
  image?: string | null;
};

const Prediction = () => {
  const [cryptoData, setCryptoData] = useState<CryptoDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCryptoId, setSelectedCryptoId] = useState("bitcoin");
  const [historicalData, setHistoricalData] = useState<{ date: string; price: number }[]>([]);
  const [predictionData, setPredictionData] = useState<ReturnType<typeof generatePredictionData>>([]);

  useEffect(() => {
    // Set initial crypto data
    setCryptoData(cryptocurrencies);
    
    // Get historical and prediction data for the default selection
    loadCryptoData("bitcoin");
    setLoading(false);
  }, []);

  const loadCryptoData = async (id: string) => {
    setLoading(true);
    try {
      const historicalData = await getHistoricalChartData(id, 90);
      const predictionData = generatePredictionData(id, 14);
      
      setHistoricalData(historicalData);
      setPredictionData(predictionData);
    } catch (error) {
      console.error("Error loading crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoChange = (value: string) => {
    setSelectedCryptoId(value);
    loadCryptoData(value);
  };

  const selectedCrypto = cryptoData.find(c => c.id === selectedCryptoId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">AI Price Predictions</h1>
          <p className="text-muted-foreground mb-8">Forecast cryptocurrency prices with our advanced AI models</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">Price Forecast</CardTitle>
                      <CardDescription>
                        AI-powered price predictions for the next 14 days
                      </CardDescription>
                    </div>
                    <div className="w-full md:w-64">
                      <Select value={selectedCryptoId} onValueChange={handleCryptoChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoData.map(crypto => (
                            <SelectItem key={crypto.id} value={crypto.id}>
                              {crypto.name} ({crypto.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="flex justify-center items-center h-[350px]">
                      <p>Loading chart data...</p>
                    </div>
                  ) : selectedCrypto && (
                    <PredictionChart
                      symbol={selectedCrypto.symbol}
                      name={selectedCrypto.name}
                      historicalData={historicalData}
                      predictedData={predictionData}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Prediction Model</h3>
                      <p className="text-sm text-muted-foreground">LSTM Neural Network with Time Series Analysis</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Training Data</h3>
                      <p className="text-sm text-muted-foreground">5 years of historical price, volume, and social sentiment data</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Model Confidence</h3>
                      <div className="bg-secondary h-2.5 rounded-full mb-1">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">72% accuracy in backtesting</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Factors Considered</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Price action patterns</li>
                        <li>Trading volume changes</li>
                        <li>Market sentiment analysis</li>
                        <li>On-chain metrics</li>
                        <li>Cross-market correlations</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground italic">
                        Please note: These predictions are generated for informational purposes only and should not be considered as financial advice. Cryptocurrency markets are highly volatile and unpredictable.
                      </p>
                    </div>
                  </div>
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

export default Prediction;
