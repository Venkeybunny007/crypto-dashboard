// Import the API service to fetch real-time data
import { fetchCryptoPrices, fetchHistoricalData as fetchAPIHistoricalData } from './apiService';

// Sample data for cryptocurrencies
export const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', rank: 3 },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP', rank: 4 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', rank: 5 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', rank: 6 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', rank: 7 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', rank: 8 }
];

// Sample price data (fallback if API fails)
export const cryptoPrices = {
  'bitcoin': 57320.42,
  'ethereum': 3120.15,
  'solana': 124.32,
  'ripple': 0.542,
  'cardano': 0.39,
  'polkadot': 6.12,
  'dogecoin': 0.12,
  'chainlink': 14.25,
};

// Sample 24h price change data
export const cryptoChanges = {
  'bitcoin': 2.5,
  'ethereum': -0.8,
  'solana': 5.2,
  'ripple': 1.3,
  'cardano': -2.1,
  'polkadot': 0.4,
  'dogecoin': 12.5,
  'chainlink': -1.6,
};

// Sample market cap data
export const cryptoMarketCaps = {
  'bitcoin': 1075000000000,
  'ethereum': 375000000000,
  'solana': 50000000000,
  'ripple': 25000000000,
  'cardano': 18000000000,
  'polkadot': 12000000000,
  'dogecoin': 10000000000,
  'chainlink': 8000000000,
};

// Sample 24h volume data
export const cryptoVolumes = {
  'bitcoin': 42000000000,
  'ethereum': 20000000000,
  'solana': 3000000000,
  'ripple': 2000000000,
  'cardano': 1500000000,
  'polkadot': 800000000,
  'dogecoin': 2500000000,
  'chainlink': 1000000000,
};

// Generate historical price data for a given cryptocurrency
export const generateHistoricalData = async (id: string, days = 30) => {
  try {
    // Try to fetch data from API first
    const apiData = await fetchAPIHistoricalData(id, days);
    if (apiData && apiData.length > 0) {
      return apiData;
    }
  } catch (error) {
    console.error('Error fetching historical data, falling back to mock data:', error);
  }
  
  // Fallback to mock data
  const basePrice = cryptoPrices[id as keyof typeof cryptoPrices] || 100;
  const volatility = id === 'bitcoin' ? 0.03 : id === 'ethereum' ? 0.05 : 0.08;
  const data = [];
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random price movement but with a trend
    const trend = Math.sin(i / 10) * volatility * basePrice;
    const randomChange = (Math.random() - 0.5) * volatility * basePrice;
    
    // Calculate price based on the current base price, trend, and random change
    const price = basePrice + trend + randomChange;
    
    data.push({
      timestamp: date.getTime(),
      price: price
    });
  }
  
  return data;
};

// Generate prediction data based on historical data
export const generatePredictionData = (id: string, days = 14) => {
  const basePrice = cryptoPrices[id as keyof typeof cryptoPrices] || 100;
  const volatility = id === 'bitcoin' ? 0.04 : id === 'ethereum' ? 0.06 : 0.1;
  const data = [];
  
  const now = new Date();
  let lastPrice = basePrice;
  
  // Generate future prediction data
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Generate a price with some randomness but following a trend
    const trend = Math.cos(i / 5) * 0.01 * lastPrice;
    const randomChange = (Math.random() - 0.48) * volatility * lastPrice / 10;
    
    const prediction = lastPrice + trend + randomChange;
    const uncertainty = volatility * prediction * (i / days); // Uncertainty increases with time
    
    data.push({
      date: date.toLocaleDateString(),
      prediction: prediction,
      lowerBound: prediction - uncertainty,
      upperBound: prediction + uncertainty
    });
    
    lastPrice = prediction;
  }
  
  return data;
};

// Get formatted historical data for charts
export const getHistoricalChartData = (id: string, days = 30) => {
  const data = generateHistoricalData(id, days);
  return data.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString(),
    price: d.price
  }));
};

// Exchange rates for currency converter
export const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.12,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.89,
  CNY: 7.23,
  INR: 83.42,
  BTC: 0.000017,
  ETH: 0.00032,
  SOL: 0.0081,
  XRP: 1.85,
  ADA: 2.56,
  DOT: 0.16,
  DOGE: 8.33,
  LINK: 0.07,
};

// Fiat currencies for converter
export const fiatCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

// Sample wallet data
export const walletData = {
  totalValue: 15420.35,
  coins: [
    { name: 'Bitcoin', symbol: 'BTC', amount: 0.18, value: 10317.68, percentage: 66.91 },
    { name: 'Ethereum', symbol: 'ETH', amount: 1.25, value: 3900.19, percentage: 25.29 },
    { name: 'Solana', symbol: 'SOL', amount: 5.5, value: 683.76, percentage: 4.43 },
    { name: 'Ripple', symbol: 'XRP', amount: 250, value: 135.50, percentage: 0.88 },
    { name: 'Cardano', symbol: 'ADA', amount: 750, value: 292.50, percentage: 1.90 },
    { name: 'Polkadot', symbol: 'DOT', amount: 15, value: 91.80, percentage: 0.60 },
  ]
};

