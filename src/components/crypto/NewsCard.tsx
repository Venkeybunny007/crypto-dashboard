
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  imageUrl: string;
  publishedAt: string;
  summary: string;
};

type NewsCardProps = {
  news: NewsItem[];
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Latest Crypto News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="font-medium line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.summary}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
