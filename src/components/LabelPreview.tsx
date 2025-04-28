import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, Printer, RotateCcw, Zap, ZoomIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sampleOrders = [
  { id: "WB-1234567", marketplace: "Wildberries", date: "2025-04-27", status: "Новый" },
  { id: "WB-1234568", marketplace: "Wildberries", date: "2025-04-27", status: "Новый" },
  { id: "WB-1234569", marketplace: "Wildberries", date: "2025-04-26", status: "Новый" }
];

type LabelTemplate = {
  id: string;
  name: string;
  previewUrl: string;
};

const labelTemplates: LabelTemplate[] = [
  { 
    id: "wb-standard", 
    name: "Wildberries Стандарт", 
    previewUrl: "https://images.unsplash.com/photo-1621844551744-92e3c5f20879?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: "wb-mini", 
    name: "Wildberries Мини", 
    previewUrl: "https://images.unsplash.com/photo-1630594448648-12c9b4ea8cc5?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: "ozon-standard", 
    name: "Ozon Стандарт", 
    previewUrl: "https://images.unsplash.com/photo-1593789198777-f29bc259780e?w=600&auto=format&fit=crop&q=80" 
  }
];

const LabelPreview = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [labelFormat, setLabelFormat] = useState("a4");
  const [labelTemplate, setLabelTemplate] = useState("wb-standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLabels, setGeneratedLabels] = useState(false);
  const [realtimePreview, setRealtimePreview] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [previewRefreshCount, setPreviewRefreshCount] = useState(0);
  
  // Refresh preview whenever relevant settings change
  useEffect(() => {
    if (realtimePreview && selectedOrders.length > 0) {
      const timer = setTimeout(() => {
        setGeneratedLabels(true);
        setPreviewRefreshCount(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOrders, labelFormat, labelTemplate, realtimePreview, zoomLevel]);

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
    
    if (!realtimePreview && selectedOrders.length === 0) {
      setGeneratedLabels(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === sampleOrders.length) {
      setSelectedOrders([]);
      if (!realtimePreview) {
        setGeneratedLabels(false);
      }
    } else {
      setSelectedOrders(sampleOrders.map(order => order.id));
    }
  };

  const handleGenerateLabels = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedLabels(true);
      setPreviewRefreshCount(prev => prev + 1);
    }, 800);
  };

  const handleReset = () => {
    setSelectedOrders([]);
    setGeneratedLabels(false);
    setPreviewRefreshCount(0);
  };

  // Get current template
  const currentTemplate = labelTemplates.find(t => t.id === labelTemplate) || labelTemplates[0];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Предпросмотр этикеток</h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="realtime-toggle" className="text-sm">Режим реального времени</Label>
            <Switch 
              id="realtime-toggle" 
              checked={realtimePreview} 
              onCheckedChange={setRealtimePreview}
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          Выберите заказы и {realtimePreview ? "наблюдайте предпросмотр в реальном времени" : "сгенерируйте этикетки для печати"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Список заказов</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSelectAll}
              className="h-8 text-xs"
            >
              {selectedOrders.length === sampleOrders.length ? "Снять выделение" : "Выбрать все"}
            </Button>
          </div>
          
          <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
            {sampleOrders.map((order) => (
              <div key={order.id} className="flex items-center p-3">
                <Checkbox 
                  id={order.id}
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => handleOrderToggle(order.id)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <Label htmlFor={order.id} className="font-medium cursor-pointer">
                    {order.id}
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    {order.date} • {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="template">Шаблон этикетки</Label>
              <Select value={labelTemplate} onValueChange={setLabelTemplate}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Выберите шаблон" />
                </SelectTrigger>
                <SelectContent>
                  {labelTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="format">Формат этикетки</Label>
              <Select value={labelFormat} onValueChange={setLabelFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Выберите формат" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210×297 мм)</SelectItem>
                  <SelectItem value="a6">A6 (105×148 мм)</SelectItem>
                  <SelectItem value="thermal">Термоэтикетка 100×150 мм</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!realtimePreview && (
              <Button
                onClick={handleGenerateLabels}
                disabled={selectedOrders.length === 0 || isGenerating}
                className="mt-2"
              >
                {isGenerating ? "Генерация..." : "Сгенерировать этикетки"}
              </Button>
            )}
          </div>
        </div>
        
        <Separator orientation="vertical" className="hidden md:block" />
        
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Предпросмотр</h4>
              {realtimePreview && selectedOrders.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary gap-1">
                      <Zap className="h-3 w-3" />
                      Обновляется в реальном времени
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Предпросмотр этикетки обновляется автоматически при изменении параметров
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            {generatedLabels && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-8 gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" /> Сбросить
              </Button>
            )}
          </div>
          
          {generatedLabels ? (
            <div className="space-y-4">
              <Card className="overflow-hidden border-dashed border-primary/50">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Eye className="h-6 w-6" />
                      </div>
                    </div>
                    <img 
                      src={currentTemplate.previewUrl}
                      alt={`Предпросмотр этикетки ${currentTemplate.name}`}
                      className="w-full aspect-[2/1] object-cover transition-all"
                      style={{ 
                        transform: `scale(${zoomLevel[0] / 100})`, 
                        transformOrigin: 'center' 
                      }}
                      key={`${currentTemplate.id}-${previewRefreshCount}`}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="zoom-slider" className="text-sm">Масштаб: {zoomLevel[0]}%</Label>
                </div>
                <Slider 
                  id="zoom-slider"
                  value={zoomLevel}
                  onValueChange={setZoomLevel}
                  min={50}
                  max={200}
                  step={5}
                  className="py-2"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" /> Скачать PDF
                </Button>
                <Button className="w-full gap-2">
                  <Printer className="h-4 w-4" /> Печать
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                * Выбрано заказов: {selectedOrders.length} | Шаблон: {currentTemplate.name} | Формат: {labelFormat}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border rounded-md p-8 h-[300px] text-center">
              <div className="text-muted-foreground space-y-2">
                <Printer className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>
                  {realtimePreview 
                    ? "Выберите заказы для автоматического предпросмотра" 
                    : "Выберите заказы и нажмите \"Сгенерировать этикетки\" для предпросмотра"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelPreview;