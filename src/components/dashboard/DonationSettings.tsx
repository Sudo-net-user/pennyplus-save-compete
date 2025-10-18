import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/pages/Index";

interface DonationSettingsProps {
  donationPercentage: number;
  setDonationPercentage: (percentage: number) => void;
  monthlyIncome: number;
  currentSavings: number;
  setCurrentSavings: (savings: number) => void;
  addTransaction: (type: Transaction["type"], description: string, amount: number) => void;
}

export const DonationSettings = ({
  donationPercentage,
  setDonationPercentage,
  monthlyIncome,
  currentSavings,
  setCurrentSavings,
  addTransaction,
}: DonationSettingsProps) => {
  const { toast } = useToast();
  const [inputPercentage, setInputPercentage] = useState(donationPercentage.toString());

  const donationAmount = (monthlyIncome * donationPercentage) / 100;

  const handleSave = () => {
    const percentage = parseFloat(inputPercentage);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast({
        title: "Invalid percentage",
        description: "Please enter a percentage between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setDonationPercentage(percentage);
    
    toast({
      title: "Donation settings updated!",
      description: `You'll donate ${percentage}% of your monthly income`,
    });
  };

  const handleDonate = () => {
    if (donationAmount <= 0) {
      toast({
        title: "No donation set",
        description: "Please set a donation percentage first",
        variant: "destructive",
      });
      return;
    }

    if (currentSavings < donationAmount) {
      toast({
        title: "Insufficient savings",
        description: `You need $${(donationAmount - currentSavings).toFixed(2)} more to donate`,
        variant: "destructive",
      });
      return;
    }

    setCurrentSavings(currentSavings - donationAmount);
    addTransaction(
      "donation",
      `Donated ${donationPercentage}% to help children in warzones`,
      donationAmount
    );

    toast({
      title: "Thank you for your generosity! ❤️",
      description: `$${donationAmount.toFixed(2)} donated to help children in need`,
    });
  };

  return (
    <Card className="border-2 shadow-md border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive" />
          Charitable Giving
        </CardTitle>
        <CardDescription>
          Donate a percentage of your monthly income to help children in warzones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Donation</p>
              <p className="text-2xl font-bold text-destructive">
                ${donationAmount.toLocaleString()}
              </p>
            </div>
            <Heart className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="donation-percentage">Donation Percentage (%)</Label>
          <div className="flex gap-2">
            <Input
              id="donation-percentage"
              type="number"
              placeholder="5"
              value={inputPercentage}
              onChange={(e) => setInputPercentage(e.target.value)}
              min="0"
              max="100"
              step="0.5"
            />
            <Button onClick={handleSave} variant="outline">
              Save
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {donationPercentage}% of ${monthlyIncome.toLocaleString()} = $
            {donationAmount.toLocaleString()}
          </p>
        </div>

        <Button
          onClick={handleDonate}
          className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:opacity-90 transition-opacity"
          disabled={donationAmount <= 0 || currentSavings < donationAmount}
        >
          <Heart className="w-4 h-4 mr-2" />
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );
};
