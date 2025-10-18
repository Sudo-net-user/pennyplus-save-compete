import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileSetup } from "@/components/ProfileSetup";
import { Dashboard } from "@/components/Dashboard";
import { Wallet, TrendingUp } from "lucide-react";

export interface SpendingCategory {
  name: string;
  amount: number;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  spending: SpendingCategory[];
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  link?: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "purchase" | "wishlist" | "donation";
  description: string;
  amount: number;
  timestamp: Date;
}

const Index = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [donationPercentage, setDonationPercentage] = useState(0);

  const addTransaction = (
    type: Transaction["type"],
    description: string,
    amount: number
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      description,
      amount,
      timestamp: new Date(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleProfileComplete = (profileData: UserProfile) => {
    setProfile(profileData);
    const totalSpending = profileData.spending.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    const savings = profileData.monthlyIncome - totalSpending;
    setCurrentSavings(savings);
    addTransaction("income", "Initial profile setup", profileData.monthlyIncome);
  };

  const calculateMonthlySavings = () => {
    if (!profile) return 0;
    const totalSpending = profile.spending.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    const donation = (profile.monthlyIncome * donationPercentage) / 100;
    return profile.monthlyIncome - totalSpending - donation;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-primary p-3 rounded-2xl shadow-glow">
                <Wallet className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Penny+
              </h1>
            </div>
            <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Take control of your finances, save smarter, compete better
            </p>
          </div>
          <ProfileSetup onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Dashboard
        profile={profile}
        setProfile={setProfile}
        currentSavings={currentSavings}
        setCurrentSavings={setCurrentSavings}
        wishlist={wishlist}
        setWishlist={setWishlist}
        transactions={transactions}
        addTransaction={addTransaction}
        calculateMonthlySavings={calculateMonthlySavings}
        donationPercentage={donationPercentage}
        setDonationPercentage={setDonationPercentage}
      />
    </div>
  );
};

export default Index;
