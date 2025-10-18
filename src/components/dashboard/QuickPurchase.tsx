import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/pages/Index";
import { formatIndianCurrency } from "@/lib/utils";

interface QuickPurchaseProps {
  currentSavings: number;
  setCurrentSavings: (savings: number) => void;
  addTransaction: (type: Transaction["type"], description: string, amount: number) => void;
}

export const QuickPurchase = ({
  currentSavings,
  setCurrentSavings,
  addTransaction,
}: QuickPurchaseProps) => {
  const { toast } = useToast();
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");

  const handlePurchase = () => {
    const amount = parseFloat(purchaseAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid purchase amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > currentSavings) {
      toast({
        title: "Insufficient funds",
        description: `You only have ${formatIndianCurrency(currentSavings)} in savings`,
        variant: "destructive",
      });
      return;
    }

    const description = purchaseDescription.trim() || "Quick purchase";
    setCurrentSavings(currentSavings - amount);
    addTransaction("purchase", description, amount);
    
    toast({
      title: "Purchase logged!",
      description: `${formatIndianCurrency(amount)} deducted from savings`,
    });

    setPurchaseAmount("");
    setPurchaseDescription("");
  };

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Quick Purchase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Available Savings</p>
          <p className="text-2xl font-bold text-success">
            {formatIndianCurrency(currentSavings)}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase-desc">What did you buy?</Label>
          <Input
            id="purchase-desc"
            placeholder="Coffee, groceries, etc."
            value={purchaseDescription}
            onChange={(e) => setPurchaseDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase-amount">Amount (₹)</Label>
          <Input
            id="purchase-amount"
            type="number"
            placeholder="0.00"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <Button
          onClick={handlePurchase}
          className="w-full bg-gradient-secondary hover:opacity-90 transition-opacity"
        >
          Log Purchase
        </Button>
      </CardContent>
    </Card>
  );
};
