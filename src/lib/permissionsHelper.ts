
import { useToast as useToastHook } from "@/hooks/use-toast";

// Define our own PermissionName type to avoid conflicts
export type DevicePermissionName = 
  | "geolocation" 
  | "notifications" 
  | "microphone" 
  | "camera"
  | "persistent-storage"
  | "midi";

// PWA Detection Helper
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

// Enhanced permission handler for PWA contexts
export const requestPermission = async (
  permissionName: DevicePermissionName,
  purpose: string
): Promise<boolean> => {
  // Check if the Permissions API is supported
  if (!("permissions" in navigator)) {
    console.error("Permissions API is not supported in this browser");
    return false;
  }

  try {
    // For PWA contexts, we need to handle permissions more explicitly
    const isInPWA = isPWA();
    console.log(`Requesting ${permissionName} permission in ${isInPWA ? 'PWA' : 'browser'} context`);

    // Check current permission status first
    let currentState = 'prompt';
    try {
      const { state } = await navigator.permissions.query({ 
        name: permissionName as PermissionName 
      });
      currentState = state;
    } catch (queryError) {
      console.warn('Permission query failed, proceeding with request:', queryError);
    }

    // If already granted, return true
    if (currentState === "granted") {
      return true;
    }

    // If denied, show different messages for PWA vs browser
    if (currentState === "denied") {
      if (isInPWA) {
        console.error(`${permissionName} permission denied in PWA. User may need to check device settings.`);
      }
      return false;
    }

    // For microphone/camera permission, use the mediaDevices API
    if (permissionName === "microphone" || permissionName === "camera") {
      const constraints: MediaStreamConstraints = {};
      if (permissionName === "microphone") constraints.audio = true;
      if (permissionName === "camera") constraints.video = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Stop all tracks to release the device immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err) {
        console.error(`${permissionName} access error:`, err);
        
        // More specific error handling for PWA
        if (isInPWA) {
          console.error(`PWA Context: ${permissionName} permission may need to be enabled in device settings`);
        }
        return false;
      }
    }

    // For other permissions, handle differently based on type
    if (permissionName === "geolocation") {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          (error) => {
            console.error('Geolocation error:', error);
            if (isInPWA) {
              console.error('PWA Context: Location permission may need device settings adjustment');
            }
            resolve(false);
          }
        );
      });
    } else if (permissionName === "notifications") {
      try {
        const result = await Notification.requestPermission();
        const granted = result === "granted";
        if (!granted && isInPWA) {
          console.error('PWA Context: Notification permission may need device settings adjustment');
        }
        return granted;
      } catch (err) {
        console.error("Notification permission error:", err);
        return false;
      }
    } else {
      // For other permission types, we can't easily request them programmatically
      console.warn(`No standard way to request ${permissionName} permission`);
      return false;
    }
    
  } catch (error) {
    console.error(`Error requesting ${permissionName} permission:`, error);
    return false;
  }
};

// Hook for requesting permissions with toast feedback
export const usePermissionRequest = () => {
  const { toast } = useToastHook();
  
  const requestPermissionWithFeedback = async (
    permissionName: DevicePermissionName,
    purpose: string
  ): Promise<boolean> => {
    const granted = await requestPermission(permissionName, purpose);
    
    const isInPWA = isPWA();
    
    if (granted) {
      toast({
        title: "Permission granted",
        description: `Access to ${permissionName} has been granted.`,
      });
      return true;
    } else {
      const baseMessage = `${purpose} requires access to your ${permissionName}.`;
      const pwaMessage = isInPWA 
        ? " Since you're using the app version, you may need to enable this in your device settings."
        : " Please enable it in your browser settings.";
      
      toast({
        title: "Permission required",
        description: baseMessage + pwaMessage,
        variant: "destructive",
        duration: 8000, // Longer duration for PWA users who need to check settings
      });
      return false;
    }
  };
  
  // Additional helper to check if we're in PWA mode
  const checkPWAMode = () => {
    const isInPWA = isPWA();
    if (isInPWA) {
      console.log('App is running in PWA mode');
    }
    return isInPWA;
  };
  
  return { 
    requestPermissionWithFeedback, 
    isPWA: checkPWAMode 
  };
};

// Helper function to show PWA-specific permission guidance
export const showPWAPermissionGuide = (permissionType: DevicePermissionName) => {
  const messages = {
    microphone: 'For audio features to work in the app version, please:\n1. Go to your device settings\n2. Find "App Permissions" or "Site Settings"\n3. Enable Microphone access for Saem\'s Tunes',
    camera: 'For camera features to work in the app version, please:\n1. Go to your device settings\n2. Find "App Permissions" or "Site Settings"\n3. Enable Camera access for Saem\'s Tunes',
    geolocation: 'For location features to work in the app version, please enable Location access in your device settings',
    notifications: 'For notifications to work in the app version, please enable Notification access in your device settings',
    'persistent-storage': 'For offline features to work properly, please allow storage access',
    midi: 'For MIDI device features, please enable MIDI access in your device settings'
  };
  
  return messages[permissionType] || 'Please check your device settings for app permissions.';
};
