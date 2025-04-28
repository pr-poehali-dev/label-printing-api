import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowRight, CheckCircle2, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleValidate = () => {
    if (!apiKey || !apiEndpoint) {
      setHasError(true);
      return;
    }

    setIsValidating(true);
    setHasError(false);
    
    // Имитация запроса API
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Настройка API-подключения</h3>
        <p className="text-muted-foreground">
          Введите данные для подключения к API маркетплейса
        </p>
      </div>

      <Tabs defaultValue="api-key" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="api-key">API-ключ</TabsTrigger>
          <TabsTrigger value="oauth">OAuth</TabsTrigger>
        </TabsList>
        <TabsContent value="api-key" className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API-ключ</Label>
              <Input
                id="api-key"
                placeholder="Введите ваш API-ключ"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Для получения API-ключа перейдите в личный кабинет маркетплейса, 
                раздел "Интеграции" или "API"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint (опционально)</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>

            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Пожалуйста, заполните все обязательные поля
                </AlertDescription>
              </Alert>
            )}

            {isValidated && !hasError && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  API-ключ успешно проверен! Теперь вы можете получить этикетки.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="oauth" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Key className="h-12 w-12 text-primary opacity-80" />
                <div className="space-y-1">
                  <h4 className="text-lg font-medium">OAuth-авторизация</h4>
                  <p className="text-sm text-muted-foreground">
                    Безопасная авторизация через OAuth доступна в полной версии сервиса.
                    Зарегистрируйтесь, чтобы получить доступ.
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  Подробнее о полной версии
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleValidate} 
          disabled={isValidating || isValidated}
          className="gap-2"
        >
          {isValidating ? "Проверка..." : "Проверить подключение"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyForm;