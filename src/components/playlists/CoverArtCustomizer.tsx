
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Download, 
  Palette, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon,
  Undo,
  Redo,
  Save,
  X,
  Plus,
  Minus,
  RotateCw,
  Crop,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CoverArtCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
  initialImage?: string;
}

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  opacity: number;
}

interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
}

const CoverArtCustomizer: React.FC<CoverArtCustomizerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [gradientColors, setGradientColors] = useState(['#1a1a1a', '#3a3a3a']);
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0
  });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Templates
  const templates = [
    {
      id: 'gospel-classic',
      name: 'Gospel Classic',
      background: { type: 'gradient', colors: ['#2D1B69', '#11152A'] },
      category: 'gospel'
    },
    {
      id: 'modern-worship',
      name: 'Modern Worship',
      background: { type: 'gradient', colors: ['#667eea', '#764ba2'] },
      category: 'worship'
    },
    {
      id: 'acoustic-warm',
      name: 'Acoustic Warm',
      background: { type: 'gradient', colors: ['#f093fb', '#f5576c'] },
      category: 'acoustic'
    },
    {
      id: 'minimal-gold',
      name: 'Minimal Gold',
      background: { type: 'gradient', colors: ['#A67C00', '#D4A936'] },
      category: 'minimal'
    },
    {
      id: 'dark-elegance',
      name: 'Dark Elegance',
      background: { type: 'solid', color: '#0a0a0a' },
      category: 'dark'
    },
    {
      id: 'bright-energy',
      name: 'Bright Energy',
      background: { type: 'gradient', colors: ['#FF6B6B', '#4ECDC4'] },
      category: 'energetic'
    }
  ];

  const fonts = [
    'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana',
    'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino', 'Garamond'
  ];

  // Initialize canvas
  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, backgroundImage, backgroundColor, gradientColors, backgroundType, textLayers, filters]);

  // Save to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(dataURL);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 600, 600);

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;

    // Draw background
    if (backgroundType === 'solid') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, 600, 600);
    } else if (backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 600, 600);
      gradient.addColorStop(0, gradientColors[0]);
      gradient.addColorStop(1, gradientColors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 600);
    } else if (backgroundType === 'image' && backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, 600, 600);
    }

    // Reset filter for text
    ctx.filter = 'none';

    // Draw text layers
    textLayers.forEach(layer => {
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.textAlign = 'center';
      ctx.fillText(layer.text, layer.x, layer.y);
      ctx.restore();
    });
  }, [backgroundImage, backgroundColor, gradientColors, backgroundType, textLayers, filters]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(img);
        setBackgroundType('image');
        saveToHistory();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Add text layer
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'New Text',
      x: 300,
      y: 300,
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Arial',
      opacity: 1
    };
    setTextLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    saveToHistory();
  };

  // Update text layer
  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };

  // Delete text layer
  const deleteTextLayer = (id: string) => {
    setTextLayers(prev => prev.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
    saveToHistory();
  };

  // Apply template
  const applyTemplate = (template: any) => {
    if (template.background.type === 'solid') {
      setBackgroundType('solid');
      setBackgroundColor(template.background.color);
    } else if (template.background.type === 'gradient') {
      setBackgroundType('gradient');
      setGradientColors(template.background.colors);
    }
    saveToHistory();
  };

  // Export canvas
  const exportCanvas = (format: 'png' | 'jpg' = 'png', quality = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL(`image/${format}`, quality);
    const link = document.createElement('a');
    link.download = `cover-art.${format}`;
    link.href = dataURL;
    link.click();
  };

  // Save and close
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    onSave(dataURL);
    onClose();
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      // Apply previous state logic here
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      // Apply next state logic here
    }
  };

  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-gold" />
            Cover Art Customizer
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Canvas (600x600)</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
                      <Redo className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportCanvas('png')}>
                      <Download className="h-4 w-4" />
                      PNG
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportCanvas('jpg', 0.9)}>
                      <Download className="h-4 w-4" />
                      JPG
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative border-2 border-border rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="max-w-full h-auto"
                    onClick={(e) => {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      const x = ((e.clientX - rect.left) / rect.width) * 600;
                      const y = ((e.clientY - rect.top) / rect.height) * 600;
                      
                      if (selectedLayer) {
                        updateTextLayer(selectedLayerId!, { x, y });
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="background" className="text-xs">BG</TabsTrigger>
                <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
                <TabsTrigger value="filters" className="text-xs">FX</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              </TabsList>

              {/* Background Tab */}
              <TabsContent value="background" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={backgroundType === 'solid' ? 'default' : 'outline'}
                        onClick={() => setBackgroundType('solid')}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Solid
                      </Button>
                      <Button
                        size="sm"
                        variant={backgroundType === 'gradient' ? 'default' : 'outline'}
                        onClick={() => setBackgroundType('gradient')}
                      >
                        <Circle className="h-4 w-4 mr-1" />
                        Gradient
                      </Button>
                      <Button
                        size="sm"
                        variant={backgroundType === 'image' ? 'default' : 'outline'}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {backgroundType === 'solid' && (
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                    )}

                    {backgroundType === 'gradient' && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium">Color 1</label>
                          <input
                            type="color"
                            value={gradientColors[0]}
                            onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                            className="w-full h-8 rounded border"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Color 2</label>
                          <input
                            type="color"
                            value={gradientColors[1]}
                            onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                            className="w-full h-8 rounded border"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Text Layers</CardTitle>
                      <Button size="sm" onClick={addTextLayer}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                    {textLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`p-2 border rounded cursor-pointer ${
                          selectedLayerId === layer.id ? 'border-gold bg-gold/10' : 'border-border'
                        }`}
                        onClick={() => setSelectedLayerId(layer.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">{layer.text}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTextLayer(layer.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {selectedLayer && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Edit Text</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Text</label>
                        <Input
                          value={selectedLayer.text}
                          onChange={(e) => updateTextLayer(selectedLayerId!, { text: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Font</label>
                        <select
                          value={selectedLayer.fontFamily}
                          onChange={(e) => updateTextLayer(selectedLayerId!, { fontFamily: e.target.value })}
                          className="w-full mt-1 p-2 border rounded"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Size: {selectedLayer.fontSize}px</label>
                        <Slider
                          value={[selectedLayer.fontSize]}
                          onValueChange={([value]) => updateTextLayer(selectedLayerId!, { fontSize: value })}
                          min={12}
                          max={120}
                          step={1}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <input
                          type="color"
                          value={selectedLayer.color}
                          onChange={(e) => updateTextLayer(selectedLayerId!, { color: e.target.value })}
                          className="w-full h-8 rounded border mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Opacity: {Math.round(selectedLayer.opacity * 100)}%</label>
                        <Slider
                          value={[selectedLayer.opacity]}
                          onValueChange={([value]) => updateTextLayer(selectedLayerId!, { opacity: value })}
                          min={0}
                          max={1}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Filters Tab */}
              <TabsContent value="filters" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Image Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Brightness: {filters.brightness}%</label>
                      <Slider
                        value={[filters.brightness]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, brightness: value }))}
                        min={0}
                        max={200}
                        step={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Contrast: {filters.contrast}%</label>
                      <Slider
                        value={[filters.contrast]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, contrast: value }))}
                        min={0}
                        max={200}
                        step={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Saturation: {filters.saturation}%</label>
                      <Slider
                        value={[filters.saturation]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, saturation: value }))}
                        min={0}
                        max={200}
                        step={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Blur: {filters.blur}px</label>
                      <Slider
                        value={[filters.blur]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, blur: value }))}
                        min={0}
                        max={10}
                        step={0.5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Hue: {filters.hue}°</label>
                      <Slider
                        value={[filters.hue]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, hue: value }))}
                        min={0}
                        max={360}
                        step={5}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={() => setFilters({
                        brightness: 100,
                        contrast: 100,
                        saturation: 100,
                        blur: 0,
                        hue: 0
                      })}
                      variant="outline"
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-gold transition-colors"
                      onClick={() => applyTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <div
                          className="w-full h-20 rounded mb-2"
                          style={{
                            background: template.background.type === 'gradient'
                              ? `linear-gradient(135deg, ${template.background.colors[0]}, ${template.background.colors[1]})`
                              : template.background.color
                          }}
                        />
                        <div className="text-xs font-medium">{template.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-gold hover:bg-gold-dark text-white">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverArtCustomizer;
