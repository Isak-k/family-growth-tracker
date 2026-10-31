import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Home, LayoutDashboard, BookOpen, ClipboardList, BarChart3, Compass, MoreHorizontal, Settings, Users, Sun, Moon, BookHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // Primary nav items (shown in bottom bar on mobile)
  const primaryNavLinks = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/academics', label: t('nav.academics'), icon: BookOpen },
    { href: '/results', label: t('results') || 'Results', icon: ClipboardList },
  ];

  // Secondary nav items (in "more" menu on mobile)
  const secondaryNavLinks = [
    { href: '/islamic-learning', label: 'Islamic Learning', icon: BookHeart },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/guidance', label: t('nav.guidance'), icon: Compass },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isActive = (path: string) => location.pathname === path;

  // Mobile Bottom Navigation Bar
  const MobileBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {primaryNavLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive(link.href) && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium truncate max-w-[56px]",
                isActive(link.href) && "font-semibold"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
        
        {/* More Menu Button */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                secondaryNavLinks.some(link => isActive(link.href))
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl pb-8">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-center">More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-4 gap-4">
              {secondaryNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-xl",
                      isActive(link.href) ? "bg-primary/20" : "bg-background"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-center">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 space-y-4">
              <LanguageSelector />
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMoreOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMoreOpen(false)}>
                  <Button variant="hero" className="w-full">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );

  // Mobile Top Header (simplified)
  const MobileTopHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-lg font-semibold text-foreground">
            EduFamily
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              EduFamily
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {allNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <LanguageSelector />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">
                {t('nav.signup')}
              </Button>
            </Link>
          </div>

          {/* Tablet Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Tablet Menu (only for medium screens that aren't mobile) */}
        {isOpen && !isMobile && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-2">
              {allNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-border/50 space-y-3">
                <LanguageSelector />
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">
                      {t('nav.signup')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  if (isMobile) {
    return (
      <>
        <MobileTopHeader />
        <MobileBottomNav />
      </>
    );
  }

  return <DesktopNav />;
}
