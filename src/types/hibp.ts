// types/hibp.ts
export interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  LogoPath: string;
}

export interface PasteData {
  Source: string;
  Id: string;
  Title?: string;
  Date: string;
  EmailCount: number;
}

export interface HIBPCheckResult {
  email: string;
  isCompromised: boolean;
  breaches: BreachData[];
  pastes: PasteData[];
  checkedAt: string;
}
