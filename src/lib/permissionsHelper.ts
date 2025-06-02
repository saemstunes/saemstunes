
import { useToast as useToastHook } from "@/hooks/use-toast";

// Define our own PermissionName type to avoid conflicts
export type DevicePermissionName = 
  | "geolocation" 
  | "notifications" 
  | "microphone" 
  | "camera"
  | "persistent-storage"
  | "midi";

// Enhanced Android WebView detection
export const isAndroidWebView = (): boolean => {
  const userAgent = navigator.userAgent;
  return userAgent.includes('SaemsTunesApp') || // Your custom user agent
         userAgent.includes('wv') || // WebView indicator
         (window.Android !== undefined) || // JavaScript interface
         userAgent.includes('Android') && userAgent.includes('Version/');
};

// PWA Detection Helper
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://') ||
         isAndroidWebView();
};

// Enhanced permission handler for Android WebView and PWA contexts
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
    const isInAndroidApp = isAndroidWebView();
    const isInPWA = isPWA();
    
    console.log(`Requesting ${permissionName} permission in ${isInAndroidApp ? 'Android WebView' : isInPWA ? 'PWA' : 'browser'} context`);

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

    // If denied, show different messages for Android/PWA vs browser
    if (currentState === "denied") {
      if (isInAndroidApp) {
        console.error(`${permissionName} permission denied in Android WebView. User may need to check device settings.`);
      } else if (isInPWA) {
        console.error(`${permissionName} permission denied in PWA. User may need to check device settings.`);
      }
      return false;
    }

    // For microphone/camera permission, use the mediaDevices API
    if (permissionName === "microphone" || permissionName === "camera") {
      const constraints: MediaStreamConstraints = {};
      if (permissionName === "microphone") {
        constraints.audio = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        };
      }
      if (permissionName === "camera") {
        constraints.video = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        };
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Stop all tracks to release the device immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err: any) {
        console.error(`${permissionName} access error:`, err);
        
        // More specific error handling for Android WebView
        if (isInAndroidApp) {
          console.error(`Android WebView Context: ${permissionName} permission may need to be enabled in device settings`);
        }
        return false;
      }
    }

    // For other permissions, handle differently based on type
    if (permissionName === "geolocation") {
      return new Promise((resolve) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          (error) => {
            console.error('Geolocation error:', error);
            if (isInAndroidApp) {
              console.error('Android WebView Context: Location permission may need device settings adjustment');
            }
            resolve(false);
          },
          options
        );
      });
    } else if (permissionName === "notifications") {
      try {
        const result = await Notification.requestPermission();
        const granted = result === "granted";
        if (!granted && isInAndroidApp) {
          console.error('Android WebView Context: Notification permission may need device settings adjustment');
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
    
    const isInAndroidApp = isAndroidWebView();
    const isInPWA = isPWA();
    
    if (granted) {
      toast({
        title: "Permission granted",
        description: `Access to ${permissionName} has been granted.`,
      });
      return true;
    } else {
      const baseMessage = `${purpose} requires access to your ${permissionName}.`;
      let extraMessage = "";
      
      if (isInAndroidApp) {
        extraMessage = " Since you're using the Android app, you may need to enable this in your device settings under Apps > Saem's Tunes > Permissions.";
      } else if (isInPWA) {
        extraMessage = " Since you're using the app version, you may need to enable this in your device settings.";
      } else {
        extraMessage = " Please enable it in your browser settings.";
      }
      
      toast({
        title: "Permission required",
        description: baseMessage + extraMessage,
        variant: "destructive",
        duration: 10000, // Longer duration for users who need to check settings
      });
      return false;
    }
  };
  
  // Additional helper to check if we're in Android WebView mode
  const checkAndroidWebViewMode = () => {
    const isInAndroidApp = isAndroidWebView();
    if (isInAndroidApp) {
      console.log('App is running in Android WebView mode');
    }
    return isInAndroidApp;
  };
  
  return { 
    requestPermissionWithFeedback, 
    isAndroidWebView: checkAndroidWebViewMode,
    isPWA
  };
};

// Helper function to show Android-specific permission guidance
export const showAndroidPermissionGuide = (permissionType: DevicePermissionName) => {
  const messages = {
    microphone: 'For audio features to work in the Android app, please:\n1. Go to your device Settings\n2. Find "Apps" or "Application Manager"\n3. Find "Saem\'s Tunes"\n4. Tap "Permissions"\n5. Enable Microphone access',
    camera: 'For camera features to work in the Android app, please:\n1. Go to your device Settings\n2. Find "Apps" or "Application Manager"\n3. Find "Saem\'s Tunes"\n4. Tap "Permissions"\n5. Enable Camera access',
    geolocation: 'For location features to work in the Android app, please enable Location access in your device settings under Apps > Saem\'s Tunes > Permissions',
    notifications: 'For notifications to work in the Android app, please enable Notification access in your device settings under Apps > Saem\'s Tunes > Permissions',
    'persistent-storage': 'For offline features to work properly, please allow storage access in your device settings',
    midi: 'For MIDI device features, please enable MIDI access in your device settings'
  };
  
  return messages[permissionType] || 'Please check your device settings for app permissions under Apps > Saem\'s Tunes > Permissions.';
};

// Android WebView enhanced permission manager for global use
class AndroidWebViewPermissions {
  permissions: Record<string, boolean>;
  isAndroidApp: boolean;

  constructor() {
    this.permissions = {
      microphone: false,
      camera: false,
      geolocation: false,
      notifications: false
    };
    this.isAndroidApp = isAndroidWebView();
  }

  async requestMicrophone() {
    return await requestPermission('microphone', 'Audio recording and music features');
  }

  async requestCamera() {
    return await requestPermission('camera', 'Video recording and visual features');
  }

  async requestLocation() {
    return await requestPermission('geolocation', 'Location-based music discovery');
  }

  async requestNotifications() {
    return await requestPermission('notifications', 'Music updates and lesson reminders');
  }

  // Initialize permissions for Android app with user interaction detection
  async initializeAndroidPermissions() {
    console.log('Initializing Android WebView permissions...');

    // Wait for user interaction before requesting permissions
    const requestPermissions = async () => {
      console.log('User interaction detected, requesting permissions...');

      // Request permissions with delays to avoid overwhelming the user
      setTimeout(() => this.requestMicrophone(), 500);
      setTimeout(() => this.requestLocation(), 1000);
      setTimeout(() => this.requestNotifications(), 1500);

      // Remove the event listener after first use
      document.removeEventListener('touchstart', requestPermissions);
      document.removeEventListener('click', requestPermissions);
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', requestPermissions, { once: true });
    document.addEventListener('click', requestPermissions, { once: true });
  }

  showAndroidPermissionDialog(message: string) {
    // Create a more native-looking dialog for Android
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    dialog.innerHTML = `
      <div style="
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin: 20px;
        max-width: 300px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      ">
        <h3 style="margin: 0 0 15px 0; color: #333;">Permission Required</h3>
        <p style="margin: 0 0 20px 0; color: #666; line-height: 1.4;">${message}</p>
        <button onclick="this.closest('div').remove()" style="
          background: #C9A66B;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        ">OK</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (dialog.parentNode) {
        dialog.remove();
      }
    }, 10000);
  }
}

// Create global instance
export const androidPermissions = new AndroidWebViewPermissions();

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (androidPermissions.isAndroidApp) {
      console.log('Android WebView detected');
      androidPermissions.initializeAndroidPermissions();
    }
  });
}
