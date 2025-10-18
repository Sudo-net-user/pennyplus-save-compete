import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, Target, History, Award, Heart, Settings } from "lucide-react";
import { OverviewCard } from "./dashboard/OverviewCard";
import { SpendingChart } from "./dashboard/SpendingChart";
import { QuickPurchase } from "./dashboard/QuickPurchase";
import { WishlistManager } from "./dashboard/WishlistManager";
import { TransactionHistory } from "./dashboard/TransactionHistory";
import { Leaderboard } from "./dashboard/Leaderboard";
import { DonationSettings } from "./dashboard/DonationSettings";
import { ProfileEditor } from "./dashboard/ProfileEditor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile, WishlistItem, Transaction } from "@/pages/Index";
import { formatIndianCurrency } from "@/lib/utils";

interface DashboardProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  currentSavings: number;
  setCurrentSavings: (savings: number) => void;
  wishlist: WishlistItem[];
  setWishlist: (wishlist: WishlistItem[]) => void;
  transactions: Transaction[];
  addTransaction: (type: Transaction["type"], description: string, amount: number) => void;
  calculateMonthlySavings: () => number;
  donationPercentage: number;
  setDonationPercentage: (percentage: number) => void;
}

export const Dashboard = ({
  profile,
  setProfile,
  currentSavings,
  setCurrentSavings,
  wishlist,
  setWishlist,
  transactions,
  addTransaction,
  calculateMonthlySavings,
  donationPercentage,
  setDonationPercentage,
}: DashboardProps) => {
  const monthlySavings = calculateMonthlySavings();
  const totalSpending = profile.spending.reduce((sum, cat) => sum + cat.amount, 0);
  const donationAmount = (profile.monthlyIncome * donationPercentage) / 100;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-muted-foreground mt-1">Your financial overview</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="bg-gradient-primary p-3 rounded-2xl shadow-glow">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OverviewCard
            title="Monthly Income"
            value={formatIndianCurrency(profile.monthlyIncome)}
            icon={TrendingUp}
            gradient="bg-gradient-primary"
          />
          <OverviewCard
            title="Total Spending"
            value={formatIndianCurrency(totalSpending)}
            icon={Wallet}
            gradient="bg-gradient-secondary"
          />
          <OverviewCard
            title="Monthly Savings"
            value={formatIndianCurrency(monthlySavings)}
            icon={Target}
            gradient="bg-gradient-success"
          />
          <OverviewCard
            title="Current Savings"
            value={formatIndianCurrency(currentSavings)}
            icon={Award}
            gradient="bg-gradient-gold"
            pulse
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1 bg-card">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Target className="w-4 h-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Award className="w-4 h-4" />
              Top Savers
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart spending={profile.spending} />
              <QuickPurchase
                currentSavings={currentSavings}
                setCurrentSavings={setCurrentSavings}
                addTransaction={addTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistManager
              wishlist={wishlist}
              setWishlist={setWishlist}
              monthlySavings={monthlySavings}
              currentSavings={currentSavings}
              setCurrentSavings={setCurrentSavings}
              addTransaction={addTransaction}
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard currentUser={profile.name} monthlySavings={monthlySavings} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory transactions={transactions} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileEditor profile={profile} setProfile={setProfile} addTransaction={addTransaction} />
            <DonationSettings
              donationPercentage={donationPercentage}
              setDonationPercentage={setDonationPercentage}
              monthlyIncome={profile.monthlyIncome}
              currentSavings={currentSavings}
              setCurrentSavings={setCurrentSavings}
              addTransaction={addTransaction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
