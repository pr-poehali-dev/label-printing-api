import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Barcode, CheckCircle, Printer, Store } from "lucide-react";
import MarketplaceSelector from "@/components/MarketplaceSelector";
import ApiKeyForm from "@/components/ApiKeyForm";
import LabelPreview from "@/components/LabelPreview";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Barcode className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ЭтикеткиПро</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Главная
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Возможности
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Тарифы
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Поддержка
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline">Войти</Button>
            <Button>Регистрация</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-accent to-background py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Печать этикеток для маркетплейсов
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Автоматизируйте процесс создания и печати этикеток для ваших товаров на популярных площадках. Интеграция по API, быстро и без ошибок.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Начать бесплатно <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Демо-версия
                  </Button>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1627915723920-ec0cbb3b8dd0?w=800&auto=format&fit=crop&q=80"
                alt="Процесс печати этикеток"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                width={500}
                height={300}
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Поддерживаемые маркетплейсы
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Интеграция со всеми популярными площадками
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Наш сервис поддерживает все ведущие маркетплейсы России и СНГ. Подключитесь по API и начните печатать этикетки в несколько кликов.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 mt-8">
              {["Wildberries", "Ozon", "Яндекс.Маркет", "СберМегаМаркет", "AliExpress"].map((marketplace) => (
                <Card key={marketplace} className="flex flex-col items-center justify-center p-4 text-center">
                  <Store className="h-12 w-12 mb-2 text-primary" />
                  <h3 className="text-lg font-medium">{marketplace}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Как это работает
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Всего три простых шага для начала работы с нашим сервисом печати этикеток
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-8">
              {[
                {
                  icon: <Store className="h-10 w-10 text-primary" />,
                  title: "Выберите маркетплейс",
                  description: "Подключите API вашего маркетплейса к нашему сервису",
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-primary" />,
                  title: "Выберите заказы",
                  description: "Отметьте заказы, для которых нужно создать этикетки",
                },
                {
                  icon: <Printer className="h-10 w-10 text-primary" />,
                  title: "Распечатайте",
                  description: "Загрузите готовые этикетки или отправьте на принтер",
                },
              ].map((step, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute right-2 top-2 text-3xl font-bold text-muted opacity-20">
                    {index + 1}
                  </div>
                  <CardContent className="p-6 flex flex-col items-center text-center pt-6">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">{step.icon}</div>
                    <h3 className="text-xl font-medium">{step.title}</h3>
                    <p className="text-muted-foreground mt-2">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Попробуйте прямо сейчас
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Протестируйте функциональность нашего сервиса без регистрации
              </p>
            </div>

            <div className="mx-auto max-w-5xl mt-8">
              <Tabs defaultValue="marketplace" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="marketplace">Выбор маркетплейса</TabsTrigger>
                  <TabsTrigger value="api">API-подключение</TabsTrigger>
                  <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
                </TabsList>
                <TabsContent value="marketplace" className="p-4 border rounded-md mt-4">
                  <MarketplaceSelector />
                </TabsContent>
                <TabsContent value="api" className="p-4 border rounded-md mt-4">
                  <ApiKeyForm />
                </TabsContent>
                <TabsContent value="preview" className="p-4 border rounded-md mt-4">
                  <LabelPreview />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">ЭтикеткиПро</h3>
              <p className="text-sm text-muted-foreground">
                Сервис печати этикеток для маркетплейсов с API-интеграцией
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Ссылки</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/" className="hover:underline">Главная</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Возможности</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Тарифы</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Поддержка</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Маркетплейсы</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/" className="hover:underline">Wildberries</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Ozon</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Яндекс.Маркет</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">СберМегаМаркет</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Контакты</h3>
              <p className="text-sm text-muted-foreground">
                info@etiketki.pro
                <br />
                +7 (800) 123-45-67
                <br />
                Москва, ул. Примерная, 123
              </p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 ЭтикеткиПро. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;