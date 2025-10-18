import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown, ShoppingBag, Target, Heart } from "lucide-react";
import { Transaction } from "@/pages/Index";
import { format } from "date-fns";
import { formatIndianCurrency } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const getIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "income":
        return <TrendingUp className="w-4 h-4" />;
      case "expense":
        return <TrendingDown className="w-4 h-4" />;
      case "purchase":
        return <ShoppingBag className="w-4 h-4" />;
      case "wishlist":
        return <Target className="w-4 h-4" />;
      case "donation":
        return <Heart className="w-4 h-4" />;
    }
  };

  const getVariant = (type: Transaction["type"]) => {
    switch (type) {
      case "income":
        return "default";
      case "expense":
        return "secondary";
      case "purchase":
        return "outline";
      case "wishlist":
        return "default";
      case "donation":
        return "destructive";
    }
  };

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant={getVariant(transaction.type)} className="gap-1">
                    {getIcon(transaction.type)}
                    {transaction.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(transaction.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatIndianCurrency(transaction.amount).replace("₹", "")}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
