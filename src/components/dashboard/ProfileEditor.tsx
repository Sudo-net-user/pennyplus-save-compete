import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, SpendingCategory, Transaction } from "@/pages/Index";

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  addTransaction: (type: Transaction["type"], description: string, amount: number) => void;
}

export const ProfileEditor = ({ profile, setProfile, addTransaction }: ProfileEditorProps) => {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome.toString());
  const [spending, setSpending] = useState<SpendingCategory[]>(profile.spending);

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

  const handleSave = () => {
    const income = parseFloat(monthlyIncome);

    if (!income || income <= 0) {
      toast({
        title: "Invalid income",
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

    const updatedProfile = {
      ...profile,
      monthlyIncome: income,
      spending: validSpending,
    };

    setProfile(updatedProfile);
    addTransaction("income", "Profile updated", income);

    toast({
      title: "Profile updated!",
      description: "Your financial information has been saved",
    });
  };

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="edit-income">Monthly Income (₹)</Label>
          <Input
            id="edit-income"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            min="0"
            step="0.01"
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

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
