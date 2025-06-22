// Subscription plans
export interface SubscriptionPlan {
  id: number; // Changed from string to number to match your pricing tiers
  name: string;
  price: number; // This will be in USD for reference
  interval: "month" | "quarter" | "year";
  features: string[];
  isPopular?: boolean;
  shortDescription?: string;
  annualDiscount?: number;
  tier: 'basic' | 'premium' | 'professional';
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1, // Changed to number for tier 1
    name: "Starter",
    price: 9.23, // 1200 KSh / 130 (exchange rate)
    interval: "month",
    tier: 'basic',
    shortDescription: "Perfect for beginners starting their musical journey",
    features: [
      "4 classes per month",
      "Access to beginner lessons",
      "5 infographic downloads per month",
      "Community forum access",
      "Email support",
      "Basic instrument tutorials"
    ],
  },
  {
    id: 2, // Changed to number for tier 2
    name: "Standard",
    price: 15.38, // 2000 KSh / 130
    interval: "month",
    tier: 'premium',
    shortDescription: "Ideal for regular learners committed to improvement",
    annualDiscount: 25,
    features: [
      "6 classes per month",
      "Access to all beginner and intermediate lessons",
      "Unlimited infographic downloads",
      "1 private lesson per month",
      "Community forum access",
      "Priority email support",
      "Intermediate instrument tutorials"
    ],
    isPopular: true,
  },
  {
    id: 3, // Changed to number for tier 3
    name: "Professional",
    price: 34.62, // 4500 KSh / 130
    interval: "month",
    tier: 'professional',
    shortDescription: "For serious musicians pursuing mastery",
    annualDiscount: 20,
    features: [
      "12 classes per month",
      "Access to all lessons (including advanced)",
      "Unlimited infographic downloads",
      "3 private lessons per month",
      "Priority support",
      "Advanced instrument mastery",
      "Offline access to all content",
      "Certificate of completion",
      "Performance opportunities"
    ],
  },
];
