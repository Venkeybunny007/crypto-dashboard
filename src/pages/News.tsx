
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsItem } from "@/components/crypto/NewsCard";
import { newsData } from "@/services/cryptoService";
import { useState } from "react";

// Generate more news data from the existing ones
const generateMoreNews = (): NewsItem[] => {
  const baseNews = [...newsData];
  
  // Duplicate news but with different IDs and slightly modified titles
  const moreNews: NewsItem[] = [];
  
  for (let i = 1; i <= 3; i++) {
    baseNews.forEach((news, index) => {
      const modifiers = [
        "Breaking: ",
        "Analysis: ",
        "Opinion: ",
        "Market Update: ",
        "Expert View: "
      ];
      
      moreNews.push({
        ...news,
        id: `news-${i}-${index}`,
        title: `${modifiers[Math.floor(Math.random() * modifiers.length)]}${news.title}`,
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  }
  
  return [...baseNews, ...moreNews];
};

const News = () => {
  const allNews = generateMoreNews();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "all") return matchesSearch;
    
    // Mock filtering by category based on title keywords
    const categoryKeywords: Record<string, string[]> = {
      "bitcoin": ["bitcoin", "btc"],
      "ethereum": ["ethereum", "eth"],
      "defi": ["defi", "yield", "swap", "liquidity"],
      "nft": ["nft", "collectible"],
      "regulation": ["regulation", "sec", "regulatory", "law"]
    };
    
    const matchesCategory = categoryKeywords[categoryFilter]?.some(keyword => 
      news.title.toLowerCase().includes(keyword) || news.summary.toLowerCase().includes(keyword)
    ) || false;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Cryptocurrency News</h1>
          <p className="text-muted-foreground mb-8">Stay updated with the latest crypto news and market insights</p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="nft">NFTs</SelectItem>
                      <SelectItem value="regulation">Regulation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-video w-full">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{item.source}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-medium text-lg line-clamp-2 mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                    </CardContent>
                  </a>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg font-medium">No news articles found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
