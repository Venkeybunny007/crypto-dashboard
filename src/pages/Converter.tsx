
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CurrencyConverter } from "@/components/crypto/CurrencyConverter";
import { cryptocurrencies, fiatCurrencies, exchangeRates } from "@/services/cryptoService";

const Converter = () => {
  const cryptoCurrencies = cryptocurrencies.map(crypto => ({
    code: crypto.symbol,
    name: crypto.name,
    isCrypto: true
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
          <p className="text-muted-foreground mb-8">Convert between cryptocurrencies and fiat currencies</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CurrencyConverter 
                cryptoCurrencies={cryptoCurrencies}
                fiatCurrencies={fiatCurrencies}
                exchangeRates={exchangeRates}
              />
            </div>
            
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h2 className="font-semibold text-xl mb-4">About Currency Converter</h2>
                <div className="space-y-4 text-sm">
                  <p>
                    Our advanced currency converter allows you to quickly convert between major cryptocurrencies and fiat currencies with real-time rates.
                  </p>
                  <p>
                    The exchange rates are updated regularly from multiple reliable sources to ensure accuracy. The converter supports all major cryptocurrencies and fiat currencies.
                  </p>
                  <p>
                    For large transactions or recurring currency exchanges, we recommend checking rates across multiple platforms and considering the fees involved.
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h2 className="font-semibold text-xl mb-4">Popular Conversions</h2>
                <ul className="space-y-2">
                  <li className="hover:bg-muted/50 p-2 rounded transition-colors">
                    <button className="w-full text-left">
                      <div className="flex justify-between">
                        <span>1 BTC to USD</span>
                        <span className="font-medium">${(1 / exchangeRates.BTC).toLocaleString()}</span>
                      </div>
                    </button>
                  </li>
                  <li className="hover:bg-muted/50 p-2 rounded transition-colors">
                    <button className="w-full text-left">
                      <div className="flex justify-between">
                        <span>1 ETH to USD</span>
                        <span className="font-medium">${(1 / exchangeRates.ETH).toLocaleString()}</span>
                      </div>
                    </button>
                  </li>
                  <li className="hover:bg-muted/50 p-2 rounded transition-colors">
                    <button className="w-full text-left">
                      <div className="flex justify-between">
                        <span>1 SOL to USD</span>
                        <span className="font-medium">${(1 / exchangeRates.SOL).toLocaleString()}</span>
                      </div>
                    </button>
                  </li>
                  <li className="hover:bg-muted/50 p-2 rounded transition-colors">
                    <button className="w-full text-left">
                      <div className="flex justify-between">
                        <span>1000 USD to BTC</span>
                        <span className="font-medium">{(1000 * exchangeRates.BTC).toFixed(8)} BTC</span>
                      </div>
                    </button>
                  </li>
                  <li className="hover:bg-muted/50 p-2 rounded transition-colors">
                    <button className="w-full text-left">
                      <div className="flex justify-between">
                        <span>1 ETH to BTC</span>
                        <span className="font-medium">{(exchangeRates.ETH / exchangeRates.BTC).toFixed(8)} BTC</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Converter;
