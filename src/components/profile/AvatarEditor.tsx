
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider"; 
import { Camera, Upload, ZoomIn, RotateCw, CheckCircle, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Default avatars for users to choose from
const DEFAULT_AVATARS = [
  '/lovable-uploads/avatar-1.png',
  '/lovable-uploads/avatar-2.png',
  '/lovable-uploads/avatar-3.png',
  '/lovable-uploads/avatar-4.png',
  '/lovable-uploads/avatar-5.png',
  '/lovable-uploads/avatar-6.png',
  '/lovable-uploads/avatar-7.png',
  '/lovable-uploads/avatar-8.png',
];

interface AvatarEditorProps {
  currentAvatar?: string;
  username: string;
  onSave: (avatarUrl: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvatarEditor: React.FC<AvatarEditorProps> = ({ 
  currentAvatar, 
  username, 
  onSave, 
  open, 
  onOpenChange 
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("default");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  useEffect(() => {
    if (currentAvatar) {
      setSelectedAvatar(currentAvatar);
    }
  }, [currentAvatar]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setSelectedAvatar(event.target?.result as string);
      setActiveTab("upload");
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the image file.",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleDefaultAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };
  
  const handleSave = () => {
    if (selectedAvatar) {
      // Save avatar change
      onSave(selectedAvatar);
      
      // Update user profile in context for immediate effect
      if (user) {
        updateUserProfile({ ...user, avatar: selectedAvatar });
      }
      
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
      onOpenChange(false);
    }
  };
  
  const handleRemoveAvatar = () => {
    setSelectedAvatar(null);
    setUploadedImage(null);
    toast({
      title: "Avatar removed",
      description: "You can select a new avatar or use your initials.",
    });
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Avatar</DialogTitle>
          <DialogDescription>
            Choose a default avatar or upload your own image.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Avatar preview */}
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage 
                src={selectedAvatar || undefined}
                alt={username}
                style={{
                  transform: uploadedImage ? `scale(${zoom/100}) rotate(${rotation}deg)` : undefined,
                  transformOrigin: 'center'
                }}
              />
              <AvatarFallback className="text-3xl">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            
            <Badge className="absolute bottom-0 right-0 bg-gold">
              Preview
            </Badge>
          </div>
          
          {/* Tabs for avatar selection method */}
          <Tabs 
            defaultValue="default" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="default">Default Avatars</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_AVATARS.map((avatar, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-md p-1 ${
                      selectedAvatar === avatar ? 'ring-2 ring-gold bg-gold/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleDefaultAvatarSelect(avatar)}
                  >
                    <Avatar>
                      <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    
                    {selectedAvatar === avatar && (
                      <div className="absolute -top-1 -right-1 bg-gold text-white rounded-full p-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                
                <Button 
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="w-full"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : uploadedImage ? "Change Image" : "Upload Image"}
                </Button>
                
                {uploadedImage && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ZoomIn className="h-4 w-4 mr-2" />
                          <span>Zoom</span>
                        </div>
                        <span className="text-sm">{zoom}%</span>
                      </div>
                      <Slider
                        value={[zoom]}
                        min={50}
                        max={150}
                        step={1}
                        onValueChange={(values) => setZoom(values[0])}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleRotate}
                      className="w-full"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate Image
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleRemoveAvatar}
            className="w-full sm:w-auto"
          >
            <Trash className="h-4 w-4 mr-2" />
            Remove Avatar
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-gold hover:bg-gold-dark"
            disabled={!selectedAvatar}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarEditor;
