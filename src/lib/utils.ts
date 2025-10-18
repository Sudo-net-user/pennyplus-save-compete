import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian number formatting with lakhs and crores
export function formatIndianCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let result = "";
  const amountStr = Math.floor(absAmount).toString();
  const decimal = (absAmount % 1).toFixed(2).slice(2);
  
  if (amountStr.length <= 3) {
    result = amountStr;
  } else if (amountStr.length <= 5) {
    result = amountStr.slice(0, -3) + "," + amountStr.slice(-3);
  } else if (amountStr.length <= 7) {
    result = amountStr.slice(0, -5) + "," + amountStr.slice(-5, -3) + "," + amountStr.slice(-3);
  } else {
    // For crores and above
    const lastThree = amountStr.slice(-3);
    const remaining = amountStr.slice(0, -3);
    const groups = [];
    
    for (let i = remaining.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      groups.unshift(remaining.slice(start, i));
    }
    
    result = groups.join(",") + "," + lastThree;
  }
  
  const formatted = decimal !== "00" ? `${result}.${decimal}` : result;
  return (isNegative ? "-" : "") + "₹" + formatted;
}
