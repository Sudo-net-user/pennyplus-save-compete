import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WishlistItem, Transaction } from "@/pages/Index";

interface WishlistManagerProps {
  wishlist: WishlistItem[];
  setWishlist: (wishlist: WishlistItem[]) => void;
  monthlySavings: number;
  currentSavings: number;
  setCurrentSavings: (savings: number) => void;
  addTransaction: (type: Transaction["type"], description: string, amount: number) => void;
}

export const WishlistManager = ({
  wishlist,
  setWishlist,
  monthlySavings,
  currentSavings,
  setCurrentSavings,
  addTransaction,
}: WishlistManagerProps) => {
  const { toast } = useToast();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const addItem = () => {
    const price = parseFloat(itemPrice);
    
    if (!itemName.trim()) {
      toast({
        title: "Item name required",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    if (!price || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const searchQuery = encodeURIComponent(itemName);
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      price,
      link: `https://www.google.com/search?q=${searchQuery}+buy+online`,
    };

    setWishlist([...wishlist, newItem]);
    addTransaction("wishlist", `Added ${itemName} to wishlist`, price);
    
    toast({
      title: "Item added!",
      description: `${itemName} added to your wishlist`,
    });

    setItemName("");
    setItemPrice("");
  };

  const removeItem = (id: string) => {
    const item = wishlist.find((i) => i.id === id);
    setWishlist(wishlist.filter((i) => i.id !== id));
    
    if (item) {
      toast({
        title: "Item removed",
        description: `${item.name} removed from wishlist`,
      });
    }
  };

  const markAsBought = (item: WishlistItem) => {
    if (currentSavings < item.price) {
      toast({
        title: "Insufficient savings",
        description: `You need $${(item.price - currentSavings).toFixed(2)} more`,
        variant: "destructive",
      });
      return;
    }

    setCurrentSavings(currentSavings - item.price);
    addTransaction("purchase", `Bought ${item.name} from wishlist`, item.price);
    removeItem(item.id);
    
    toast({
      title: "Congratulations!",
      description: `You bought ${item.name}! 🎉`,
    });
  };

  const calculateMonthsToAfford = (price: number) => {
    if (monthlySavings <= 0) return Infinity;
    return Math.ceil(price / monthlySavings);
  };

  const calculateProgress = (price: number) => {
    return Math.min((currentSavings / price) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Add to Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                placeholder="New laptop, vacation, etc."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Price ($)</Label>
              <Input
                id="item-price"
                type="number"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <Button
            onClick={addItem}
            className="w-full bg-gradient-success hover:opacity-90 transition-opacity gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlist.map((item) => {
          const months = calculateMonthsToAfford(item.price);
          const progress = calculateProgress(item.price);
          const canAfford = currentSavings >= item.price;

          return (
            <Card key={item.id} className="border-2 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {months === Infinity
                      ? "Save more first!"
                      : `${months} month${months > 1 ? "s" : ""} to afford`}
                  </span>
                </div>

                <div className="flex gap-2">
                  {item.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-success hover:opacity-90 transition-opacity"
                    onClick={() => markAsBought(item)}
                    disabled={!canAfford}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {canAfford ? "Mark as Bought" : "Not Yet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {wishlist.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Your wishlist is empty. Add items you want to save for!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
