import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { UserProfile, SpendingCategory } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [spending, setSpending] = useState<SpendingCategory[]>([
    { name: "Food", amount: 0 },
    { name: "Rent", amount: 0 },
    { name: "Utilities", amount: 0 },
  ]);

  const addCategory = () => {
    setSpending([...spending, { name: "", amount: 0 }]);
  };

  const removeCategory = (index: number) => {
    setSpending(spending.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof SpendingCategory, value: string | number) => {
    const updated = [...spending];
    updated[index] = { ...updated[index], [field]: value };
    setSpending(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      toast({
        title: "Income required",
        description: "Please enter a valid monthly income",
        variant: "destructive",
      });
      return;
    }

    const validSpending = spending.filter(
      (cat) => cat.name.trim() && cat.amount > 0
    );

    if (validSpending.length === 0) {
      toast({
        title: "Spending categories required",
        description: "Please add at least one spending category",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      name: name.trim(),
      monthlyIncome: parseFloat(monthlyIncome),
      spending: validSpending,
    });

    toast({
      title: "Profile created!",
      description: `Welcome to Penny+, ${name}! Let's start saving.`,
    });
  };

  return (
    <Card className="border-2 shadow-lg animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Create Your Profile
        </CardTitle>
        <CardDescription className="text-base">
          Tell us about your income and spending to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income ($)</Label>
            <Input
              id="income"
              type="number"
              placeholder="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              min="0"
              step="0.01"
              className="text-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Monthly Spending Categories</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCategory}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </div>

            <div className="space-y-3">
              {spending.map((category, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Category name"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={category.amount || ""}
                      onChange={(e) =>
                        updateCategory(index, "amount", parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeCategory(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full text-lg py-6 bg-gradient-primary hover:opacity-90 transition-opacity">
            Start Managing Your Finances
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
