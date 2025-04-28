import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Store } from "lucide-react";

interface Marketplace {
  id: string;
  name: string;
  description: string;
  apiUrl: string;
}

const marketplaces: Marketplace[] = [
  {
    id: "wildberries",
    name: "Wildberries",
    description: "Интеграция с API Wildberries для создания и печати этикеток",
    apiUrl: "https://suppliers-api.wildberries.ru"
  },
  {
    id: "ozon",
    name: "Ozon",
    description: "Интеграция с Ozon Seller API для получения и печати этикеток",
    apiUrl: "https://api-seller.ozon.ru"
  },
  {
    id: "yandex",
    name: "Яндекс.Маркет",
    description: "Создание этикеток для Яндекс.Маркета через партнерский API",
    apiUrl: "https://api.partner.market.yandex.ru"
  }
];

const MarketplaceSelector = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Выберите маркетплейс</h3>
        <p className="text-muted-foreground">
          Укажите площадку, для которой вы хотите создать этикетки
        </p>
      </div>

      <RadioGroup
        value={selectedMarketplace || ""}
        onValueChange={setSelectedMarketplace}
        className="grid gap-4 md:grid-cols-3"
      >
        {marketplaces.map((marketplace) => (
          <div key={marketplace.id}>
            <RadioGroupItem
              value={marketplace.id}
              id={marketplace.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={marketplace.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Store className="mb-3 h-8 w-8 text-primary" />
              <div className="text-center">
                <h4 className="text-base font-medium">{marketplace.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {marketplace.description}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium">Дополнительные маркетплейсы</h4>
            <p className="text-sm text-muted-foreground">
              СберМегаМаркет, AliExpress и другие площадки доступны в полной версии сервиса
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={!selectedMarketplace} className="gap-2">
          Продолжить
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceSelector;