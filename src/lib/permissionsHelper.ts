
import { useToast } from "@/hooks/use-toast";

type PermissionType = "microphone" | "camera" | "geolocation" | "notifications";

export async function requestPermission(
  permissionType: PermissionType,
  options?: { toast?: ReturnType<typeof useToast> }
): Promise<boolean> {
  const { toast } = options || {};
  
  try {
    switch (permissionType) {
      case "microphone":
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Clean up the stream after getting permission
        audioStream.getTracks().forEach(track => track.stop());
        return true;
        
      case "camera":
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Clean up the stream after getting permission
        videoStream.getTracks().forEach(track => track.stop());
        return true;
        
      case "geolocation":
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false)
          );
        });
        
      case "notifications":
        if (!("Notification" in window)) {
          toast?.({
            title: "Notifications not supported",
            description: "Your browser doesn't support notifications.",
            variant: "destructive",
          });
          return false;
        }
        
        const permission = await Notification.requestPermission();
        return permission === "granted";
        
      default:
        console.error("Unknown permission type:", permissionType);
        return false;
    }
  } catch (error) {
    console.error(`Error requesting ${permissionType} permission:`, error);
    
    toast?.({
      title: "Permission Denied",
      description: `Please grant ${permissionType} access in your browser settings to use this feature.`,
      variant: "destructive",
    });
    
    return false;
  }
}

export function checkPermissionStatus(
  permissionType: PermissionType
): Promise<PermissionState | null> {
  return new Promise((resolve) => {
    try {
      switch (permissionType) {
        case "microphone":
          navigator.permissions
            .query({ name: "microphone" as PermissionName })
            .then(result => resolve(result.state));
          break;
          
        case "camera":
          navigator.permissions
            .query({ name: "camera" as PermissionName })
            .then(result => resolve(result.state));
          break;
          
        case "geolocation":
          navigator.permissions
            .query({ name: "geolocation" })
            .then(result => resolve(result.state));
          break;
          
        case "notifications":
          if (!("Notification" in window)) {
            resolve(null);
            return;
          }
          
          if (Notification.permission === "granted") {
            resolve("granted");
          } else if (Notification.permission === "denied") {
            resolve("denied");
          } else {
            resolve("prompt");
          }
          break;
          
        default:
          console.error("Unknown permission type:", permissionType);
          resolve(null);
      }
    } catch (error) {
      console.error(`Error checking ${permissionType} permission status:`, error);
      resolve(null);
    }
  });
}