// Sample transaction history
export const transactionHistory = [
  { 
    id: 't1', 
    date: '2023-05-02', 
    type: 'buy' as const, 
    amount: 0.05, 
    symbol: 'BTC', 
    price: 56420.15, 
    total: 2821.01 
  },
  { 
    id: 't2', 
    date: '2023-04-28', 
    type: 'buy' as const, 
    amount: 0.75, 
    symbol: 'ETH', 
    price: 2980.25, 
    total: 2235.19 
  },
  { 
    id: 't3', 
    date: '2023-04-25', 
    type: 'sell' as const, 
    amount: 0.02, 
    symbol: 'BTC', 
    price: 55210.40, 
    total: 1104.21 
  },
  { 
    id: 't4', 
    date: '2023-04-20', 
    type: 'buy' as const, 
    amount: 5.5, 
    symbol: 'SOL', 
    price: 118.75, 
    total: 653.13 
  },
  { 
    id: 't5', 
    date: '2023-04-15', 
    type: 'buy' as const, 
    amount: 250, 
    symbol: 'XRP', 
    price: 0.52, 
    total: 130.00 
  },
];

// Sample news data
export const newsData = [
  {
    id: 'n1',
    title: 'Bitcoin Surges Above $57,000 as Institutional Interest Grows',
    url: '#',
    source: 'CryptoNews',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    publishedAt: '2023-05-05T14:30:00Z',
    summary: 'Bitcoin hit a new monthly high as large institutions continue to invest in cryptocurrency assets.'
  },
  {
    id: 'n2',
    title: 'Ethereum Upgrade Coming Next Month, Promises Lower Gas Fees',
    url: '#',
    source: 'BlockchainDaily',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    publishedAt: '2023-05-04T10:15:00Z',
    summary: 'The Ethereum network is preparing for a significant upgrade that aims to reduce transaction costs.'
  },
  {
    id: 'n3',
    title: 'Solana Becomes Third Largest Smart Contract Platform by DeFi TVL',
    url: '#',
    source: 'CryptoPanic',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    publishedAt: '2023-05-03T16:45:00Z',
    summary: 'Solana has surpassed Binance Smart Chain to become the third largest blockchain by total value locked.'
  },
  {
    id: 'n4',
    title: 'New Regulatory Framework for Crypto Assets Proposed by SEC',
    url: '#',
    source: 'CoinTelegraph',
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    publishedAt: '2023-05-02T09:20:00Z',
    summary: 'The Securities and Exchange Commission has outlined new regulatory guidelines for cryptocurrency assets.'
  },
  {
    id: 'n5',
    title: 'Major Bank Launches Cryptocurrency Custody Service for Institutional Clients',
    url: '#',
    source: 'Bloomberg Crypto',
    imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    publishedAt: '2023-05-01T12:10:00Z',
    summary: 'One of the world\'s largest banks has announced a new service to help institutional clients store digital assets.'
  },
];

// Type definition for transactions
export type Transaction = {
  id: string;
  date: string;
  type: "buy" | "sell";
  amount: number;
  symbol: string;
  price: number;
  total: number;
};

// Get cryptocurrency data with prices and other metrics from the API
export const getCryptoData = async () => {
  try {
    // Fetch real-time data from the API
    const apiData = await fetchCryptoPrices();
    
    if (apiData && apiData.length > 0) {
      return cryptocurrencies.map(crypto => {
        const coinData = apiData.find((item: any) => item.id === crypto.id) || {};
        
        return {
          ...crypto,
          price: coinData.current_price || cryptoPrices[crypto.id as keyof typeof cryptoPrices] || 0,
          change24h: coinData.price_change_percentage_24h || (cryptoChanges[crypto.id as keyof typeof cryptoChanges] || 0),
          marketCap: coinData.market_cap || cryptoMarketCaps[crypto.id as keyof typeof cryptoMarketCaps] || 0,
          volume: coinData.total_volume || cryptoVolumes[crypto.id as keyof typeof cryptoVolumes] || 0,
          image: coinData.image || null
        };
      });
    }
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
  }
  
  // Fallback to mock data if API fails
  return cryptocurrencies.map(crypto => ({
    ...crypto,
    price: cryptoPrices[crypto.id as keyof typeof cryptoPrices] || 0,
    change24h: cryptoChanges[crypto.id as keyof typeof cryptoChanges] || 0,
    marketCap: cryptoMarketCaps[crypto.id as keyof typeof cryptoMarketCaps] || 0,
    volume: cryptoVolumes[crypto.id as keyof typeof cryptoVolumes] || 0,
    image: null
  }));
};
