
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, Image, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminUpload = () => {
  const [uploadType, setUploadType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadType || !title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let uploadData = {
        title,
        description,
        category,
        created_by: null, // Admin uploads
      };

      if (uploadType === "video") {
        if (!youtubeUrl) {
          toast({
            title: "Missing YouTube URL",
            description: "Please provide a YouTube URL for video content",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }

        const { error } = await supabase
          .from("video_content")
          .insert([{
            ...uploadData,
            youtube_url: youtubeUrl,
            thumbnail_url: imageUrl || null,
            access_level: "free",
          }]);

        if (error) throw error;
      } else if (uploadType === "infographic") {
        if (!imageUrl) {
          toast({
            title: "Missing Image URL",
            description: "Please provide an image URL for infographic content",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }

        const { error } = await supabase
          .from("infographics")
          .insert([{
            ...uploadData,
            image_url: imageUrl,
            access_level: "free",
          }]);

        if (error) throw error;
      }

      toast({
        title: "Upload Successful",
        description: `${uploadType} has been uploaded successfully`,
      });

      // Reset form
      setUploadType("");
      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
      setYoutubeUrl("");
      setImageUrl("");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the content",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-gold" />
          Upload Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="upload-type">Content Type *</Label>
          <Select value={uploadType} onValueChange={setUploadType}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Content
                </div>
              </SelectItem>
              <SelectItem value="infographic">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Infographic
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter content title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter content description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category (e.g., Piano, Guitar, Voice)"
          />
        </div>

        {uploadType === "video" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL *</Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail-url">Thumbnail URL (Optional)</Label>
              <Input
                id="thumbnail-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </>
        )}

        {uploadType === "infographic" && (
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL *</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/infographic.jpg"
            />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={isUploading || !uploadType || !title}
          className="w-full bg-gold hover:bg-gold/90 text-white"
        >
          {isUploading ? "Uploading..." : "Upload Content"}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Database Constraints:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Title is required and must not be empty</li>
            <li>YouTube URL must be valid for video content</li>
            <li>Image URL must be valid for infographics</li>
            <li>Content will be set to "free" access level by default</li>
            <li>All uploads are attributed to admin (created_by = null)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUpload;
