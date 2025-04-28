import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, FileSpreadsheet, Printer, RotateCcw, Upload, Zap, ZoomIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Образцы данных заказов
const sampleOrders = [
  { id: "WB-1234567", marketplace: "Wildberries", date: "2025-04-27", status: "Новый", 
    product: "Футболка хлопковая", article: "FB-12355", barcode: "4609275927183", size: "M", color: "Белый", manufacturer: "Текстильпром" },
  { id: "WB-1234568", marketplace: "Wildberries", date: "2025-04-27", status: "Новый", 
    product: "Джинсы классические", article: "JN-82731", barcode: "4609275927184", size: "32/34", color: "Синий", manufacturer: "ДжинсМастер" },
  { id: "WB-1234569", marketplace: "Wildberries", date: "2025-04-26", status: "Новый", 
    product: "Худи с принтом", article: "HD-59281", barcode: "4609275927185", size: "L", color: "Черный", manufacturer: "Текстильпром" }
];

// Типы шаблонов этикеток
type LabelTemplate = {
  id: string;
  name: string;
  previewUrl: string;
};

// Размеры термоэтикеток
type LabelSize = {
  id: string;
  name: string;
  width: number;
  height: number;
};

// Знаки маркировки
type MarkingSymbol = {
  id: string;
  name: string;
  icon: string;
};

// Шаблоны этикеток
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

// Все доступные размеры термоэтикеток
const labelSizes: LabelSize[] = [
  { id: "43x25", name: "43×25 мм", width: 43, height: 25 },
  { id: "58x30", name: "58×30 мм", width: 58, height: 30 },
  { id: "58x40", name: "58×40 мм", width: 58, height: 40 },
  { id: "58x60", name: "58×60 мм", width: 58, height: 60 },
  { id: "60x40", name: "60×40 мм", width: 60, height: 40 },
  { id: "70x30", name: "70×30 мм", width: 70, height: 30 },
  { id: "70x50", name: "70×50 мм", width: 70, height: 50 },
  { id: "80x40", name: "80×40 мм", width: 80, height: 40 },
  { id: "80x50", name: "80×50 мм", width: 80, height: 50 },
  { id: "80x60", name: "80×60 мм", width: 80, height: 60 },
  { id: "100x50", name: "100×50 мм", width: 100, height: 50 },
  { id: "100x70", name: "100×70 мм", width: 100, height: 70 },
  { id: "100x100", name: "100×100 мм", width: 100, height: 100 },
  { id: "100x150", name: "100×150 мм", width: 100, height: 150 },
  { id: "a4", name: "A4 (210×297 мм)", width: 210, height: 297 },
  { id: "a6", name: "A6 (105×148 мм)", width: 105, height: 148 },
];

// Знаки маркировки
const markingSymbols: MarkingSymbol[] = [
  { id: "eac", name: "EAC (Евразийское соответствие)", icon: "🇷🇺" },
  { id: "recycling", name: "Знак переработки", icon: "♻️" },
  { id: "mobius", name: "Петля Мебиуса", icon: "♾️" },
  { id: "paper-recycle", name: "Переработка бумаги", icon: "📄♻️" },
  { id: "plastic-type", name: "Тип пластика (PET)", icon: "PET1" },
  { id: "non-food", name: "Не продукт питания", icon: "🚫🍽️" },
  { id: "ce", name: "CE (Европейское соответствие)", icon: "CE" },
  { id: "fragile", name: "Хрупкое", icon: "💔" },
  { id: "keep-dry", name: "Беречь от влаги", icon: "☔" },
];

// Поля этикетки
type LabelField = {
  id: string;
  name: string;
  enabled: boolean;
};

