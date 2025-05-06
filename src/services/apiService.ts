
// This file handles API requests to fetch cryptocurrency data

// CoinGecko API endpoints
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Map our internal IDs to CoinGecko IDs
const coinGeckoIdMap: Record<string, string> = {
  'bitcoin': 'bitcoin',
  'ethereum': 'ethereum',
  'solana': 'solana',
  'ripple': 'ripple',
  'cardano': 'cardano',
  'polkadot': 'polkadot',
  'dogecoin': 'dogecoin',
  'chainlink': 'chainlink',
};

/**
 * Fetches current prices for all cryptocurrencies
 */
export const fetchCryptoPrices = async () => {
  try {
    const ids = Object.values(coinGeckoIdMap).join(',');
    const response = await fetch(`${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrency data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return [];
  }
};

/**
 * Gets historical price data for a specific cryptocurrency
 */
export const fetchHistoricalData = async (coinId: string, days = 30) => {
  try {
    const geckoId = coinGeckoIdMap[coinId] || coinId;
    const response = await fetch(`${COINGECKO_API_BASE}/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
    
    const data = await response.json();
    return data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1]
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return [];
  }
};

