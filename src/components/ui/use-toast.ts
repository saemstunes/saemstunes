
import { useToast, toast } from "@/hooks/use-toast";

// Re-export with proper error handling
export { useToast };

// Enhanced toast function with error handling
export const safeToast = (options: Parameters<typeof toast>[0]) => {
  try {
    return toast(options);
  } catch (error) {
    console.error('Toast error:', error);
    // Fallback to console log if toast fails
    console.log('Toast message:', options.title, options.description);
  }
};

export { toast };
