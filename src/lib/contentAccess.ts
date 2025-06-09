
// Define subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

// Define access levels for content
export type AccessLevel = 'free' | 'auth' | 'basic' | 'premium' | 'enterprise';

// Check if user can access content based on access level and subscription
export const canAccessContent = (
  accessLevel: AccessLevel,
  user: any,
  userSubscriptionTier: SubscriptionTier = 'free'
): boolean => {
  // Free content is accessible to everyone
  if (accessLevel === 'free') {
    return true;
  }

  // Auth content requires user to be logged in
  if (accessLevel === 'auth') {
    return !!user;
  }

  // Subscription-based content requires user to be logged in and have appropriate tier
  if (!user) {
    return false;
  }

  // Define tier hierarchy (higher numbers = higher access)
  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3,
  };

  const accessHierarchy: Record<AccessLevel, number> = {
    free: 0,
    auth: 0,
    basic: 1,
    premium: 2,
    enterprise: 3,
  };

  const userTierLevel = tierHierarchy[userSubscriptionTier];
  const requiredLevel = accessHierarchy[accessLevel];

  return userTierLevel >= requiredLevel;
};

// Get upgrade message for locked content
export const getUpgradeMessage = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'auth':
      return 'Sign in to access this content';
    case 'basic':
      return 'Upgrade to Basic to unlock this content';
    case 'premium':
      return 'Upgrade to Premium to unlock this content';
    case 'enterprise':
      return 'Upgrade to Enterprise to unlock this content';
    default:
      return 'This content requires a subscription';
  }
};

// Get access level label for display
export const getAccessLevelLabel = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'free':
      return 'Free';
    case 'auth':
      return 'Members Only';
    case 'basic':
      return 'Basic';
    case 'premium':
      return 'Premium';
    case 'enterprise':
      return 'Enterprise';
    default:
      return 'Unknown';
  }
};

// Get access level color for badges
export const getAccessLevelColor = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'free':
      return 'bg-green-100 text-green-800';
    case 'auth':
      return 'bg-blue-100 text-blue-800';
    case 'basic':
      return 'bg-yellow-100 text-yellow-800';
    case 'premium':
      return 'bg-purple-100 text-purple-800';
    case 'enterprise':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
