import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Crown } from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";

interface LeaderboardProps {
  currentUser: string;
  monthlySavings: number;
}

interface LeaderboardEntry {
  name: string;
  savings: number;
  rank: number;
}

export const Leaderboard = ({ currentUser, monthlySavings }: LeaderboardProps) => {
  // Mock data for demonstration - in a real app, this would come from a backend
  const leaderboardData: LeaderboardEntry[] = [
    { name: currentUser, savings: monthlySavings, rank: 1 },
    { name: "Sarah Johnson", savings: 1200, rank: 2 },
    { name: "Michael Chen", savings: 980, rank: 3 },
    { name: "Emma Williams", savings: 850, rank: 4 },
    { name: "David Brown", savings: 720, rank: 5 },
  ].sort((a, b) => b.savings - a.savings);

  // Recalculate ranks after sorting
  leaderboardData.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-accent" />;
    if (rank === 2) return <Award className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-5 h-5 text-warning" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-gold";
    if (rank === 2) return "bg-muted";
    if (rank === 3) return "bg-gradient-secondary";
    return "bg-card";
  };

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Top Savers This Month
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((entry) => {
            const isCurrentUser = entry.name === currentUser;

            return (
              <div
                key={entry.name}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  isCurrentUser
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadge(
                    entry.rank
                  )}`}
                >
                  {getRankIcon(entry.rank) || entry.rank}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{entry.name}</p>
                    {isCurrentUser && (
                      <Badge variant="default" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Monthly Savings
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-success">
                    {formatIndianCurrency(entry.savings)}
                  </p>
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-center text-muted-foreground">
            Compete with friends to save more! Invite them to join Penny+ and see who can
            save the most each month. 🏆
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
