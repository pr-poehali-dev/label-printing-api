import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, RotateCcw, ZoomIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const sampleOrders = [
  { id: "WB-1234567", marketplace: "Wildberries", date: "2025-04-27", status: "Новый" },
  { id: "WB-1234568", marketplace: "Wildberries", date: "2025-04-27", status: "Новый" },
  { id: "WB-1234569", marketplace: "Wildberries", date: "2025-04-26", status: "Новый" }
];

const LabelPreview = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [labelFormat, setLabelFormat] = useState("a4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLabels, setGeneratedLabels] = useState(false);

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === sampleOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sampleOrders.map(order => order.id));
    }
  };

  const handleGenerateLabels = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedLabels(true);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedOrders([]);
    setGeneratedLabels(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Предпросмотр этикеток</h3>
        <p className="text-muted-foreground">
          Выберите заказы и сгенерируйте этикетки для печати
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
          
          <div className="border rounded-md divide-y">
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

            <Button
              onClick={handleGenerateLabels}
              disabled={selectedOrders.length === 0 || isGenerating}
              className="mt-2"
            >
              {isGenerating ? "Генерация..." : "Сгенерировать этикетки"}
            </Button>
          </div>
        </div>
        
        <Separator orientation="vertical" className="hidden md:block" />
        
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Предпросмотр</h4>
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
                    <img 
                      src="https://images.unsplash.com/photo-1621844551744-92e3c5f20879?w=600&auto=format&fit=crop&q=80" 
                      alt="Предпросмотр этикетки"
                      className="w-full aspect-[2/1] object-cover"
                    />
                    <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" /> Скачать PDF
                </Button>
                <Button className="w-full gap-2">
                  <Printer className="h-4 w-4" /> Печать
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                * В демо-версии представлен только предпросмотр этикеток. Для печати реальных этикеток 
                необходимо зарегистрироваться и подключить API маркетплейса.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border rounded-md p-8 h-[300px] text-center">
              <div className="text-muted-foreground space-y-2">
                <Printer className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Выберите заказы и нажмите "Сгенерировать этикетки" для предпросмотра</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelPreview;