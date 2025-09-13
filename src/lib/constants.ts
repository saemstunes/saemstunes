// Access control constants
export const ACCESS_LEVELS = {
  free: {
    level: 0,
    label: 'Free',
    color: 'bg-gray-500'
  },
  auth: {
    level: 1,
    label: 'Member',
    color: 'bg-blue-500'
  },
  basic: {
    level: 2,
    label: 'Basic',
    color: 'bg-green-500'
  },
  premium: {
    level: 3,
    label: 'Premium',
    color: 'bg-purple-500'
  },
  professional: {
    level: 4,
    label: 'Professional',
    color: 'bg-gold'
  }
} as const;

// Content access levels for unified learning hub
export const CONTENT_ACCESS_LEVELS = {
  free: { level: 0, label: 'Free', description: 'Available to everyone' },
  subscriber: { level: 1, label: 'Subscriber', description: 'Requires subscription' },
  pro: { level: 2, label: 'Pro', description: 'Pro tier access' },
  master: { level: 3, label: 'Master', description: 'Master tier access' },
  admin: { level: 4, label: 'Admin', description: 'Admin only' }
} as const;

// Learning content categories
export const LEARNING_CATEGORIES = {
  courses: {
    id: 'courses',
    title: 'Courses',
    description: 'Structured learning paths with lessons',
    icon: 'BookOpen'
  },
  resources: {
    id: 'resources', 
    title: 'Resources',
    description: 'Learning materials and references',
    icon: 'FileText'
  }
} as const;

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: 'free',
  basic: 'basic', 
  premium: 'premium',
  professional: 'professional'
} as const;