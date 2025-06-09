
export type AccessLevel = 'free' | 'auth' | 'basic' | 'premium' | 'professional';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional';

export interface User {
  id: string;
  email?: string;
  subscribed?: boolean;
  subscriptionTier?: SubscriptionTier;
}

export interface ContentItem {
  id: string;
  accessLevel: AccessLevel;
  title: string;
}

export const getAccessLevelLabel = (level: AccessLevel): string => {
  switch (level) {
    case 'free':
      return 'Free';
    case 'auth':
      return 'Sign In Required';
    case 'basic':
      return 'Basic';
    case 'premium':
      return 'Premium';
    case 'professional':
      return 'Professional';
    default:
      return 'Unknown';
  }
};

export const getAccessLevelColor = (level: AccessLevel): string => {
  switch (level) {
    case 'free':
      return 'bg-green-100 text-green-800';
    case 'auth':
      return 'bg-blue-100 text-blue-800';
    case 'basic':
      return 'bg-yellow-100 text-yellow-800';
    case 'premium':
      return 'bg-orange-100 text-orange-800';
    case 'professional':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const canAccessContent = (
  contentAccessLevel: AccessLevel,
  user: User | null,
  userSubscriptionTier: SubscriptionTier = 'free'
): boolean => {
  // Free content is always accessible
  if (contentAccessLevel === 'free') {
    return true;
  }

  // Auth-required content needs user to be signed in
  if (contentAccessLevel === 'auth') {
    return user !== null;
  }

  // Subscription content needs user to be signed in AND have appropriate subscription
  if (contentAccessLevel === 'basic' || contentAccessLevel === 'premium' || contentAccessLevel === 'professional') {
    if (!user) return false;

    // Check subscription tier hierarchy
    const tierHierarchy: SubscriptionTier[] = ['free', 'basic', 'premium', 'professional'];
    const userTierIndex = tierHierarchy.indexOf(userSubscriptionTier);
    const requiredTierIndex = tierHierarchy.indexOf(contentAccessLevel as SubscriptionTier);
    
    return userTierIndex >= requiredTierIndex;
  }

  return false;
};

export const getContentAccessMessage = (
  contentAccessLevel: AccessLevel,
  user: User | null,
  userSubscriptionTier: SubscriptionTier = 'free'
): string => {
  if (canAccessContent(contentAccessLevel, user, userSubscriptionTier)) {
    return '';
  }

  if (contentAccessLevel === 'auth') {
    return 'Please sign in to access this content';
  }

  if (!user) {
    return `Please sign in and subscribe to ${getAccessLevelLabel(contentAccessLevel)} to access this content`;
  }

  return `${getAccessLevelLabel(contentAccessLevel)} subscription required to access this content`;
};