const LabelPreview = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [labelSize, setLabelSize] = useState("58x30");
  const [labelTemplate, setLabelTemplate] = useState("wb-standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLabels, setGeneratedLabels] = useState(false);
  const [realtimePreview, setRealtimePreview] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [previewRefreshCount, setPreviewRefreshCount] = useState(0);
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Состояние для полей этикетки
  const [labelFields, setLabelFields] = useState<LabelField[]>([
    { id: "product", name: "Название товара", enabled: true },
    { id: "article", name: "Артикул", enabled: true },
    { id: "barcode", name: "Штрихкод", enabled: true },
    { id: "size", name: "Размер", enabled: false },
    { id: "color", name: "Цвет", enabled: false },
    { id: "manufacturer", name: "Производитель", enabled: false },
  ]);
  
  // Состояние для знаков маркировки
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  
  // Refresh preview whenever relevant settings change
  useEffect(() => {
    if (realtimePreview && selectedOrders.length > 0) {
      const timer = setTimeout(() => {
        setGeneratedLabels(true);
        setPreviewRefreshCount(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOrders, labelSize, labelTemplate, realtimePreview, zoomLevel, labelFields, selectedSymbols]);

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

  const handleFieldToggle = (fieldId: string) => {
    setLabelFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  const handleSymbolToggle = (symbolId: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbolId)
        ? prev.filter(id => id !== symbolId)
        : [...prev, symbolId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Здесь должна быть реальная логика парсинга Excel
      // Имитация импорта данных
      setTimeout(() => {
        setExcelData(sampleOrders);
        setIsImportDialogOpen(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1000);
    }
  };

  // Get current template
  const currentTemplate = labelTemplates.find(t => t.id === labelTemplate) || labelTemplates[0];
  // Get current size
  const currentSize = labelSizes.find(s => s.id === labelSize) || labelSizes[0];

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

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="template">Шаблон этикетки</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Список заказов</h4>
            <div className="flex gap-2">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Импорт из Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Импорт данных из Excel</DialogTitle>
                    <DialogDescription>
                      Загрузите файл Excel со списком товаров для создания этикеток.
                      Файл должен содержать колонки: ID, название, артикул, штрихкод и т.д.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-md p-8 cursor-pointer hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}>
                      <div className="text-center space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div className="text-sm font-medium">
                          Перетащите файл или нажмите для выбора
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Поддерживаются форматы .xlsx, .xls
                        </p>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".xlsx,.xls" 
                        onChange={handleFileUpload}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Выбрать файл
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
                className="h-8 text-xs"
              >
                {selectedOrders.length === sampleOrders.length ? "Снять выделение" : "Выбрать все"}
              </Button>
            </div>
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
                    {order.date} • {order.status} • {order.product}
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
              <Label htmlFor="format">Размер этикетки</Label>
              <Select value={labelSize} onValueChange={setLabelSize}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {labelSizes.map(size => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
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
        </TabsContent>
        
        <TabsContent value="template" className="space-y-4">
          <Accordion type="single" collapsible defaultValue="fields" className="w-full">
            <AccordionItem value="fields">
              <AccordionTrigger>Содержимое этикетки</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {labelFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`field-${field.id}`} 
                        checked={field.enabled}
                        onCheckedChange={() => handleFieldToggle(field.id)}
                      />
                      <Label 
                        htmlFor={`field-${field.id}`}
                        className="cursor-pointer"
                      >
                        {field.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="symbols">
              <AccordionTrigger>Знаки маркировки</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3">
                  {markingSymbols.map(symbol => (
                    <div key={symbol.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`symbol-${symbol.id}`} 
                        checked={selectedSymbols.includes(symbol.id)}
                        onCheckedChange={() => handleSymbolToggle(symbol.id)}
                      />
                      <Label 
                        htmlFor={`symbol-${symbol.id}`}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-base">{symbol.icon}</span>
                        <span className="text-sm">{symbol.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="custom">
              <AccordionTrigger>Пользовательские поля</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="Название поля" />
                    <Button variant="outline" size="sm" className="shrink-0">Добавить</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Здесь вы можете добавить собственные поля для отображения на этикетке.
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="pt-4">
            <h4 className="font-medium mb-3">Предпросмотр настроек</h4>
            <Card className="border-dashed p-4">
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Размер этикетки:</span> {currentSize.name}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Видимые поля:</span>{" "}
                  {labelFields.filter(f => f.enabled).map(f => f.name).join(", ") || "Нет выбранных полей"}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Знаки маркировки:</span>{" "}
                  {selectedSymbols.length > 0 
                    ? markingSymbols
                        .filter(s => selectedSymbols.includes(s.id))
                        .map(s => s.icon)
                        .join(" ")
                    : "Нет выбранных знаков"
                  }
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
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
                    <div 
                      className="relative"
                      style={{ 
                        aspectRatio: `${currentSize.width}/${currentSize.height}`,
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={currentTemplate.previewUrl}
                        alt={`Предпросмотр этикетки ${currentTemplate.name}`}
                        className="w-full h-full object-cover transition-all"
                        style={{ 
                          transform: `scale(${zoomLevel[0] / 100})`, 
                          transformOrigin: 'center' 
                        }}
                        key={`${currentTemplate.id}-${previewRefreshCount}`}
                      />
                      
                      {/* Overlay with label content */}
                      <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          {labelFields.find(f => f.id === "product" && f.enabled) && (
                            <div className="text-sm font-bold truncate">
                              {sampleOrders.find(o => o.id === selectedOrders[0])?.product || "Название товара"}
                            </div>
                          )}
                          
                          {labelFields.find(f => f.id === "article" && f.enabled) && (
                            <div className="text-xs">
                              Арт: {sampleOrders.find(o => o.id === selectedOrders[0])?.article || "Артикул"}
                            </div>
                          )}
                          
                          {labelFields.find(f => f.id === "size" && f.enabled) && (
                            <div className="text-xs">
                              Размер: {sampleOrders.find(o => o.id === selectedOrders[0])?.size || "Размер"}
                            </div>
                          )}
                          
                          {labelFields.find(f => f.id === "color" && f.enabled) && (
                            <div className="text-xs">
                              Цвет: {sampleOrders.find(o => o.id === selectedOrders[0])?.color || "Цвет"}
                            </div>
                          )}
                          
                          {labelFields.find(f => f.id === "manufacturer" && f.enabled) && (
                            <div className="text-xs">
                              Пр-ль: {sampleOrders.find(o => o.id === selectedOrders[0])?.manufacturer || "Производитель"}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          {labelFields.find(f => f.id === "barcode" && f.enabled) && (
                            <div className="bg-white text-center p-1 rounded">
                              <div className="text-xs font-mono">
                                {sampleOrders.find(o => o.id === selectedOrders[0])?.barcode || "4609275927183"}
                              </div>
                              <div className="h-6 bg-[url('https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&auto=format')] bg-contain bg-no-repeat bg-center" />
                            </div>
                          )}
                          
                          {selectedSymbols.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-end">
                              {selectedSymbols.map(symbolId => {
                                const symbol = markingSymbols.find(s => s.id === symbolId);
                                return (
                                  <div 
                                    key={symbolId} 
                                    className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    title={symbol?.name}
                                  >
                                    {symbol?.icon}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <ZoomIn className="h-4 w-4" />
                      </div>
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
                * Выбрано заказов: {selectedOrders.length} | Шаблон: {currentTemplate.name} | Размер: {currentSize.name}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabelPreview;