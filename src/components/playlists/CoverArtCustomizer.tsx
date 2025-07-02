import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Type, Palette, Download, Undo, Redo, Square, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CoverArtCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (coverUrl: string) => void;
  playlistId?: string;
}

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

const CoverArtCustomizer: React.FC<CoverArtCustomizerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  playlistId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const templates = [
    {
      name: 'Dark Gradient',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)'
    },
    {
      name: 'Gold Gradient',
      background: 'linear-gradient(135deg, #A67C00 0%, #FFD700 100%)'
    },
    {
      name: 'Purple Gradient',
      background: 'linear-gradient(135deg, #6B46C1 0%, #A855F7 100%)'
    },
    {
      name: 'Ocean Blue',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
    }
  ];

  const fonts = [
    'Arial, sans-serif',
    'Georgia, serif',
    'Impact, sans-serif',
    'Courier New, monospace',
    'Comic Sans MS, cursive'
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      initializeCanvas();
    }
  }, [isOpen]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveToHistory();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryIndex(historyIndex - 1);
      ctx.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryIndex(historyIndex + 1);
      ctx.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(img);
        drawCanvas();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyTemplate = (template: typeof templates[0]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient from template
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    if (template.background.includes('linear-gradient')) {
      // Parse gradient colors (simplified)
      if (template.name === 'Gold Gradient') {
        gradient.addColorStop(0, '#A67C00');
        gradient.addColorStop(1, '#FFD700');
      } else if (template.name === 'Purple Gradient') {
        gradient.addColorStop(0, '#6B46C1');
        gradient.addColorStop(1, '#A855F7');
      } else if (template.name === 'Ocean Blue') {
        gradient.addColorStop(0, '#1e40af');
        gradient.addColorStop(1, '#3b82f6');
      } else {
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#4a4a4a');
      }
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawTextLayers();
    saveToHistory();
  };

  const addTextLayer = () => {
    if (!newText.trim()) return;

    const layer: TextLayer = {
      id: `text-${Date.now()}`,
      text: newText,
      x: 300,
      y: 300,
      fontSize: 48,
      color: '#ffffff',
      fontFamily: fonts[0]
    };

    setTextLayers([...textLayers, layer]);
    setNewText('');
    drawCanvas();
    saveToHistory();
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(layers =>
      layers.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
    drawCanvas();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawTextLayers();
  };

  const drawTextLayers = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    textLayers.forEach(layer => {
      ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(layer.text, layer.x, layer.y);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw selection outline if selected
      if (selectedLayer === layer.id) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        const metrics = ctx.measureText(layer.text);
        const width = metrics.width;
        const height = layer.fontSize;
        ctx.strokeRect(
          layer.x - width / 2 - 5,
          layer.y - height / 2 - 5,
          width + 10,
          height + 10
        );
      }
    });
  };

  const exportCover = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png', 0.9);
      });

      // Upload to Supabase
      const fileName = `playlist-cover-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(`playlist-covers/${fileName}`, blob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('tracks')
        .getPublicUrl(`playlist-covers/${fileName}`);

      // Update playlist if playlistId provided
      if (playlistId) {
        await supabase
          .from('playlists')
          .update({ cover_art_url: data.publicUrl })
          .eq('id', playlistId);
      }

      toast({
        title: "Success",
        description: "Cover art created successfully!",
      });

      onSuccess(data.publicUrl);
    } catch (error) {
      console.error('Error exporting cover:', error);
      toast({
        title: "Error",
        description: "Failed to export cover art",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedLayerData = textLayers.find(layer => layer.id === selectedLayer);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Cover Art Customizer</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-border rounded-lg max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
            
            {/* Canvas Controls */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCover}
                disabled={loading}
                className="ml-auto bg-gold hover:bg-gold-dark text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Background */}
            <div>
              <Label>Background</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="bg-upload"
                  />
                  <Button variant="outline" className="w-full" asChild>
                    <label htmlFor="bg-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </label>
                  </Button>
                </div>
                
                <div>
                  <Label>Color</Label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      drawCanvas();
                    }}
                    className="w-full h-10 rounded border border-border"
                  />
                </div>
              </div>
            </div>

            {/* Templates */}
            <div>
              <Label>Templates</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {templates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="text-xs"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <Label>Add Text</Label>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Enter text"
                    onKeyPress={(e) => e.key === 'Enter' && addTextLayer()}
                  />
                  <Button onClick={addTextLayer} disabled={!newText.trim()}>
                    <Type className="h-4 w-4" />
                  </Button>
                </div>

                {/* Text Layers */}
                {textLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedLayer === layer.id ? 'border-gold bg-gold/10' : 'border-border'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="text-sm font-medium">{layer.text}</div>
                    {selectedLayer === layer.id && (
                      <div className="space-y-2 mt-2">
                        <div>
                          <Label className="text-xs">Font Size</Label>
                          <Slider
                            value={[layer.fontSize]}
                            onValueChange={([value]) => updateTextLayer(layer.id, { fontSize: value })}
                            min={12}
                            max={120}
                            step={2}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <input
                            type="color"
                            value={layer.color}
                            onChange={(e) => updateTextLayer(layer.id, { color: e.target.value })}
                            className="w-full h-8 rounded border border-border"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTextLayers(layers => layers.filter(l => l.id !== layer.id));
                            setSelectedLayer(null);
                            drawCanvas();
                          }}
                          className="w-full text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverArtCustomizer;