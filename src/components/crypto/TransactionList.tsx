
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  amount: number;
  symbol: string;
  price: number;
  total: number;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${tx.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    {tx.type === "buy" ? (
                      <ArrowDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {tx.type === "buy" ? "Bought" : "Sold"} {tx.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {tx.type === "buy" ? "+" : "-"}{tx.amount.toLocaleString()} {tx.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${tx.total.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No transactions yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
