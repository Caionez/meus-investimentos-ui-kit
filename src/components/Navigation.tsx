
import { Home, List, Plus, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

  interface NavigationProps {
    title?: string;
    showBack?: boolean;
    showAdd?: boolean;
  }
  
  export const Navigation = ({ title = "MI", showBack = false, showAdd = false }: NavigationProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setTheme, theme } = useTheme(); 
    
  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 md3-elevation-2">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        {showAdd && (
          <Link to="/investments/add">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/10"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        )}
        {/* Botão de troca de tema */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation - only show on main screens */}
      {!showBack && (
        <div className="flex justify-around py-2 bg-primary/90 backdrop-blur-sm border-t border-white/10">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              location.pathname === '/' 
                ? 'bg-white/20 text-primary-foreground' 
                : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link
            to="/investments"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              location.pathname === '/investments' 
                ? 'bg-white/20 text-primary-foreground' 
                : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
            }`}
          >
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Investimentos</span>
          </Link>
        </div>
      )}
    </div>
  );
};
