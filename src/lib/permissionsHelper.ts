
import { useToast as useToastHook } from "@/hooks/use-toast";

// Device permissions helper
export const requestPermission = async (
  permissionName: PermissionName,
  purpose: string
): Promise<boolean> => {
  // Check if the Permissions API is supported
  if (!("permissions" in navigator)) {
    console.error("Permissions API is not supported in this browser");
    return false;
  }

  try {
    // Check current permission status
    const { state } = await navigator.permissions.query({ name: permissionName });

    // If already granted, return true
    if (state === "granted") {
      return true;
    }

    // If denied, show a message but don't prompt again
    if (state === "denied") {
      // We can't directly show toast here as it's not a component
      // Toast will need to be shown by the caller
      return false;
    }

    // For microphone/camera permission, use the mediaDevices API
    if (permissionName === "microphone" || permissionName === "camera") {
      const constraints: MediaStreamConstraints = {};
      if (permissionName === "microphone") constraints.audio = true;
      if (permissionName === "camera") constraints.video = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Stop all tracks to release the device
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err) {
        console.error(`${permissionName} access error:`, err);
        return false;
      }
    }

    // For other permissions, use the permissions API
    // Note: This is a prompt request
    const result = await navigator.permissions.request({ name: permissionName });
    return result.state === "granted";
    
  } catch (error) {
    console.error(`Error requesting ${permissionName} permission:`, error);
    return false;
  }
};

// Hook for requesting permissions with toast feedback
export const usePermissionRequest = () => {
  const { toast } = useToastHook();
  
  const requestPermissionWithFeedback = async (
    permissionName: PermissionName,
    purpose: string
  ): Promise<boolean> => {
    const granted = await requestPermission(permissionName, purpose);
    
    if (granted) {
      toast({
        title: "Permission granted",
        description: `Access to ${permissionName} has been granted.`,
      });
      return true;
    } else {
      toast({
        title: "Permission required",
        description: `${purpose} requires access to your ${permissionName}. Please enable it in your browser settings.`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { requestPermissionWithFeedback };
};

// Type definition for PermissionName
type PermissionName = 
  | "geolocation" 
  | "notifications" 
  | "microphone" 
  | "camera"
  | "persistent-storage"
  | "midi";
