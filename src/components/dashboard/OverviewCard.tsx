import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  pulse?: boolean;
}

export const OverviewCard = ({ title, value, icon: Icon, gradient, pulse }: OverviewCardProps) => {
  return (
    <Card className={cn("border-2 shadow-md transition-all hover:shadow-lg", pulse && "animate-pulse-glow")}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("p-2 rounded-lg", gradient)}>
            <Icon className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};
