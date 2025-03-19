
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Rota não encontrada:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-5xl font-bold text-red-500">404</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Página Não Encontrada</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Voltar para o Início</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
